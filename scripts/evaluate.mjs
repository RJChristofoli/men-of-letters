#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import Ajv2020 from "ajv/dist/2020.js";
import YAML from "yaml";

import {
  CONFIGURATIONS,
  DEFAULT_CONFIGURATION,
  assertImplementedCapabilities,
  calculatePhaseOneGate,
  createBlindReview,
  evaluationRunIsRecordable,
  resolveBlindReview,
  resolveConfigurationCapabilities,
  runConfiguration,
} from "./lib/evaluation.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function fail(message) {
  console.error(message);
  process.exit(1);
}

function parseArguments(argv) {
  const [command, subject, ...rest] = argv;
  const usage =
    "usage: npm run evaluate -- run <case-id> --variant baseline|capability " +
    "[--configuration individual-capability|complete-core-policies|phase-1-combined] " +
    "[--accept-baseline]\n" +
    "   or: npm run evaluate -- accept <evaluations/runs/run.json>\n" +
    "   or: npm run evaluate -- record <evaluations/runs/run.json>\n" +
    "   or: npm run evaluate -- prepare-review <case-id> --reviewer <id> " +
    "[--role primary|adjudicator] [--configuration <configuration>]\n" +
    "   or: npm run evaluate -- record-review <evaluations/runs/review.json> " +
    "--verdict a|b|tie --reason <text>\n" +
    "   or: npm run evaluate -- gate phase-1";
  if (["accept", "record"].includes(command) && subject && rest.length === 0) {
    return { command, runFile: subject };
  }
  if (command === "gate" && subject === "phase-1" && rest.length === 0) {
    return { command, gateId: subject };
  }
  if (!["run", "prepare-review", "record-review"].includes(command) || !subject) fail(usage);

  const parsed = {
    command,
    configuration: DEFAULT_CONFIGURATION,
    role: "primary",
  };
  if (command === "record-review") parsed.bundleFile = subject;
  else parsed.caseId = subject;
  for (let index = 0; index < rest.length; index += 1) {
    const argument = rest[index];
    if (argument === "--accept-baseline") parsed.acceptBaseline = true;
    else if (["--variant", "--configuration", "--reviewer", "--role", "--verdict", "--reason"].includes(argument)) {
      const value = rest[++index];
      if (!value) fail(`${argument} requires a value`);
      parsed[argument.slice(2).replaceAll("-", "_")] = value;
    } else fail(`unknown argument: ${argument}`);
  }
  if (!CONFIGURATIONS.includes(parsed.configuration)) {
    fail(`--configuration must be one of ${CONFIGURATIONS.join(", ")}`);
  }
  if (command === "run") {
    if (!["baseline", "capability"].includes(parsed.variant)) {
      fail("--variant must be baseline or capability");
    }
    if (parsed.acceptBaseline && parsed.variant !== "baseline") {
      fail("--accept-baseline is valid only for the baseline variant");
    }
    if (parsed.variant === "baseline" && parsed.configuration !== DEFAULT_CONFIGURATION) {
      fail("baseline runs use the individual-capability configuration");
    }
  }
  if (command === "prepare-review") {
    if (!parsed.reviewer) fail("prepare-review requires --reviewer");
    if (!["primary", "adjudicator"].includes(parsed.role)) {
      fail("--role must be primary or adjudicator");
    }
  }
  if (command === "record-review") {
    if (!["a", "b", "tie"].includes(parsed.verdict)) fail("record-review requires --verdict a|b|tie");
    if (!parsed.reason?.trim() || parsed.reason.trim().length < 10) {
      fail("record-review requires --reason with at least 10 characters");
    }
  }
  return parsed;
}

function listCases() {
  const casesRoot = path.join(root, "evaluations", "cases");
  const queue = [casesRoot];
  const found = [];
  while (queue.length > 0) {
    const directory = queue.pop();
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const target = path.join(directory, entry.name);
      if (entry.isDirectory()) queue.push(target);
      else if (entry.name === "case.yaml") {
        const data = YAML.parse(fs.readFileSync(target, "utf8"));
        found.push({ directory, data });
      }
    }
  }
  return found;
}

