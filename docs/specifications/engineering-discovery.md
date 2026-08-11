# Capability Specification: `engineering-discovery`

Status: experimental implementation; plugin, skill, repository, and initial
comparative checks pass, but promotion still requires repeated material quality
or efficiency benefit without unacceptable regressions.

## Identity and Ownership

- ID: `engineering-discovery`
- Type: router
- Owner: `RJChristofoli`
- Installation pack: `engineering-discovery`
- Target introduction: `engineering-discovery@0.1.0-dev.0`

## Problem and Goal

- Problem: implementation begins before unresolved engineering alternatives and
  their evidence, risks, and reversibility are explicit.
- Goal: produce a bounded decision proposal and falsifiable validation experiment
  before implementation.
- Success: relevant alternatives are compared consistently, claims are
  classified, a recommendation is actionable, and no implementation side effect
  occurs.
- Non-goals: implementation, existing-diff review, routine debugging, ADR file
  generation, and measured optimization.

## Activation and Boundary

- Positive triggers: unresolved feature design, technology research,
  architecture proposal, alternative comparison, feasibility, trade-off, or
  proof-of-concept planning.
- Negative triggers: accepted design implementation, code review, routine bug
  diagnosis, and performance work lacking a target and baseline.
- Explicit-only: no; narrow implicit activation is allowed.
- Stop conditions: recommendation is supported; a material fact or authority is
  unavailable; evidence cannot distinguish options; or the user requests
  implementation without expanding scope.

## Contract

- Inputs: goal, current state, constraints, decision boundary, relevant artifacts,
  and available evidence.
- Output: goal, current state, constraints/assumptions, alternatives, evidence,
  trade-offs/contraindications, recommendation, expected gain, validation
  experiment, risks/reversibility, and optional ADR handoff.
- Dependencies: none. It may hand off to `generate-adr` after that capability
  exists.
- Limitation: quality depends on accessible current-state and technology evidence;
  a structured answer alone does not prove technical correctness.

## Execution and Safety

- Mode: read-only.
- Read scope: task-relevant repository artifacts and authoritative sources.
- Write scope and side effects: none.
- Approval: required before proof-of-concept or implementation mutation.
- Idempotency: repeated discovery is non-mutating but may differ as evidence
  changes.
- Verification: objective output checks plus technical review against raw case
  artifacts.
- Rollback: not applicable to discovery; discard the proposal.

## Progressive Disclosure

- `SKILL.md`: compact routing, decision workflow, cost controls, safety, and
  output contract.
- Default path: use supplied evidence and do not load a reference for routine
  technology or architecture comparisons.
- Conditional reference: load deeper evidence and alternative-analysis rigor only
  when material evidence conflicts or a costly-to-reverse decision remains
  ambiguous.
- Conditional assets: `assets/discovery-brief.md` for a reusable decision brief
  and `assets/adr-handoff.md` when a proposal needs an ADR-ready handoff. Load
  them only when the task needs those artifacts.

## Evidence and Evaluation

- Baseline: `discovery-architecture-001` accepted no-capability run.
- Suite: `engineering-discovery`.
- Positive cases: asynchronous report architecture comparison.
- Negative cases: accepted-design implementation case
  `discovery-accepted-design-002` passes without an observed response-level false
  trigger; broader negative coverage remains required before promotion.
- Metrics: task checks, technical correctness, input/output/total tokens, turns,
  tool calls, latency, correction turns, trigger precision, and human preference.
- Promotion: representative positive and negative cases must satisfy the
  [pre-registered Phase 1 gate](../phase-1-evaluation-gate.md), including
  individual incremental value and the combined quality-and-token gate.
- Rollback: return status to `proposed` or revise the skill if the initial
  capability run regresses against baseline.

## Budgets

- `SKILL.md`: fewer than 100 lines and 800 catalog context-budget tokens,
  enforced by repository validation.
- References: one level deep and conditionally loaded.
- Default output: compact decision boundary, evidence/unknowns, options,
  recommendation, validation, and risk/rollback/ADR sections without repeated
  facts.
- Side-effect/tool budget: read-only; stop research when it cannot change the
  decision or experiment.
- Total tokens: compare per completed task; no unmeasured savings claim.

## Compatibility and Lifecycle

- Tested host: Codex CLI 0.146.0 on the two recorded initial cases.
- Pack/bootstrap: plugin pack and bootstrap `0.1.0-dev.0`; clean copied and
  local-link install, discovery, doctor, removal, dry-run, and archive checks pass.
- Lifecycle: experimental for controlled field testing; broader matched
  comparisons must establish material benefit and acceptable routing behavior.
  Stable compatibility is not claimed.

## Alternatives and Decision

- Do nothing: rely on general model behavior; the baseline shows a strong answer,
  so this skill must prove incremental value rather than mere completeness.
- Alternatives: always-on discovery policy or a broad implementation orchestrator.
- Decision: a narrow router avoids always-loaded workflow cost and keeps
  implementation separate. Confidence is medium pending comparative evaluation.

## Documentation Impact

Update the catalog, pack manifest, evaluation guide/evidence, README capability
status, and roadmap when evaluation changes lifecycle or distribution status.
