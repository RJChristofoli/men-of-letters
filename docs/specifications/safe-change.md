# Capability Specification: `safe-change`

Status: experimental implementation; initial precedence, activation, update,
removal, positive, and negative evidence passes, but representative validation is
incomplete.

## Identity and Ownership

- ID: `safe-change`
- Type: policy
- Owner: `RJChristofoli`
- Installation pack: `core-policies`
- Lifecycle status: `experimental`
- Target introduction: `core-policies@0.1.0-dev.0`

## Problem and Goal

- Problem: implementation can broaden scope, overwrite unowned work, bypass
  validation, or cross destructive and persistent boundaries without sufficient
  authority or rollback.
- Goal: make routine changes small and reversible while stopping unsafe or
  unauthorized mutation.
- Success: mutating work checks scope and ownership, preserves unrelated state,
  validates to risk, and stops safely on unresolved preconditions.
- Non-goals: requiring approval for read-only work, replacing platform safety, or
  prescribing domain-specific tests.

## Activation and Boundary

- Positive applicability: file, configuration, dependency, generated artifact,
  persistent instruction, external-system, publishing, migration, or destructive
  mutation.
- Exclusions: read-only inspection and explanation that performs no mutation.
- Explicit-only: no; it is a compact installed default.
- Priority: safety first, then correctness and safe-change requirements.
- Conflict keys: `authority`, `mutation`, `rollback`.
- Yields to: host authority and stricter security, privacy, authorization, or
  narrower repository controls.
- Stop conditions: unclear scope or ownership, failed preconditions, unsafe
  rollback, changed preflight state, failed required validation, or missing
  authority for a protected boundary.

## Contract

- Inputs: requested outcome, exact targets, ownership, current state, authority,
  risk, validation, and rollback path.
- Output effect: choose the smallest reversible change, preserve unrelated work,
  confirm protected actions, validate proportionally, and report partial results.
- Constraints: a lower-priority efficiency or style preference cannot suppress a
  required safety or validation control.
- Dependencies: `evidence`.
- Known limitation: the compact source cannot encode every domain-specific risk;
  workflows and repository rules may impose stricter controls.

## Execution and Safety

- Mode: policy constraint for mutating work.
- Read scope: task-authorized targets, ownership, applicable instructions, state,
  and validation evidence.
- Write scope: only the exact targets authorized by the task and narrower rules.
- External systems and side effects: require task authority and explicit approval
  at destructive, irreversible, privileged, publishing, or persistent boundaries.
- Idempotency: prefer idempotent operations and re-check state before mutation.
- Partial failure: preserve or restore the last known good state and report what
  remains unresolved.
- Verification: risk-proportionate checks plus diff and scope review.
- Rollback: version-control recovery, backups, or a declared domain mechanism.

## Progressive Disclosure

- Installed source: compact scope, authority, reversibility, validation, and stop
  rules.
- Detailed execution contract: repository governance, loaded by authors rather
  than installed with every task.
- Scripts, templates, assets, and fixtures: none loaded at runtime.

## Evidence and Evaluation

- No-capability baseline: matched runs for each case.
- Evaluation suite: `safe-change`.
- Positive cases: `safe-change-destructive-001` and
  `safe-change-precedence-003`.
- Negative case: `safe-change-readonly-002`.
- Objective checks: protected action is stopped, ownership and rollback are
  requested, efficiency cannot override safety, and read-only work adds no false
  approval requirement.
- Deterministic checks: policy budgets plus activation, version update, doctor,
  checksum ownership, and clean removal through the bootstrap.
- Metrics: task success, tokens, latency, turns, corrections, false constraints,
  and context overhead.
- Experimental gate: deterministic checks and all initial cases pass with bounded
  overhead and no observed negative-task regression.
- Validation gate: broader comparisons must satisfy the
  [pre-registered Phase 1 gate](../phase-1-evaluation-gate.md), including
  individual incremental value and combined configuration guardrails.
- Regression: revise or remove the policy if it causes unsafe execution, blocks
  authorized read-only work, or loses against a lower-priority efficiency rule.

## Budgets

- Always-loaded context: at most 100 estimated tokens.
- Conditional context and tool calls: zero from the policy itself.
- Total tokens: measure per completed task against the matched baseline.

## Compatibility and Lifecycle

- Tested host: Codex CLI 0.146.0 on Linux x64.
- Bootstrap compatibility: `0.1.0-dev.0` in controlled repository-scope
  activation, update, doctor, and removal tests.
- Pack status: `core-policies` is experimental and ready for controlled field testing.
- Migration: managed checksummed blocks preserve unmanaged bytes and fail closed
  on local modification.

## Alternatives and Decision

- Do nothing: rely on host safety and task-specific prompting, which remains the
  baseline but does not cover repository ownership or rollback consistently.
- Alternative: duplicate safe-change rules in every workflow, rejected because
  it increases context and conflict risk.
- Decision: continue one compact high-priority policy experimentally plus
  narrower workflow contracts. Initial safety is supported; incremental value
  remains unproven.

## Documentation Impact

Update the catalog, installer/evaluation guides, roadmap, and lifecycle status
when activation or comparative evidence changes.