function findCase(caseId) {
  const found = listCases().find(({ data }) => data.id === caseId);
  if (found) return found;
  fail(`unknown evaluation case: ${caseId}`);
}

function walkJson(directory) {
  if (!fs.existsSync(directory)) return [];
  const found = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) found.push(...walkJson(target));
    else if (entry.name.endsWith(".json")) found.push(target);
  }
  return found;
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function recordedResultPath(caseId, configuration) {
  const base = path.join(root, "evaluations", "results");
  return configuration === DEFAULT_CONFIGURATION
    ? path.join(base, `${caseId}.json`)
    : path.join(base, configuration, `${caseId}.json`);
}

function getPath(value, dottedPath) {
  return dottedPath.split(".").reduce((current, key) => current?.[key], value);
}

function score(response, schema, checks) {
  const results = [];
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  const validate = ajv.compile(schema);
  const schemaPassed = validate(response);
  results.push({
    name: "output-schema",
    passed: schemaPassed,
    detail: schemaPassed
      ? "response matches output schema"
      : ajv.errorsText(validate.errors, { separator: "; " }),
  });

  for (const dottedPath of checks.required_nonempty) {
    const value = getPath(response, dottedPath);
    const passed =
      (typeof value === "string" && value.trim().length > 0) ||
      (Array.isArray(value) && value.length > 0) ||
      (value !== null && typeof value === "object" && Object.keys(value).length > 0);
    results.push({
      name: `nonempty:${dottedPath}`,
      passed,
      detail: passed ? `${dottedPath} is populated` : `${dottedPath} is empty or missing`,
    });
  }

  for (const [dottedPath, minimum] of Object.entries(checks.minimum_items)) {
    const value = getPath(response, dottedPath);
    const passed = Array.isArray(value) && value.length >= minimum;
    results.push({
      name: `minimum-items:${dottedPath}`,
      passed,
      detail: passed
        ? `${dottedPath} has ${value.length} items`
        : `${dottedPath} requires at least ${minimum} items`,
    });
  }

  for (const requirement of checks.required_terms) {
    const normalized = JSON.stringify(getPath(response, requirement.path) ?? "").toLowerCase();
    for (const term of requirement.terms) {
      const passed = normalized.includes(term.toLowerCase());
      results.push({
        name: `required-term:${requirement.path}:${term}`,
        passed,
        detail: passed ? `${requirement.path} includes ${term}` : `${requirement.path} omits ${term}`,
      });
    }
  }
  return results;
}

function commandVersion(command, args) {
  const result = spawnSync(command, args, { encoding: "utf8" });
  return (result.stdout || result.stderr).trim() || "unknown";
}

const options = parseArguments(process.argv.slice(2));

