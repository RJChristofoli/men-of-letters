#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import Ajv2020 from "ajv/dist/2020.js";
import YAML from "yaml";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];

function relative(file) {
  return path.relative(root, file).split(path.sep).join("/") || ".";
}

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function readStructured(file) {
  const source = read(file);
  try {
    return file.endsWith(".json") ? JSON.parse(source) : YAML.parse(source);
  } catch (error) {
    errors.push(`${file}: cannot parse: ${error.message}`);
    return null;
  }
}

function validateSchema(schemaFile, dataFile, data) {
  if (data === null) return;
  const schema = readStructured(schemaFile);
  if (schema === null) return;
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  const validate = ajv.compile(schema);
  if (!validate(data)) {
    for (const issue of validate.errors ?? []) {
      errors.push(`${dataFile}${issue.instancePath || "/"}: ${issue.message}`);
    }
  }
}

function duplicates(values) {
  const seen = new Set();
  return values.filter((value) => {
    if (seen.has(value)) return true;
    seen.add(value);
    return false;
  });
}

function validateGraph(nodes, edges, label) {
  const visiting = new Set();
  const visited = new Set();

  function visit(node, trail) {
    if (visiting.has(node)) {
      errors.push(`${label}: dependency cycle ${[...trail, node].join(" -> ")}`);
      return;
    }
    if (visited.has(node)) return;
    visiting.add(node);
    for (const dependency of edges.get(node) ?? []) {
      visit(dependency, [...trail, node]);
    }
    visiting.delete(node);
    visited.add(node);
  }

  for (const node of nodes) visit(node, []);
}

function walk(directory) {
  const found = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if ([".git", ".serena", "node_modules"].includes(entry.name)) continue;
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) found.push(...walk(target));
    else found.push(target);
  }
  return found;
}

