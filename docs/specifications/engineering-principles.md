# Capability Specification: `engineering-principles`

Status: experimental implementation; source, installation, and the individual
representative matrix exist, but blinded review and incremental value remain
unresolved.

## Identity and Ownership

- ID: `engineering-principles`
- Type: policy
- Owner: `RJChristofoli`
- Installation pack: `core-policies`
- Lifecycle status: `experimental`
- Target introduction: `core-policies@0.1.0-dev.0`

## Problem and Goal

- Problem: engineering work can optimize the visible request while missing the
  root problem, accepted constraints, compatibility, or proportionate validation.
- Goal: make correct completed-task outcomes, simple compatible solutions, and
  risk-proportionate depth the default.
- Success: solutions address the root need, preserve intentional behavior, name
  material trade-offs, and avoid speculative abstraction.
- Non-goals: prescribing architecture, duplicating evidence or mutation rules,
  or forcing extensive analysis on routine tasks.

## Activation and Boundary

- Positive applicability: software analysis, design, implementation, review,
  refactoring, diagnosis, and optimization.
- Exclusions: mechanical or creative tasks without an engineering decision.
- Explicit-only: no; it is a compact installed default.
- Priority and conflicts: correctness; `solution-scope`, `complexity`, and
  `trade-offs`.
- Yields to: host authority, safety, and narrower accepted repository contracts.
- Stop conditions: the outcome is supported and validated to risk, or a material
  missing constraint prevents a responsible decision.

## Contract

- Inputs: goal, current state, constraints, accepted decisions, behavior, risk,
  and available verification.
- Output effect: choose the simplest compatible solution to the root problem;
  preserve intentional behavior; expose material trade-offs and uncertainty.
- Constraints: depth scales with risk; simplicity cannot bypass correctness.
- Dependencies: none.
- Known limitation: domain-specific production rules belong to narrower policies
  and workflows.

## Execution and Safety

- Mode: policy constraint; it grants no authority or mutation.
- Read/write scope, external systems, approvals, side effects, and rollback:
  unchanged from the task, host, repository, and `safe-change` requirements.
- Verification: evaluate goal coverage, compatibility, trade-offs, and checks
  proportionate to risk.

## Progressive Disclosure

- Installed source: compact goal, simplicity, compatibility, trade-off, and
  validation-depth rules.
- Runtime references, scripts, templates, assets, and tools: none.
- Reuse: domain policies and workflows add narrower rules without repeating this
  default.

## Evidence and Evaluation

- Evidence today: source budget and complete-pack lifecycle checks pass; six
  matched individual pairs pass with 100% capability objective success and 0.91%
  unrelated overhead. Zero tool calls were recorded; correction turns were not
  measured.
- No-capability baseline: matched runs without this policy.
- Planned positive coverage: primary rule, boundary, and adverse or ambiguous
  engineering decisions.
- Planned negative coverage: non-interference, nearest negative trigger, and an
  unrelated task.
- Metrics and gate: objective correctness, blinded preference where subjective,
  total tokens, turns, tools, latency, corrections, and the Phase 1 quality floor.
- Promotion: only after fresh representative pairs show incremental value without
  regression.

## Budgets, Compatibility, and Decision

- Always-loaded context: at most 140 estimated tokens; no conditional context or
  policy-owned tool calls.
- Bootstrap compatibility: `0.1.0-dev.0` in controlled complete-pack tests.
- Host behavior tested only on Codex CLI 0.146.0; broader compatibility unknown.
- Alternatives: repeat principles in every workflow, rejected as duplication; do
  nothing remains the evaluation baseline.
- Decision: retain as experimental for controlled field testing. Applicable total tokens increased 0.8%, no
  objective gain appeared over the strong baseline, and blinded review is
  unresolved.

## Documentation Impact

Update the catalog, roadmap, evaluation guide, and lifecycle evidence when cases
or status change.