if (options.command === "prepare-review") {
  if (!/^[a-zA-Z0-9._-]+$/.test(options.reviewer)) fail("reviewer contains unsupported characters");
  const evaluationCase = findCase(options.caseId);
  const baselinePath = path.join(root, "evaluations", "baselines", `${options.caseId}.json`);
  const capabilityPath = recordedResultPath(options.caseId, options.configuration);
  if (!fs.existsSync(baselinePath)) fail(`missing accepted baseline for ${options.caseId}`);
  if (!fs.existsSync(capabilityPath)) {
    fail(`missing recorded ${options.configuration} result for ${options.caseId}`);
  }
  const { bundle, key } = createBlindReview({
    caseId: options.caseId,
    configuration: options.configuration,
    reviewer: options.reviewer,
    role: options.role,
    prompt: fs.readFileSync(
      path.join(evaluationCase.directory, evaluationCase.data.prompt_file),
      "utf8",
    ),
    checks: {
      output_schema: readJson(path.join(evaluationCase.directory, evaluationCase.data.output_schema)),
      objective_checks: evaluationCase.data.checks,
    },
    baseline: readJson(baselinePath),
    capability: readJson(capabilityPath),
  });
  const runsDirectory = path.join(root, "evaluations", "runs");
  fs.mkdirSync(runsDirectory, { recursive: true });
  const bundlePath = path.join(runsDirectory, `${bundle.id}.review.json`);
  const keyPath = path.join(runsDirectory, `${bundle.id}.review-key.json`);
  fs.writeFileSync(bundlePath, `${JSON.stringify(bundle, null, 2)}\n`);
  fs.writeFileSync(keyPath, `${JSON.stringify(key, null, 2)}\n`, { mode: 0o600 });
  console.log(
    JSON.stringify(
      {
        blind_review: path.relative(root, bundlePath),
        reviewer: bundle.reviewer,
        role: bundle.role,
        instructions: "review output_a and output_b; do not open the review-key file",
      },
      null,
      2,
    ),
  );
  process.exit(0);
}

if (options.command === "record-review") {
  const runsRoot = path.join(root, "evaluations", "runs");
  const bundlePath = path.resolve(root, options.bundleFile);
  if (!bundlePath.startsWith(`${runsRoot}${path.sep}`)) {
    fail("review bundle must be under evaluations/runs");
  }
  if (!bundlePath.endsWith(".review.json") || !fs.existsSync(bundlePath)) {
    fail(`review bundle does not exist: ${options.bundleFile}`);
  }
  const keyPath = bundlePath.replace(/\.review\.json$/, ".review-key.json");
  if (!fs.existsSync(keyPath)) fail("review key is missing");
  const review = resolveBlindReview({
    bundle: readJson(bundlePath),
    key: readJson(keyPath),
    verdict: options.verdict,
    reason: options.reason.trim(),
  });
  const reviewDirectory = path.join(root, "evaluations", "reviews");
  fs.mkdirSync(reviewDirectory, { recursive: true });
  const destination = path.join(reviewDirectory, `${review.id}.json`);
  if (fs.existsSync(destination)) fail(`review already recorded: ${path.relative(root, destination)}`);
  fs.writeFileSync(destination, `${JSON.stringify(review, null, 2)}\n`);
  console.log(JSON.stringify({ recorded_review: path.relative(root, destination) }, null, 2));
  process.exit(0);
}

if (options.command === "gate") {
  const gate = YAML.parse(
    fs.readFileSync(path.join(root, "evaluations", "phase-1-gate.yaml"), "utf8"),
  );
  const report = calculatePhaseOneGate({
    gate,
    cases: listCases().map(({ data }) => data),
    baselines: walkJson(path.join(root, "evaluations", "baselines")).map(readJson),
    results: walkJson(path.join(root, "evaluations", "results")).map(readJson),
    reviews: walkJson(path.join(root, "evaluations", "reviews")).map(readJson),
  });
  const reportsDirectory = path.join(root, "evaluations", "runs");
  fs.mkdirSync(reportsDirectory, { recursive: true });
  const reportPath = path.join(
    reportsDirectory,
    `${report.calculated_at.replaceAll(":", "-")}-phase-1-gate.json`,
  );
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(
    JSON.stringify(
      {
        report: path.relative(root, reportPath),
        status: report.status,
        summary: report.summary,
      },
      null,
      2,
    ),
  );
  process.exit(report.status === "pass" ? 0 : 2);
}