function validateMarkdown() {
  for (const file of walk(root).filter((candidate) => candidate.endsWith(".md"))) {
    const source = fs.readFileSync(file, "utf8");
    const name = relative(file);
    if (!source.endsWith("\n")) errors.push(`${name}: missing final newline`);
    if (source.endsWith("\n\n")) errors.push(`${name}: extra blank line at EOF`);
    source.split("\n").forEach((line, index) => {
      if (/[ \t]+$/.test(line)) {
        errors.push(`${name}:${index + 1}: trailing whitespace`);
      }
    });

    for (const match of source.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
      let target = match[1].trim();
      if (/^(?:https?:|mailto:|#)/.test(target)) continue;
      if (target.startsWith("<") && target.endsWith(">")) {
        target = target.slice(1, -1);
      }
      target = decodeURI(target.split("#", 1)[0]);
      const resolved = path.normalize(path.join(path.dirname(file), target));
      if (!fs.existsSync(resolved)) {
        errors.push(`${name}: missing local link ${match[1]}`);
      }
    }
  }
}

function validateSkill(capability) {
  if (capability.source === null) {
    if (!["proposed", "retired"].includes(capability.status)) {
      errors.push(`${capability.id}: ${capability.status} capability needs a source`);
    }
    return;
  }

  const absolute = path.join(root, capability.source);
  if (!fs.existsSync(absolute)) {
    errors.push(`${capability.id}: source does not exist: ${capability.source}`);
    return;
  }

  if (capability.type === "policy") {
    if (capability.source !== `policies/${capability.id}.md`) {
      errors.push(`${capability.id}: policy source must be policies/<id>.md`);
    }
    const policySource = fs.readFileSync(absolute, "utf8");
    const metadata = policySource.match(
      /^<!-- owner: ([^;]+); priority: ([^;]+); conflicts: ([^;]+) -->\n/,
    );
    if (!metadata) {
      errors.push(`${capability.id}: policy needs owner, priority, and conflict metadata`);
    } else if (metadata[1] !== capability.owner) {
      errors.push(`${capability.id}: policy owner must match catalog owner`);
    }
    const estimatedTokens = Math.ceil(policySource.length / 4);
    if (estimatedTokens > capability.context_budget_tokens) {
      errors.push(
        `${capability.id}: estimated ${estimatedTokens} policy tokens exceed budget ${capability.context_budget_tokens}`,
      );
    }
    return;
  }

  if (!["router", "workflow"].includes(capability.type)) return;
  if (path.basename(absolute) !== "SKILL.md") {
    errors.push(`${capability.id}: skill source must end in SKILL.md`);
    return;
  }
  if (path.basename(path.dirname(absolute)) !== capability.id) {
    errors.push(`${capability.id}: skill directory must match capability ID`);
  }

  const source = fs.readFileSync(absolute, "utf8");
  const frontmatter = source.match(/^---\n([\s\S]*?)\n---\n/);
  if (!frontmatter) {
    errors.push(`${capability.id}: missing YAML frontmatter`);
    return;
  }
  let metadata;
  try {
    metadata = YAML.parse(frontmatter[1]);
  } catch (error) {
    errors.push(`${capability.id}: invalid frontmatter: ${error.message}`);
    return;
  }
  const keys = Object.keys(metadata ?? {}).sort();
  if (keys.join(",") !== "description,name") {
    errors.push(`${capability.id}: SKILL.md frontmatter permits only name and description`);
  }
  if (metadata?.name !== capability.id) {
    errors.push(`${capability.id}: frontmatter name must match catalog ID`);
  }
  if (typeof metadata?.description !== "string" || metadata.description.length < 20) {
    errors.push(`${capability.id}: description must be trigger-specific`);
  }
  const estimatedTokens = Math.ceil(source.length / 4);
  if (estimatedTokens > capability.context_budget_tokens) {
    errors.push(
      `${capability.id}: estimated ${estimatedTokens} skill tokens exceed budget ${capability.context_budget_tokens}`,
    );
  }
  const lines = source.split("\n").length;
  if (lines > 501) errors.push(`${capability.id}: SKILL.md exceeds 500 lines`);
}

for (const file of fs
  .readdirSync(path.join(root, "schemas"))
  .filter((candidate) => candidate.endsWith(".schema.json"))) {
  try {
    new Ajv2020({ strict: true }).compile(readStructured(`schemas/${file}`));
  } catch (error) {
    errors.push(`schemas/${file}: invalid schema: ${error.message}`);
  }
}

const catalog = readStructured("catalog.yaml");
validateSchema("schemas/catalog.schema.json", "catalog.yaml", catalog);

const provenance = readStructured("provenance.yaml");
validateSchema("schemas/provenance.schema.json", "provenance.yaml", provenance);

const packFiles = fs
  .readdirSync(path.join(root, "packs"))
  .filter((file) => file.endsWith(".yaml"))
  .sort()
  .map((file) => `packs/${file}`);
const packs = packFiles
  .map((file) => ({ file, data: readStructured(file) }))
  .filter(({ data }) => data !== null);
for (const { file, data } of packs) {
  validateSchema("schemas/pack.schema.json", file, data);
}

const caseFiles = walk(path.join(root, "evaluations", "cases"))
  .filter((file) => path.basename(file) === "case.yaml")
  .map(relative)
  .sort();
const evaluationCases = caseFiles
  .map((file) => ({ file, data: readStructured(file) }))
  .filter(({ data }) => data !== null);
for (const { file, data } of evaluationCases) {
  validateSchema("schemas/evaluation-case.schema.json", file, data);
}

const baselineDirectory = path.join(root, "evaluations", "baselines");
const baselineFiles = fs.existsSync(baselineDirectory)
  ? fs
      .readdirSync(baselineDirectory)
      .filter((file) => file.endsWith(".json"))
      .sort()
      .map((file) => `evaluations/baselines/${file}`)
  : [];
const baselines = baselineFiles
  .map((file) => ({ file, data: readStructured(file) }))
  .filter(({ data }) => data !== null);
for (const { file, data } of baselines) {
  validateSchema("schemas/evaluation-run.schema.json", file, data);
}

const resultDirectory = path.join(root, "evaluations", "results");
const resultFiles = fs.existsSync(resultDirectory)
  ? fs
      .readdirSync(resultDirectory)
      .filter((file) => file.endsWith(".json"))
      .sort()
      .map((file) => `evaluations/results/${file}`)
  : [];
const evaluationResults = resultFiles
  .map((file) => ({ file, data: readStructured(file) }))
  .filter(({ data }) => data !== null);
for (const { file, data } of evaluationResults) {
  validateSchema("schemas/evaluation-run.schema.json", file, data);
}

if (catalog !== null) {
  const capabilities = catalog.capabilities ?? [];
  const duplicateCapabilities = duplicates(capabilities.map(({ id }) => id));
  for (const id of duplicateCapabilities) errors.push(`catalog.yaml: duplicate capability ${id}`);
  const capabilityById = new Map(capabilities.map((capability) => [capability.id, capability]));

  const duplicatePacks = duplicates(packs.map(({ data }) => data.id));
  for (const id of duplicatePacks) errors.push(`packs: duplicate pack ${id}`);
  const packById = new Map(packs.map(({ data }) => [data.id, data]));

  for (const { data: pack } of packs) {
    if (!pack.plugin_path || !fs.existsSync(path.join(root, pack.plugin_path))) continue;
    const manifestFile = `${pack.plugin_path}/.codex-plugin/plugin.json`;
    if (!fs.existsSync(path.join(root, manifestFile))) {
      errors.push(`${pack.id}: missing plugin manifest`);
      continue;
    }
    const manifest = readStructured(manifestFile);
    validateSchema("schemas/plugin.schema.json", manifestFile, manifest);
    if (manifest?.name !== pack.id) errors.push(`${manifestFile}: name must match pack ID`);
    if (manifest?.version !== pack.version) errors.push(`${manifestFile}: version must match pack`);
    for (const capabilityId of pack.capabilities) {
      const capability = capabilityById.get(capabilityId);
      if (
        capability?.source &&
        ["router", "workflow"].includes(capability.type) &&
        !capability.source.startsWith(`${pack.plugin_path}/skills/`)
      ) {
        errors.push(`${capabilityId}: source is outside owning plugin ${pack.plugin_path}`);
      }
    }
  }

  for (const id of duplicates(evaluationCases.map(({ data }) => data.id))) {
    errors.push(`evaluations: duplicate case ${id}`);
  }
  const caseById = new Map(evaluationCases.map(({ data }) => [data.id, data]));
  for (const capability of capabilities) {
    if (
      capability.evaluation_suite &&
      !evaluationCases.some(({ data }) => data.capability === capability.id)
    ) {
      errors.push(`${capability.id}: evaluation suite has no cases`);
    }
  }
  for (const { file, data: evaluationCase } of evaluationCases) {
    if (path.basename(path.dirname(file)) !== evaluationCase.id) {
      errors.push(`${file}: parent directory must match case ID`);
    }
    if (!capabilityById.has(evaluationCase.capability)) {
      errors.push(`${file}: unknown capability ${evaluationCase.capability}`);
    }
    for (const field of ["prompt_file", "output_schema"]) {
      const target = path.join(root, path.dirname(file), evaluationCase[field]);
      if (!fs.existsSync(target)) errors.push(`${file}: missing ${field} ${evaluationCase[field]}`);
    }
    const schemaPath = path.join(root, path.dirname(file), evaluationCase.output_schema);
    if (fs.existsSync(schemaPath)) {
      try {
        new Ajv2020({ strict: true }).compile(JSON.parse(fs.readFileSync(schemaPath, "utf8")));
      } catch (error) {
        errors.push(`${file}: invalid output schema: ${error.message}`);
      }
    }
  }
  for (const { file, data: baseline } of baselines) {
    if (!caseById.has(baseline.case_id)) errors.push(`${file}: unknown case ${baseline.case_id}`);
    if (baseline.variant !== "baseline") errors.push(`${file}: accepted run must be baseline variant`);
    if (path.basename(file, ".json") !== baseline.case_id) {
      errors.push(`${file}: filename must match case ID`);
    }
    if (Number.isNaN(Date.parse(baseline.timestamp))) errors.push(`${file}: invalid timestamp`);
  }
  for (const { file, data: result } of evaluationResults) {
    if (!caseById.has(result.case_id)) errors.push(`${file}: unknown case ${result.case_id}`);
    if (result.variant !== "capability") errors.push(`${file}: result must be capability variant`);
    if (path.basename(file, ".json") !== result.case_id) {
      errors.push(`${file}: filename must match case ID`);
    }
    if (Number.isNaN(Date.parse(result.timestamp))) errors.push(`${file}: invalid timestamp`);
  }

  for (const capability of capabilities) {
    validateSkill(capability);
    if (!packById.has(capability.installation_pack)) {
      errors.push(`${capability.id}: unknown installation pack ${capability.installation_pack}`);
    } else if (!packById.get(capability.installation_pack).capabilities.includes(capability.id)) {
      errors.push(`${capability.id}: missing from pack ${capability.installation_pack}`);
    }
    for (const dependency of capability.dependencies) {
      if (!capabilityById.has(dependency)) {
        errors.push(`${capability.id}: unknown capability dependency ${dependency}`);
      }
      if (dependency === capability.id) errors.push(`${capability.id}: self dependency`);
    }
  }

  for (const { file, data: pack } of packs) {
    if (path.basename(file, ".yaml") !== pack.id) {
      errors.push(`${file}: filename must match pack ID`);
    }
    if (pack.distribution === "plugin" && pack.plugin_path === null) {
      errors.push(`${pack.id}: plugin distribution requires plugin_path`);
    }
    if (pack.distribution === "bootstrap" && pack.plugin_path !== null) {
      errors.push(`${pack.id}: bootstrap distribution cannot set plugin_path`);
    }
    if (pack.status !== "proposed" && pack.plugin_path && !fs.existsSync(path.join(root, pack.plugin_path))) {
      errors.push(`${pack.id}: ${pack.status} plugin path does not exist`);
    }
    for (const capabilityId of pack.capabilities) {
      const capability = capabilityById.get(capabilityId);
      if (!capability) errors.push(`${pack.id}: unknown capability ${capabilityId}`);
      else if (capability.installation_pack !== pack.id) {
        errors.push(`${pack.id}: ${capabilityId} belongs to ${capability.installation_pack}`);
      }
    }
    for (const dependency of pack.dependencies) {
      if (!packById.has(dependency.id)) {
        errors.push(`${pack.id}: unknown pack dependency ${dependency.id}`);
      }
      if (dependency.id === pack.id) errors.push(`${pack.id}: self dependency`);
    }
    for (const policyPackId of pack.suggested_policies) {
      const policyPack = packById.get(policyPackId);
      if (!policyPack) {
        errors.push(`${pack.id}: unknown suggested policy pack ${policyPackId}`);
      } else if (
        !policyPack.capabilities.every((id) => capabilityById.get(id)?.type === "policy")
      ) {
        errors.push(`${pack.id}: suggested policy pack ${policyPackId} contains non-policies`);
      }
    }
  }

  validateGraph(
    capabilityById.keys(),
    new Map(capabilities.map(({ id, dependencies }) => [id, dependencies])),
    "catalog.yaml",
  );
  validateGraph(
    packById.keys(),
    new Map(packs.map(({ data }) => [data.id, data.dependencies.map(({ id }) => id)])),
    "packs",
  );

  const policyBudget = capabilities
    .filter(({ installation_pack, type }) => installation_pack === "core-policies" && type === "policy")
    .reduce((total, { context_budget_tokens }) => total + context_budget_tokens, 0);
  if (policyBudget > 800) {
    errors.push(`core-policies: declared context budget ${policyBudget} exceeds 800 tokens`);
  }
}

if (provenance !== null) {
  const records = provenance.third_party ?? [];
  for (const id of duplicates(records.map((record) => record.id))) {
    errors.push(`provenance.yaml: duplicate record ${id}`);
  }
  for (const record of records) {
    for (const target of record.paths) {
      if (!fs.existsSync(path.join(root, target))) {
        errors.push(`provenance ${record.id}: missing path ${target}`);
      }
    }
    if (record.status !== "approved") {
      errors.push(`provenance ${record.id}: status ${record.status} blocks release`);
    }
  }
}

validateMarkdown();

if (errors.length > 0) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log(
  `validated ${catalog.capabilities.length} capabilities, ${packs.length} packs, ` +
    `${evaluationCases.length} evaluation cases, ${baselines.length} baselines, ` +
    `${evaluationResults.length} capability results, ${provenance.third_party.length} third-party records`,
);
