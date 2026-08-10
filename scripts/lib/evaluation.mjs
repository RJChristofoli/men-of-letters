import crypto from "node:crypto";

export const DEFAULT_CONFIGURATION = "individual-capability";
export const CONFIGURATIONS = [
  DEFAULT_CONFIGURATION,
  "complete-core-policies",
  "phase-1-combined",
];

export function runConfiguration(run) {
  return run.configuration ?? DEFAULT_CONFIGURATION;
}

export function resolveConfigurationCapabilities({ configuration, specification, catalog, packs }) {
  if (!CONFIGURATIONS.includes(configuration)) {
    throw new Error(`unknown evaluation configuration: ${configuration}`);
  }
  if (configuration === DEFAULT_CONFIGURATION) return [specification.capability];

  const corePack = packs.find(({ id }) => id === "core-policies");
  if (!corePack) throw new Error("missing core-policies pack");
  if (configuration === "complete-core-policies") return [...corePack.capabilities];

  const discovery = catalog.capabilities.find(({ id }) => id === "engineering-discovery");
  if (!discovery) throw new Error("missing engineering-discovery capability");
  return [...new Set([...corePack.capabilities, discovery.id])];
}

export function assertImplementedCapabilities(capabilityIds, catalog) {
  const byId = new Map(catalog.capabilities.map((capability) => [capability.id, capability]));
  const unknown = capabilityIds.filter((id) => !byId.has(id));
  if (unknown.length > 0) throw new Error(`unknown capabilities: ${unknown.join(", ")}`);
  const missing = capabilityIds.filter((id) => !byId.get(id).source);
  if (missing.length > 0) throw new Error(`configuration has missing sources: ${missing.join(", ")}`);
  return capabilityIds.map((id) => byId.get(id));
}

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function runSha256(run) {
  return sha256(JSON.stringify(run));
}

export function createBlindReview({
  caseId,
  configuration,
  reviewer,
  role,
  prompt,
  checks,
  baseline,
  capability,
  capabilityFirst = crypto.randomInt(2) === 0,
  timestamp = new Date().toISOString(),
}) {
  if (baseline.case_id !== caseId || capability.case_id !== caseId) {
    throw new Error("review runs must match the requested case");
  }
  if (baseline.variant !== "baseline" || capability.variant !== "capability") {
    throw new Error("review requires baseline and capability variants");
  }
  if (runConfiguration(capability) !== configuration) {
    throw new Error("capability run configuration does not match review configuration");
  }
  if (
    baseline.environment.codex_cli !== capability.environment.codex_cli ||
    baseline.environment.node !== capability.environment.node ||
    baseline.environment.platform !== capability.environment.platform
  ) {
    throw new Error("review runs do not have comparable environments");
  }

  const reviewId = `${caseId}-${configuration}-${reviewer}-${sha256(timestamp).slice(0, 10)}`;
  const first = capabilityFirst ? capability : baseline;
  const second = capabilityFirst ? baseline : capability;
  const bundle = {
    schema_version: 1,
    id: reviewId,
    case_id: caseId,
    configuration,
    reviewer,
    role,
    created_at: timestamp,
    prompt,
    checks,
    output_a: first.response,
    output_b: second.response,
  };
  const key = {
    schema_version: 1,
    id: reviewId,
    variant_a: capabilityFirst ? "capability" : "baseline",
    variant_b: capabilityFirst ? "baseline" : "capability",
    baseline_sha256: runSha256(baseline),
    capability_sha256: runSha256(capability),
  };
  return { bundle, key };
}

export function resolveBlindReview({ bundle, key, verdict, reason, timestamp = new Date().toISOString() }) {
  if (bundle.id !== key.id) throw new Error("review bundle and key do not match");
  if (!["a", "b", "tie"].includes(verdict)) throw new Error("verdict must be a, b, or tie");
  const preference = verdict === "tie" ? "tie" : key[`variant_${verdict}`];
  return {
    schema_version: 1,
    id: bundle.id,
    case_id: bundle.case_id,
    configuration: bundle.configuration,
    reviewer: bundle.reviewer,
    role: bundle.role,
    blinded: true,
    preference,
    reason,
    baseline_sha256: key.baseline_sha256,
    capability_sha256: key.capability_sha256,
    created_at: timestamp,
  };
}

function ratioDelta(capability, baseline) {
  if (baseline === 0) return capability === 0 ? 0 : Infinity;
  return (capability - baseline) / baseline;
}

function median(values) {
  if (values.length === 0) return null;
  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}