if (["accept", "record"].includes(options.command)) {
  const runsRoot = path.join(root, "evaluations", "runs");
  const runPath = path.resolve(root, options.runFile);
  if (!runPath.startsWith(`${runsRoot}${path.sep}`)) fail("accepted run must be under evaluations/runs");
  if (!fs.existsSync(runPath)) fail(`run does not exist: ${options.runFile}`);
  const run = JSON.parse(fs.readFileSync(runPath, "utf8"));
  const requiredVariant = options.command === "accept" ? "baseline" : "capability";
  if (run.variant !== requiredVariant) {
    fail(`${options.command} requires a ${requiredVariant} variant`);
  }
  const evaluationCase = findCase(run.case_id);
  const outputSchema = JSON.parse(
    fs.readFileSync(path.join(evaluationCase.directory, evaluationCase.data.output_schema), "utf8"),
  );
  run.checks = score(run.response, outputSchema, evaluationCase.data.checks);
  run.passed = run.checks.every(({ passed }) => passed);
  if (!evaluationRunIsRecordable(options.command, run.passed)) {
    const failed = run.checks.filter(({ passed }) => !passed).map(({ detail }) => detail);
    fail(`run does not pass the current case:\n- ${failed.join("\n- ")}`);
  }
  const configuration = runConfiguration(run);
  const destinationDirectory =
    options.command === "accept"
      ? path.join(root, "evaluations", "baselines")
      : path.dirname(recordedResultPath(run.case_id, configuration));
  fs.mkdirSync(destinationDirectory, { recursive: true });
  const destinationPath =
    options.command === "accept"
      ? path.join(destinationDirectory, `${run.case_id}.json`)
      : recordedResultPath(run.case_id, configuration);
  fs.writeFileSync(destinationPath, `${JSON.stringify(run, null, 2)}\n`);
  const resultKey = options.command === "accept" ? "accepted_baseline" : "recorded_result";
  console.log(JSON.stringify({ [resultKey]: path.relative(root, destinationPath) }, null, 2));
  process.exit(0);
}

const { caseId, variant, acceptBaseline, configuration } = options;
const evaluationCase = findCase(caseId);
const caseDirectory = evaluationCase.directory;
const specification = evaluationCase.data;
const promptPath = path.join(caseDirectory, specification.prompt_file);
const outputSchemaPath = path.join(caseDirectory, specification.output_schema);
const outputSchema = JSON.parse(fs.readFileSync(outputSchemaPath, "utf8"));
let prompt = fs.readFileSync(promptPath, "utf8").trim();

const workspace = fs.mkdtempSync(path.join(os.tmpdir(), `men-of-letters-${caseId}-`));
const lastMessagePath = path.join(workspace, "last-message.json");

if (variant === "capability") {
  const catalog = YAML.parse(fs.readFileSync(path.join(root, "catalog.yaml"), "utf8"));
  const packs = fs
    .readdirSync(path.join(root, "packs"))
    .filter((file) => file.endsWith(".yaml"))
    .map((file) => YAML.parse(fs.readFileSync(path.join(root, "packs", file), "utf8")));
  let capabilities;
  try {
    const capabilityIds = resolveConfigurationCapabilities({
      configuration,
      specification,
      catalog,
      packs,
    });
    capabilities = assertImplementedCapabilities(capabilityIds, catalog);
  } catch (error) {
    fail(error.message);
  }

  const policies = capabilities.filter(({ type }) => type === "policy");
  if (policies.length > 0) {
    const content = policies
      .map(({ source }) => fs.readFileSync(path.join(root, source), "utf8").trim())
      .join("\n\n");
    fs.writeFileSync(path.join(workspace, "AGENTS.md"), `${content}\n`);
  }
  for (const capability of capabilities.filter(({ type }) => ["router", "workflow"].includes(type))) {
    const sourceDirectory = path.dirname(path.join(root, capability.source));
    const targetDirectory = path.join(workspace, ".agents", "skills", capability.id);
    fs.mkdirSync(path.dirname(targetDirectory), { recursive: true });
    fs.cpSync(sourceDirectory, targetDirectory, { recursive: true });
  }
  const requestedCapability = capabilities.find(({ id }) => id === specification.capability);
  if (
    specification.kind === "positive" &&
    requestedCapability &&
    ["router", "workflow"].includes(requestedCapability.type)
  ) {
    prompt = `$${specification.capability}\n\n${prompt}`;
  }
}

