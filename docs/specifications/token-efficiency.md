# Capability Specification: `token-efficiency`

Status: experimental implementation; deterministic installation and an initial
controlled positive/negative pair pass, but material token value is not shown.

## Identity and Ownership

- ID: `token-efficiency`
- Type: policy
- Owner: `RJChristofoli`
- Installation pack: `core-policies`
- Lifecycle status: `experimental`
- Target introduction: `core-policies@0.1.0-dev.0`

## Problem and Goal

- Problem: agent work can spend tokens on repeated context, narration, unrelated
  findings, unnecessary tools, or detail beyond what the task needs.
- Goal: reduce total tokens per completed task by choosing the smallest sufficient
  context, execution path, and response while preserving task quality.
- Success: applicable tasks use fewer total tokens or unnecessary calls without
  losing required content, and explicit-detail or higher-priority tasks do not
  regress.
- Non-goals: a compressed dialect, arbitrary response-length caps, prompt
  rewriting, external token tooling, or skipping validation and safety controls.

## Activation and Boundary

- Positive applicability: tasks with repeated context, multiple independent
  reads or calls, broad narration, or open-ended response detail.
- Exclusions: no efficiency behavior may remove explicitly requested detail,
  required teaching context, evidence, correctness, validation, safety, or a
  clarification necessary to complete the task.
- Explicit-only: no; it is a compact installed default.
- Priority: efficiency, token use, context selection, and response detail.
- Conflict keys: `response-detail`, `context`, `tooling`.
- Yields to: host authority, narrower task and repository requirements, safety,
  correctness, evidence, validation, and `safe-change`.
- Stop conditions: the task is complete with sufficient support, or further
  compression would remove required substance or create material uncertainty.

## Contract

- Inputs: task outcome, requested detail, available context and evidence,
  independent work, required checks, and authority boundaries.
- Output effect: lead with the outcome; select only decision-relevant context;
  batch independent work; omit repetition, narration, and unrelated findings.
- Constraints: optimize total tokens per completed task rather than response
  brevity in isolation; do not create rework by omitting necessary information.
- Dependencies: `safe-change`.
- Known limitation: always-loaded policy text has a fixed input cost, so value
  depends on avoiding more downstream work than that cost.

## Execution and Safety

- Mode: policy constraint; it grants no authority and performs no mutation.
- Read scope: task-authorized context needed for the outcome.
- Write scope and side effects: none from the policy itself.
- External systems: prefer no call when available evidence is sufficient; batch
  independent calls only when the underlying tool contract permits it.
- Required approvals: unchanged from host, task, repository, and `safe-change`
  requirements.
- Partial failure: retain required evidence and report the unresolved portion;
  do not hide it to save tokens.
- Verification: compare matched task success, total tokens, turns, tool calls,
  latency, and correction turns.
- Rollback: remove the managed policy block or revert its wording if evaluation
  shows rework, lost detail, false constraints, or net token regression.

## Progressive Disclosure

- Installed source: one self-contained minimum-sufficient rule with explicit
  quality and safety boundaries.
- References, scripts, templates, assets, and runtime fixtures: none.
- Reuse: workflows may rely on the policy instead of repeating generic brevity
  or batching instructions.

## Evidence and Evaluation

- Important claim: the policy is intended to reduce total tokens. Initial
  matched runs reduced output tokens but increased total tokens, so material
  efficiency remains a hypothesis.
- No-capability baseline: identical case, schema, host configuration, and
  environment without the policy source.
- Evaluation suite: `token-efficiency`.
- Initial positive case: `token-efficiency-handoff-001` tests removal of noisy,
  irrelevant implementation notes while preserving an actionable handoff.
- Initial negative case: `token-efficiency-audit-002` tests preservation of an
  explicitly requested detailed audit.
- Objective checks: required decisions, constraints, validation, rollback, and
  audit findings remain present.
- Metrics: task success, input/output/total tokens, turns, tool calls, latency,
  correction turns, and negative-case overhead.
- Experimental evidence: both initial cases pass in one turn with no tools or
  corrections. Output fell by 108 tokens (13.1%) in aggregate, but the policy's
  input cost changed total usage from 29,779 to 29,897 tokens (+118, +0.4%). The
  detailed negative case remained complete with +0.3% total-token overhead.
- Experimental gate: deterministic install/update/doctor/uninstall checks and
  both initial cases pass; requested detail, safety content, and correctness are
  preserved. This supports `experimental`, not `validated`.
- Validation gate: satisfy the representative positive, negative, precedence,
  combined, token, quality, and blinded-review thresholds in the
  [pre-registered Phase 1 gate](../phase-1-evaluation-gate.md).
- Regression: revise, narrow, or remove the policy if it increases rework,
  suppresses required substance, or cannot demonstrate incremental value.

## Budgets

- Always-loaded context: at most 100 estimated tokens.
- Conditional context and tool calls: zero from the policy itself.
- Execution time: no direct execution overhead beyond instruction processing.
- Total tokens: measure per completed task; source size alone is not evidence of
  efficiency.

## Compatibility and Lifecycle

- Tested host: Codex CLI 0.146.0 on Linux x64.
- Bootstrap compatibility: `0.1.0-dev.0` in controlled repository-scope tests.
- Pack status: `core-policies` remains proposed and incomplete.
- Migration: checksummed managed blocks support reviewed updates and clean
  removal without editing unmanaged instructions.

## Alternatives and Decision

- Do nothing: rely on model defaults, retained as the comparison baseline.
- External compression or communication modes: rejected because Phase 1 must be
  repository-native and must measure completed-task value, not stylistic brevity.
- Workflow-specific duplication: rejected because it repeats context and can
  diverge across capabilities.
- Decision: retain the compact policy as `experimental` while fresh,
  representative cases test whether tool/context savings can exceed its fixed
  input cost. Revise, narrow, or remove it if incremental value is not shown.

## Documentation Impact

Update the README, bootstrap and evaluation guides, catalog, roadmap, and
lifecycle evidence when controlled results change implementation status.