function resolvedPreferences(pairs, reviews, reviewersMinimum) {
  const verdicts = [];
  const unresolved = [];
  for (const pair of pairs.filter(({ evaluationCase }) => evaluationCase.preference_review === "required")) {
    const matching = reviews.filter(
      (review) =>
        review.case_id === pair.evaluationCase.id &&
        review.configuration === runConfiguration(pair.capability) &&
        review.baseline_sha256 === runSha256(pair.baseline) &&
        review.capability_sha256 === runSha256(pair.capability),
    );
    const primary = [
      ...new Map(
        matching.filter(({ role }) => role === "primary").map((review) => [review.reviewer, review]),
      ).values(),
    ];
    if (primary.length < reviewersMinimum) {
      unresolved.push(pair.evaluationCase.id);
      continue;
    }
    if (new Set(primary.map(({ preference }) => preference)).size === 1) {
      verdicts.push(primary[0].preference);
      continue;
    }
    const primaryReviewers = new Set(primary.map(({ reviewer }) => reviewer));
    const adjudication = matching
      .filter(({ role, reviewer }) => role === "adjudicator" && !primaryReviewers.has(reviewer))
      .at(-1);
    if (!adjudication) unresolved.push(pair.evaluationCase.id);
    else verdicts.push(adjudication.preference);
  }
  return { verdicts, unresolved };
}

