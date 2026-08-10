import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import Ajv2020 from "ajv/dist/2020.js";
import YAML from "yaml";

import {
  assertImplementedCapabilities,
  calculatePhaseOneGate,
  createBlindReview,
  resolveBlindReview,
  resolveConfigurationCapabilities,
} from "../../scripts/lib/evaluation.mjs";

const policyIds = [
  "engineering-principles",
  "evidence",
  "backend-defaults",
  "documentation",
  "token-efficiency",
  "versioning-and-lifecycle",
  "safe-change",
];

function evaluationRun({ caseId, capability, variant, configuration, passed, tokens }) {
  return {
    schema_version: 1,
    case_id: caseId,
    capability,
    variant,
    configuration,
    timestamp: "2026-08-10T12:00:00.000Z",
    environment: { codex_cli: "test", node: process.version, platform: process.platform },
    metrics: {
      input_tokens: tokens,
      cached_input_tokens: 0,
      output_tokens: 0,
      total_tokens: tokens,
      turns: 1,
      tool_calls: 0,
      latency_ms: 100,
      correction_turns: 0,
    },
    checks: [],
    passed,
    response: { value: variant },
  };
}

function passingGateFixture() {
  const gate = YAML.parse(fs.readFileSync("evaluations/phase-1-gate.yaml", "utf8"));
  const cases = [];
  const baselines = [];
  const results = [];
  const addPair = ({ id, capability, kind, dimensions, configuration = "individual-capability" }) => {
    const applicable = kind !== "negative";
    cases.push({
      id,
      capability,
      kind,
      gate_dimensions: dimensions,
      preference_review: "not-required",
      safety_critical: false,
    });
    baselines.push(
      evaluationRun({
        caseId: id,
        capability,
        variant: "baseline",
        configuration: "individual-capability",
        passed: !applicable,
        tokens: 100,
      }),
    );
    results.push(
      evaluationRun({
        caseId: id,
        capability,
        variant: "capability",
        configuration,
        passed: true,
        tokens: applicable ? 90 : 100,
      }),
    );
  };

  for (const policyId of policyIds) {
    ["primary-rule", "boundary", "adverse-or-ambiguous"].forEach((dimension, index) =>
      addPair({
        id: `${policyId}-positive-${index}`,
        capability: policyId,
        kind: "positive",
        dimensions: [dimension],
      }),
    );
    ["non-interference", "nearest-negative-trigger", "unrelated-task"].forEach(
      (dimension, index) =>
        addPair({
          id: `${policyId}-negative-${index}`,
          capability: policyId,
          kind: "negative",
          dimensions: [dimension],
        }),
    );
  }

  const discoveryPositive = [
    "feature",
    "technology",
    "architecture",
    "alternatives",
    "feasibility",
    "proof-of-concept",
  ];
  [...discoveryPositive, ...discoveryPositive].forEach((dimension, index) =>
    addPair({
      id: `discovery-positive-${index}`,
      capability: "engineering-discovery",
      kind: "positive",
      dimensions: [dimension],
    }),
  );
  const discoveryNegative = ["accepted-design", "diff-review", "routine-debugging", "measured-optimization"];
  [...discoveryNegative, ...discoveryNegative].forEach((dimension, index) =>
    addPair({
      id: `discovery-negative-${index}`,
      capability: "engineering-discovery",
      kind: "negative",
      dimensions: [dimension],
    }),
  );

  ["authority", "safety", "narrower-scope", "unresolved-conflict"].forEach((dimension, index) =>
    addPair({
      id: `precedence-${index}`,
      capability: "safe-change",
      kind: "precedence",
      dimensions: [dimension],
      configuration: "complete-core-policies",
    }),
  );
  const combinedPositive = ["policy-only", "discovery-only", "policy-and-discovery", "conditional-reference"];
  [...combinedPositive, ...combinedPositive, ...combinedPositive].forEach((dimension, index) =>
    addPair({
      id: `combined-positive-${index}`,
      capability: "engineering-discovery",
      kind: "positive",
      dimensions: [dimension],
      configuration: "phase-1-combined",
    }),
  );
  const combinedNegative = ["mechanical", "creative", "accepted-design", "read-only"];
  [...combinedNegative, ...combinedNegative].forEach((dimension, index) =>
    addPair({
      id: `combined-negative-${index}`,
      capability: "engineering-discovery",
      kind: "negative",
      dimensions: [dimension],
      configuration: "phase-1-combined",
    }),
  );
  return { gate, cases, baselines, results, reviews: [] };
}

test("configuration resolution fails closed on missing sources", () => {
  const catalog = {
    capabilities: [
      ...policyIds.map((id) => ({ id, source: `policies/${id}.md` })),
      { id: "engineering-discovery", source: "plugins/discovery/SKILL.md" },
    ],
  };
  const packs = [{ id: "core-policies", capabilities: policyIds }];
  const combined = resolveConfigurationCapabilities({
    configuration: "phase-1-combined",
    specification: { capability: "engineering-discovery" },
    catalog,
    packs,
  });
  assert.deepEqual(combined, [...policyIds, "engineering-discovery"]);
  assert.equal(assertImplementedCapabilities(combined, catalog).length, 8);
  catalog.capabilities[0].source = null;
  assert.throws(() => assertImplementedCapabilities(combined, catalog), /missing sources/);
});

test("blind review hides identity and resolves the recorded verdict", () => {
  const baseline = evaluationRun({
    caseId: "case-001",
    capability: "engineering-discovery",
    variant: "baseline",
    configuration: "individual-capability",
    passed: true,
    tokens: 100,
  });
  const capability = evaluationRun({
    caseId: "case-001",
    capability: "engineering-discovery",
    variant: "capability",
    configuration: "individual-capability",
    passed: true,
    tokens: 90,
  });
  const { bundle, key } = createBlindReview({
    caseId: "case-001",
    configuration: "individual-capability",
    reviewer: "reviewer-1",
    role: "primary",
    prompt: "compare",
    checks: {},
    baseline,
    capability,
    capabilityFirst: false,
    timestamp: "2026-08-10T12:00:00.000Z",
  });
  assert.equal(bundle.output_a.value, "baseline");
  assert.equal(JSON.stringify(bundle).includes("variant_a"), false);
  const review = resolveBlindReview({
    bundle,
    key,
    verdict: "b",
    reason: "Output B is more correct and actionable.",
  });
  assert.equal(review.preference, "capability");
  assert.equal(review.blinded, true);
  const reviewSchema = JSON.parse(fs.readFileSync("schemas/evaluation-review.schema.json", "utf8"));
  const validate = new Ajv2020({ strict: true }).compile(reviewSchema);
  assert.equal(validate(review), true);
});

test("aggregate gate passes complete evidence and rejects a false trigger", () => {
  const fixture = passingGateFixture();
  const passing = calculatePhaseOneGate(fixture);
  assert.equal(passing.status, "pass");
  assert.equal(passing.summary.passed, true);

  const failingResult = fixture.results.find(
    (run) =>
      run.configuration === "phase-1-combined" &&
      fixture.cases.find(({ id }) => id === run.case_id).kind === "negative",
  );
  failingResult.passed = false;
  const failing = calculatePhaseOneGate(fixture);
  assert.equal(failing.status, "fail");
  assert.equal(failing.combined.regressions.false_triggers, 1);
});
