# Capability Specification: `evidence`

Status: experimental implementation; initial controlled activation and comparative
positive and negative runs pass, but representative validation is incomplete.

## Identity and Ownership

- ID: `evidence`
- Type: policy
- Owner: `RJChristofoli`
- Installation pack: `core-policies`
- Lifecycle status: `experimental`
- Target introduction: `core-policies@0.1.0-dev.0`

## Problem and Goal

- Problem: agent responses can present assumptions, partial checks, or plausible
  statements as verified facts or completed outcomes.
- Goal: make the support and confidence behind material claims explicit without
  adding ceremony to routine transformations.
- Success: decisive claims cite inspected support, distinguish evidence classes,
  and report failed or skipped validation without fabricated certainty.
- Non-goals: forcing citations on trivial text transformations, prescribing a
  response format, or replacing domain validation.

## Activation and Boundary

- Positive applicability: material factual, completion, safety, quality, or
  efficiency claims and decisions that depend on them.
- Exclusions: purely mechanical or creative output with no material claim.
- Explicit-only: no; it is a compact installed default.
- Priority: correctness, evidence, and validation.
- Conflict keys: `claims`, `completion`.
- Yields to: host authority, safety, privacy, authorization, and narrower
  accepted repository contracts.
- Stop conditions: available support is classified, missing validation is named,
  or a required fact cannot be obtained safely.

## Contract

- Inputs: inspected artifacts, commands, observations, measurements, accepted
  documents, and stated assumptions relevant to a material claim.
- Output effect: claims are classified as measured, observed, documented,
  inferred, or assumed and completion reflects passed, failed, and skipped work.
- Constraints: never fabricate evidence, precision, a check, or a completed state.
- Dependencies: none.
- Known limitation: evidence classification improves calibration but does not by
  itself establish technical correctness.

## Execution and Safety

- Mode: read-only policy constraint; it grants no authority and performs no
  mutation itself.
- Read scope: only task-authorized evidence already available or safely inspected.
- Write scope, external systems, side effects, rollback, and destructive actions:
  none.
- Verification: compare claims with recorded artifacts and objective checks.
- Partial failure: report the unsupported portion and preserve supported results.

## Progressive Disclosure

- Installed source: compact, self-contained claim and completion rules.
- References, scripts, templates, assets, and fixtures: none loaded at runtime.
- Reuse: workflows cite this policy instead of repeating its wording.

## Evidence and Evaluation

- No-capability baseline: matched runs for each case.
- Evaluation suite: `evidence`.
- Positive case: `evidence-claim-001` tests an overstated numerical improvement
  claim and unsupported rollout readiness.
- Negative case: `evidence-format-002` tests context overhead and non-interference
  on a mechanical transformation.
- Objective checks: structured accuracy, correct evidence class, unsupported
  claim handling, and unchanged negative-case output.
- Metrics: task success, tokens, latency, turns, corrections, and context overhead.
- Experimental gate: both cases and controlled activation pass with bounded
  overhead and no observed regression.
- Validation gate: broader comparisons must establish material incremental value
  without unacceptable negative-case overhead.
- Regression: return to proposal revision if the policy invents support, obscures
  failed checks, or materially harms unrelated tasks.

## Budgets

- Always-loaded context: at most 120 estimated tokens.
- Conditional context and tool calls: zero from the policy itself.
- Total tokens: measure per completed task against the matched baseline.

## Compatibility and Lifecycle

- Tested host: Codex CLI 0.146.0 on Linux x64.
- Bootstrap compatibility: `0.1.0-dev.0` in controlled repository-scope tests.
- Pack status: `core-policies` remains proposed and incomplete.
- Migration: managed checksummed blocks support reviewed update and clean removal.

## Alternatives and Decision

- Do nothing: rely on general model calibration, which remains the baseline.
- Alternative: repeat evidence rules inside every skill, rejected because it
  duplicates context and can diverge.
- Decision: continue one compact cross-cutting policy experimentally. Initial
  safety is supported; incremental value remains unproven.

## Documentation Impact

Update the catalog, evaluation guide, roadmap, and capability status when
recorded results change the evidence or lifecycle decision.
