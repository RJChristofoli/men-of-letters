# Capability Specification: `documentation`

Status: proposed implementation; canonical source and controlled installation
exist, but comparative evaluation is pending.

## Identity and Ownership

- ID: `documentation`
- Type: policy
- Owner: `RJChristofoli`
- Installation pack: `core-policies`
- Lifecycle status: `proposed`
- Target introduction: `core-policies@0.1.0-dev.0`

## Problem and Goal

- Problem: documentation changes can use the wrong artifact language, duplicate
  detail, become stale, or present plans as implemented behavior.
- Goal: keep affected documentation accurate, scoped, navigable, and aligned with
  the repository or explicitly requested language and style.
- Success: commands, links, status, compatibility, and examples match verified
  behavior without turning entry documents into internal histories.
- Non-goals: forcing English everywhere, generating documentation without need,
  or treating prose as correctness evidence.

## Activation and Boundary

- Positive applicability: creating or updating documentation and user-facing
  examples for a material change.
- Exclusions: code-only work with no documentation impact and user conversation
  language that is not an artifact.
- Explicit-only: no; it is a compact installed default.
- Priority and conflicts: domain defaults; `artifact-language` and
  `documentation-scope`.
- Yields to: explicit user language, narrower repository conventions, evidence,
  and higher-authority requirements.
- Stop conditions: affected behavior is not verified or the required artifact
  language cannot be determined safely.

## Contract

- Inputs: requested language, existing repository style, verified behavior,
  affected audiences, commands, links, compatibility, and status.
- Output effect: update only affected docs, keep entry points concise, and move
  necessary detail to focused pages.
- Constraints: plans remain plans; documentation is not proof of implementation.
- Dependencies: `evidence`.
- Known limitation: it does not replace specialized documentation workflows.

## Execution and Safety

- Mode: policy constraint; documentation mutation remains governed by
  `safe-change` when that policy is installed.
- Scope and authority: only task-authorized artifacts and verified claims.
- Verification: links, commands, examples, language, status, compatibility, and
  synchronization with the actual change.
- Rollback: restore the prior owned documentation change through version control.

## Progressive Disclosure

- Installed source: language, scope, entry-point, accuracy, and claim boundaries.
- Detailed checklists remain authoring governance, not always-loaded context.
- Runtime references, scripts, templates, assets, and policy-owned tools: none.

## Evidence and Evaluation

- Evidence today: source budget and complete-pack lifecycle checks pass.
- No-capability baseline: matched documentation tasks without this policy.
- Planned positive coverage: primary language/accuracy rule, scope boundary, and
  ambiguous plan-versus-implementation case.
- Planned negative coverage: non-interference, conversation-versus-artifact
  boundary, and unrelated task.
- Metrics and gate: correctness, freshness, blinded clarity, total tokens,
  corrections, false constraints, and the Phase 1 quality floor.
- Promotion: only after fresh representative comparisons demonstrate value.

## Budgets, Compatibility, and Decision

- Always-loaded context: at most 100 estimated tokens; no conditional context or
  policy-owned tool calls.
- Bootstrap compatibility: `0.1.0-dev.0` in controlled complete-pack tests.
- Host behavior compatibility: unknown until comparative runs.
- Alternatives: hard-code one global language, rejected because repository and
  user scope differ; do nothing remains the evaluation baseline.
- Decision: retain the contextual documentation policy as proposed.

## Documentation Impact

Update the catalog, roadmap, evaluation guide, and lifecycle evidence when cases
or status change.