function assessPairs(pairs, reviews, gate) {
  const applicable = pairs.filter(({ evaluationCase }) => evaluationCase.kind !== "negative");
  const unrelated = pairs.filter(({ evaluationCase }) => evaluationCase.kind === "negative");
  const objectiveBaselineRate =
    applicable.length === 0
      ? null
      : applicable.filter(({ baseline }) => baseline.passed).length / applicable.length;
  const objectiveCapabilityRate =
    applicable.length === 0
      ? null
      : applicable.filter(({ capability }) => capability.passed).length / applicable.length;
  const objectiveDelta =
    objectiveBaselineRate === null ? null : objectiveCapabilityRate - objectiveBaselineRate;

  const preference = resolvedPreferences(applicable, reviews, gate.quality.blinded_reviewers_min);
  const preferenceRequired = applicable.some(
    ({ evaluationCase }) => evaluationCase.preference_review === "required",
  );
  const preferenceTotal = preference.verdicts.length;
  const capabilityPreferenceRate =
    preferenceTotal === 0
      ? null
      : preference.verdicts.filter((value) => value === "capability").length / preferenceTotal;
  const baselinePreferenceRate =
    preferenceTotal === 0
      ? null
      : preference.verdicts.filter((value) => value === "baseline").length / preferenceTotal;
  const objectiveMaterial =
    objectiveDelta !== null &&
    objectiveDelta >= gate.quality.objective_pass_rate_delta_min_percentage_points / 100;
  const preferenceMaterial =
    preference.unresolved.length === 0 &&
    capabilityPreferenceRate !== null &&
    capabilityPreferenceRate >= gate.quality.capability_preference_rate_min &&
    baselinePreferenceRate <= gate.quality.baseline_preference_rate_max;
  const objectiveNonRegression =
    objectiveCapabilityRate !== null &&
    objectiveCapabilityRate >= gate.quality.capability_objective_pass_rate_min;
  const preferenceNonRegression =
    preference.unresolved.length === 0 &&
    (!preferenceRequired ||
      (baselinePreferenceRate !== null &&
        baselinePreferenceRate <= gate.quality.non_regression_baseline_preference_rate_max));
  const qualityNonRegression = objectiveNonRegression && preferenceNonRegression;

  const applicableWithTokens = applicable.filter(
    ({ baseline, capability }) =>
      baseline.metrics.total_tokens !== null && capability.metrics.total_tokens !== null,
  );
  const baselineTokens = applicableWithTokens.reduce(
    (total, { baseline }) => total + baseline.metrics.total_tokens,
    0,
  );
  const capabilityTokens = applicableWithTokens.reduce(
    (total, { capability }) => total + capability.metrics.total_tokens,
    0,
  );
  const aggregateReduction =
    baselineTokens === 0 ? null : (baselineTokens - capabilityTokens) / baselineTokens;
  const pairedImprovementRate =
    applicableWithTokens.length === 0
      ? null
      : applicableWithTokens.filter(
          ({ baseline, capability }) => capability.metrics.total_tokens < baseline.metrics.total_tokens,
        ).length / applicableWithTokens.length;
  const tokenMaterial =
    aggregateReduction !== null &&
    aggregateReduction >= gate.tokens.applicable_aggregate_reduction_min &&
    pairedImprovementRate >= gate.tokens.applicable_paired_improvement_rate_min;

  const unrelatedWithTokens = unrelated.filter(
    ({ baseline, capability }) =>
      baseline.metrics.total_tokens !== null && capability.metrics.total_tokens !== null,
  );
  const unrelatedBaselineTokens = unrelatedWithTokens.reduce(
    (total, { baseline }) => total + baseline.metrics.total_tokens,
    0,
  );
  const unrelatedCapabilityTokens = unrelatedWithTokens.reduce(
    (total, { capability }) => total + capability.metrics.total_tokens,
    0,
  );
  const unrelatedAggregateOverhead =
    unrelatedBaselineTokens === 0
      ? null
      : ratioDelta(unrelatedCapabilityTokens, unrelatedBaselineTokens);
  const unrelatedSingleCaseOverhead =
    unrelatedWithTokens.length === 0
      ? null
      : Math.max(
          ...unrelatedWithTokens.map(({ baseline, capability }) =>
            ratioDelta(capability.metrics.total_tokens, baseline.metrics.total_tokens),
          ),
        );

  const safetyFailures = pairs.filter(
    ({ evaluationCase, capability }) => evaluationCase.safety_critical && !capability.passed,
  ).length;
  const falseTriggers = unrelated.filter(({ capability }) => !capability.passed).length;
  const correctionTurnDelta = pairs.reduce(
    (total, { baseline, capability }) =>
      total + capability.metrics.correction_turns - baseline.metrics.correction_turns,
    0,
  );
  const additionalToolCalls = pairs.reduce(
    (total, { baseline, capability }) =>
      total + Math.max(0, capability.metrics.tool_calls - baseline.metrics.tool_calls),
    0,
  );
  const comparabilityFailures = pairs.filter(
    ({ baseline, capability }) =>
      baseline.environment.codex_cli !== capability.environment.codex_cli ||
      baseline.environment.node !== capability.environment.node ||
      baseline.environment.platform !== capability.environment.platform,
  ).length;
  const baselineLatency = median(pairs.map(({ baseline }) => baseline.metrics.latency_ms));
  const capabilityLatency = median(pairs.map(({ capability }) => capability.metrics.latency_ms));
  const latencyIncrease =
    baselineLatency === null ? null : ratioDelta(capabilityLatency, baselineLatency);
  const unrelatedWithinBudget =
    unrelated.length > 0 &&
    unrelatedWithTokens.length === unrelated.length &&
    unrelatedAggregateOverhead <= gate.tokens.unrelated_aggregate_overhead_max &&
    unrelatedSingleCaseOverhead <= gate.tokens.unrelated_single_case_overhead_max;
  const regressionsPass =
    safetyFailures <= gate.regressions.safety_failures_max &&
    falseTriggers <= gate.regressions.false_triggers_max &&
    correctionTurnDelta <= gate.regressions.correction_turns_aggregate_delta_max &&
    additionalToolCalls <= gate.regressions.unnecessary_tool_call_delta_max &&
    comparabilityFailures === 0 &&
    latencyIncrease !== null &&
    latencyIncrease <= gate.regressions.median_latency_relative_increase_max &&
    unrelatedWithinBudget;

  return {
    pair_count: pairs.length,
    applicable_count: applicable.length,
    unrelated_count: unrelated.length,
    quality: {
      baseline_pass_rate: objectiveBaselineRate,
      capability_pass_rate: objectiveCapabilityRate,
      delta_percentage_points: objectiveDelta === null ? null : objectiveDelta * 100,
      capability_preference_rate: capabilityPreferenceRate,
      baseline_preference_rate: baselinePreferenceRate,
      unresolved_reviews: preference.unresolved,
      non_regression: {
        objective_pass: objectiveNonRegression,
        preference_required: preferenceRequired,
        preference_pass: preferenceNonRegression,
        pass: qualityNonRegression,
      },
      material: objectiveMaterial || preferenceMaterial,
    },
    tokens: {
      baseline_total: baselineTokens,
      capability_total: capabilityTokens,
      aggregate_reduction: aggregateReduction,
      paired_improvement_rate: pairedImprovementRate,
      unrelated_aggregate_overhead: unrelatedAggregateOverhead,
      unrelated_single_case_overhead: unrelatedSingleCaseOverhead,
      material: tokenMaterial,
    },
    regressions: {
      safety_failures: safetyFailures,
      false_triggers: falseTriggers,
      correction_turn_delta: correctionTurnDelta,
      additional_tool_calls: additionalToolCalls,
      comparability_failures: comparabilityFailures,
      median_latency_increase: latencyIncrease,
      pass: regressionsPass,
    },
    complete:
      applicable.length > 0 &&
      unrelated.length > 0 &&
      applicableWithTokens.length === applicable.length &&
      unrelatedWithTokens.length === unrelated.length &&
      comparabilityFailures === 0 &&
      preference.unresolved.length === 0,
  };
}

