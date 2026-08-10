# Capability Specification: `backend-defaults`

Status: proposed implementation; canonical source and controlled installation
exist, but comparative evaluation is pending.

## Identity and Ownership

- ID: `backend-defaults`
- Type: policy
- Owner: `RJChristofoli`
- Installation pack: `core-policies`
- Lifecycle status: `proposed`
- Target introduction: `core-policies@0.1.0-dev.0`

## Problem and Goal

- Problem: backend changes can overlook public contracts, data, trust boundaries,
  failure semantics, idempotency, observability, or operationally unbounded work.
- Goal: provide lightweight production defaults without imposing a framework or
  replacing specialist review.
- Success: applicable work preserves contracts and data, handles relevant trust
  and failure boundaries, reuses intentional architecture, and avoids unsupported
  optimization claims.
- Non-goals: exhaustive security, database, API, performance, or architecture
  review; new layers by default; measurable optimization without a baseline.

## Activation and Boundary

- Positive applicability: backend services, APIs, persistence, workers, events,
  integrations, and server-side runtime changes.
- Exclusions: frontend-only, documentation-only, mechanical, or unrelated work.
- Explicit-only: no; it is a compact installed default.
- Priority and conflicts: domain defaults; `architecture`, `naming`, and
  `production-readiness`.
- Yields to: host authority, safety, accepted repository architecture, and
  higher-priority policies.
- Stop conditions: a specialist risk requires a narrower workflow, or missing
  contract/data/authority evidence blocks safe progress.

## Contract

- Inputs: affected contracts and data, trust boundaries, failure and delivery
  semantics, operational signals, existing boundaries, names, and workload shape.
- Output effect: apply only relevant production defaults and identify specialist
  follow-up when risk justifies it.
- Constraints: add architecture only for demonstrated need; optimization claims
  require measurement.
- Dependencies: `engineering-principles`, `evidence`, and `safe-change`.
- Known limitation: compact defaults cannot replace domain-specific review.

## Execution and Safety

- Mode: policy constraint; it grants no authority or mutation.
- Read/write scope, external systems, approvals, side effects, rollback, and
  destructive actions: unchanged from narrower contracts and `safe-change`.
- Verification: relevant contract, data, trust, failure, idempotency,
  observability, and bounded-work checks.

## Progressive Disclosure

- Installed source: compact backend risk and architecture defaults.
- Specialist detail: future conditional review references and workflows, loaded
  only when the change triggers them.
- Scripts, templates, assets, and policy-owned tools: none.

## Evidence and Evaluation

- Evidence today: source budget and complete-pack lifecycle checks pass.
- No-capability baseline: matched backend tasks without this policy.
- Planned positive coverage: primary rule, scope boundary, and adverse or
  ambiguous production change.
- Planned negative coverage: non-interference, nearest non-backend trigger, and
  unrelated work.
- Metrics and gate: objective technical coverage, blinded actionability,
  total tokens, tools, turns, latency, corrections, false constraints, and the
  Phase 1 quality floor.
- Promotion: only after fresh representative pairs show incremental value.

## Budgets, Compatibility, and Decision

- Always-loaded context: at most 150 estimated tokens; no conditional context or
  policy-owned tool calls.
- Bootstrap compatibility: `0.1.0-dev.0` in controlled complete-pack tests.
- Host behavior compatibility: unknown until comparative runs.
- Alternatives: a large production-readiness skill, rejected as always-loaded
  scope; do nothing remains the evaluation baseline.
- Decision: keep narrow defaults proposed and route specialist depth elsewhere.

## Documentation Impact

Update the catalog, roadmap, evaluation guide, and lifecycle evidence when cases
or status change.
