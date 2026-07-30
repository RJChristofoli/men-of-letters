# Capability Specification: `engineering-discovery`

Status: proposed implementation; promotion to experimental requires the initial
plugin, skill, repository, and capability-run checks to pass.

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

- `SKILL.md`: routing, core workflow, safety, and output contract.
- Conditional reference: evidence and alternative-analysis rigor for disputed,
  technology-selection, or cross-boundary decisions.
- Scripts/assets: none.

## Evidence and Evaluation

- Baseline: `discovery-architecture-001` accepted no-capability run.
- Suite: `engineering-discovery`.
- Positive cases: asynchronous report architecture comparison.
- Negative cases: accepted-design implementation case
  `discovery-accepted-design-002` passes without an observed response-level false
  trigger; broader negative coverage remains required before promotion.
- Metrics: task checks, technical correctness, input/output/total tokens, turns,
  tool calls, latency, correction turns, trigger precision, and human preference.
- Promotion: representative positive and negative cases must show material quality
  or efficiency gain without unacceptable safety or trigger regressions.
- Rollback: return status to `proposed` or revise the skill if the initial
  capability run regresses against baseline.

## Budgets

- `SKILL.md`: fewer than 200 lines and 1,800 catalog context-budget tokens.
- References: one level deep and conditionally loaded.
- Side-effect/tool budget: read-only; stop research when it cannot change the
  decision or experiment.
- Total tokens: compare per completed task; no unmeasured savings claim.

## Compatibility and Lifecycle

- Tested host: Codex CLI 0.146.0 on the two recorded initial cases.
- Pack/bootstrap: plugin pack `0.1.0-dev.0`; bootstrap compatibility not yet
  implemented.
- Lifecycle: promote to experimental only after plugin/skill validation and the first
  capability forward run pass. Stable compatibility is not claimed.

## Alternatives and Decision

- Do nothing: rely on general model behavior; the baseline shows a strong answer,
  so this skill must prove incremental value rather than mere completeness.
- Alternatives: always-on discovery policy or a broad implementation orchestrator.
- Decision: a narrow router avoids always-loaded workflow cost and keeps
  implementation separate. Confidence is medium pending comparative evaluation.

## Documentation Impact

Update the catalog, pack manifest, evaluation guide/evidence, README capability
status, and roadmap when evaluation changes lifecycle or distribution status.
