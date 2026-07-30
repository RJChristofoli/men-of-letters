#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import Ajv2020 from "ajv/dist/2020.js";
import YAML from "yaml";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function fail(message) {
  console.error(message);
  process.exit(1);
}

function parseArguments(argv) {
  const [command, caseId, ...rest] = argv;
  if (["accept", "record"].includes(command) && caseId && rest.length === 0) {
    return { command, runFile: caseId };
  }
  if (command !== "run" || !caseId) {
    fail(
      "usage: npm run evaluate -- run <case-id> --variant baseline|capability [--accept-baseline]\n" +
        "   or: npm run evaluate -- accept <evaluations/runs/run.json>\n" +
        "   or: npm run evaluate -- record <evaluations/runs/run.json>",
    );
  }
  let variant;
  let acceptBaseline = false;
  for (let index = 0; index < rest.length; index += 1) {
    if (rest[index] === "--variant") variant = rest[++index];
    else if (rest[index] === "--accept-baseline") acceptBaseline = true;
    else fail(`unknown argument: ${rest[index]}`);
  }
  if (!["baseline", "capability"].includes(variant)) {
    fail("--variant must be baseline or capability");
  }
  if (acceptBaseline && variant !== "baseline") {
    fail("--accept-baseline is valid only for the baseline variant");
  }
  return { command, caseId, variant, acceptBaseline };
}

function findCase(caseId) {
  const casesRoot = path.join(root, "evaluations", "cases");
  const queue = [casesRoot];
  while (queue.length > 0) {
    const directory = queue.pop();
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const target = path.join(directory, entry.name);
      if (entry.isDirectory()) queue.push(target);
      else if (entry.name === "case.yaml") {
        const data = YAML.parse(fs.readFileSync(target, "utf8"));
        if (data.id === caseId) return { directory, data };
      }
    }
  }
  fail(`unknown evaluation case: ${caseId}`);
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
  if (!run.passed) {
    const failed = run.checks.filter(({ passed }) => !passed).map(({ detail }) => detail);
    fail(`run does not pass the current case:\n- ${failed.join("\n- ")}`);
  }
  const destinationDirectory = path.join(
    root,
    "evaluations",
    options.command === "accept" ? "baselines" : "results",
  );
  fs.mkdirSync(destinationDirectory, { recursive: true });
  const destinationPath = path.join(destinationDirectory, `${run.case_id}.json`);
  fs.writeFileSync(destinationPath, `${JSON.stringify(run, null, 2)}\n`);
  const resultKey = options.command === "accept" ? "accepted_baseline" : "recorded_result";
  console.log(JSON.stringify({ [resultKey]: path.relative(root, destinationPath) }, null, 2));
  process.exit(0);
}

const { caseId, variant, acceptBaseline } = options;
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
  const capability = catalog.capabilities.find(({ id }) => id === specification.capability);
  if (!capability?.source) fail(`${specification.capability} has no implemented source`);
  const sourceDirectory = path.dirname(path.join(root, capability.source));
  const targetDirectory = path.join(workspace, ".agents", "skills", specification.capability);
  fs.mkdirSync(path.dirname(targetDirectory), { recursive: true });
  fs.cpSync(sourceDirectory, targetDirectory, { recursive: true });
  if (specification.kind === "positive") prompt = `$${specification.capability}\n\n${prompt}`;
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
  `${timestamp.replaceAll(":", "-")}-${caseId}-${variant}.json`,
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