const startedAt = Date.now();
const execution = spawnSync(
  "codex",
  [
    "exec",
    "--json",
    "--ephemeral",
    "--ignore-user-config",
    "--skip-git-repo-check",
    "--sandbox",
    specification.sandbox,
    "--output-schema",
    outputSchemaPath,
    "--output-last-message",
    lastMessagePath,
    prompt,
  ],
  {
    cwd: workspace,
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
  },
);
const latencyMs = Date.now() - startedAt;

if (execution.status !== 0) {
  fail(
    `codex exec failed (${execution.status}):\n` +
      `stderr:\n${execution.stderr || "<empty>"}\nstdout:\n${execution.stdout || "<empty>"}`,
  );
}
if (!fs.existsSync(lastMessagePath)) fail("codex exec did not produce a final response");

let response;
try {
  response = JSON.parse(fs.readFileSync(lastMessagePath, "utf8"));
} catch (error) {
  fail(`final response is not JSON: ${error.message}`);
}

const events = execution.stdout
  .split("\n")
  .filter(Boolean)
  .map((line) => JSON.parse(line));
const completedTurns = events.filter(({ type }) => type === "turn.completed");
const usage = completedTurns.reduce(
  (total, event) => {
    total.input_tokens += event.usage?.input_tokens ?? 0;
    total.cached_input_tokens += event.usage?.cached_input_tokens ?? 0;
    total.output_tokens += event.usage?.output_tokens ?? 0;
    return total;
  },
  { input_tokens: 0, cached_input_tokens: 0, output_tokens: 0 },
);
const usageAvailable = completedTurns.some(({ usage: value }) => value !== undefined);
const checks = score(response, outputSchema, specification.checks);
const timestamp = new Date().toISOString();
const result = {
  schema_version: 1,
  case_id: caseId,
  capability: specification.capability,
  variant,
  configuration: variant === "capability" ? configuration : DEFAULT_CONFIGURATION,
  timestamp,
  environment: {
    codex_cli: commandVersion("codex", ["--version"]),
    node: process.version,
    platform: `${process.platform}-${process.arch}`,
  },
  metrics: {
    input_tokens: usageAvailable ? usage.input_tokens : null,
    cached_input_tokens: usageAvailable ? usage.cached_input_tokens : null,
    output_tokens: usageAvailable ? usage.output_tokens : null,
    total_tokens: usageAvailable ? usage.input_tokens + usage.output_tokens : null,
    turns: events.filter(({ type }) => type === "turn.started").length,
    tool_calls: events.filter(
      ({ type, item }) => type === "item.started" && item?.type !== "agent_message",
    ).length,
    latency_ms: latencyMs,
    correction_turns: 0,
  },
  checks,
  passed: checks.every(({ passed }) => passed),
  response,
};

const runDirectory = path.join(root, "evaluations", "runs");
fs.mkdirSync(runDirectory, { recursive: true });
const runPath = path.join(
  runDirectory,
  `${timestamp.replaceAll(":", "-")}-${caseId}-${variant}-${configuration}.json`,
);
fs.writeFileSync(runPath, `${JSON.stringify(result, null, 2)}\n`);
fs.writeFileSync(`${runPath}.events.jsonl`, execution.stdout);

if (acceptBaseline) {
  const baselineDirectory = path.join(root, "evaluations", "baselines");
  fs.mkdirSync(baselineDirectory, { recursive: true });
  fs.writeFileSync(
    path.join(baselineDirectory, `${caseId}.json`),
    `${JSON.stringify(result, null, 2)}\n`,
  );
}

console.log(
  JSON.stringify(
    {
      run: path.relative(root, runPath),
      accepted_baseline: acceptBaseline,
      passed: result.passed,
      metrics: result.metrics,
    },
    null,
    2,
  ),
);
process.exit(result.passed ? 0 : 2);