function matrixRowFor(pair, policyIds) {
  const configuration = runConfiguration(pair.capability);
  const kind = pair.evaluationCase.kind;
  if (configuration === DEFAULT_CONFIGURATION && policyIds.has(pair.capability.capability)) {
    return kind === "negative" ? "policy-negative" : "policy-positive";
  }
  if (configuration === DEFAULT_CONFIGURATION && pair.capability.capability === "engineering-discovery") {
    return kind === "negative" ? "discovery-negative" : "discovery-positive";
  }
  if (configuration === "complete-core-policies" && kind === "precedence") {
    return "policy-precedence";
  }
  if (configuration === "phase-1-combined") {
    return kind === "negative" ? "combined-unrelated" : "combined-applicable";
  }
  return null;
}

function assessMatrix(pairs, gate) {
  const policyIds = new Set(gate.scope.capabilities.filter((id) => id !== "engineering-discovery"));
  return gate.matrix.map((row) => {
    const matching = pairs.filter((pair) => matrixRowFor(pair, policyIds) === row.id);
    if (row.target === "each-retained-policy") {
      const byPolicy = Object.fromEntries(
        [...policyIds].map((id) => {
          const policyPairs = matching.filter(({ capability }) => capability.capability === id);
          const dimensions = new Set(policyPairs.flatMap(({ evaluationCase }) => evaluationCase.gate_dimensions ?? []));
          return [
            id,
            {
              observed: policyPairs.length,
              required: row.minimum_case_pairs,
              missing_dimensions: row.dimensions.filter((dimension) => !dimensions.has(dimension)),
              complete:
                policyPairs.length >= row.minimum_case_pairs &&
                row.dimensions.every((dimension) => dimensions.has(dimension)),
            },
          ];
        }),
      );
      return { id: row.id, by_policy: byPolicy, complete: Object.values(byPolicy).every(({ complete }) => complete) };
    }
    const dimensions = new Set(matching.flatMap(({ evaluationCase }) => evaluationCase.gate_dimensions ?? []));
    return {
      id: row.id,
      observed: matching.length,
      required: row.minimum_case_pairs,
      missing_dimensions: row.dimensions.filter((dimension) => !dimensions.has(dimension)),
      complete:
        matching.length >= row.minimum_case_pairs &&
        row.dimensions.every((dimension) => dimensions.has(dimension)),
    };
  });
}

export function calculatePhaseOneGate({ gate, cases, baselines, results, reviews }) {
  const caseById = new Map(cases.map((evaluationCase) => [evaluationCase.id, evaluationCase]));
  const baselineByCase = new Map(baselines.map((run) => [run.case_id, run]));
  const pairs = results
    .map((capability) => ({
      evaluationCase: caseById.get(capability.case_id),
      baseline: baselineByCase.get(capability.case_id),
      capability,
    }))
    .filter(({ evaluationCase, baseline }) => evaluationCase && baseline);

  const individual = {};
  for (const capabilityId of gate.scope.capabilities) {
    const capabilityPairs = pairs.filter(
      ({ capability }) =>
        runConfiguration(capability) === DEFAULT_CONFIGURATION &&
        capability.capability === capabilityId,
    );
    const assessment = assessPairs(capabilityPairs, reviews, gate);
    individual[capabilityId] = {
      ...assessment,
      incremental_value:
        assessment.complete &&
        assessment.regressions.pass &&
        assessment.quality.non_regression.pass &&
        (assessment.quality.material || assessment.tokens.material),
    };
  }
  const combinedAssessment = assessPairs(
    pairs.filter(({ capability }) => runConfiguration(capability) === "phase-1-combined"),
    reviews,
    gate,
  );
  const combinedPass =
    combinedAssessment.complete &&
    combinedAssessment.regressions.pass &&
    combinedAssessment.quality.non_regression.pass &&
    combinedAssessment.quality.material &&
    combinedAssessment.tokens.material;
  const matrix = assessMatrix(pairs, gate);
  const matrixComplete = matrix.every(({ complete }) => complete);
  const individualPass = Object.values(individual).every(({ incremental_value }) => incremental_value);
  const complete =
    matrixComplete &&
    Object.values(individual).every((assessment) => assessment.complete) &&
    combinedAssessment.complete;
  const passed = complete && individualPass && combinedPass;
  return {
    schema_version: 1,
    gate_id: gate.id,
    calculated_at: new Date().toISOString(),
    status: complete ? (passed ? "pass" : "fail") : "incomplete",
    matrix,
    individual,
    combined: { ...combinedAssessment, pass: combinedPass },
    summary: {
      matrix_complete: matrixComplete,
      individual_pass: individualPass,
      combined_pass: combinedPass,
      passed,
    },
  };
}
