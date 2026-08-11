# Capability Specification: `versioning-and-lifecycle`

Status: experimental implementation; source, installation, and the individual
representative matrix exist, but blinded review and final value remain
unresolved.

## Identity and Ownership

- ID: `versioning-and-lifecycle`
- Type: policy
- Owner: `RJChristofoli`
- Installation pack: `core-policies`
- Lifecycle status: `experimental`
- Target introduction: `core-policies@0.1.0-dev.0`

## Problem and Goal

- Problem: version, compatibility, release, and lifecycle claims can be based on
  diff size or intent instead of behavioral impact and recorded evidence.
- Goal: keep versions and lifecycle states distinct, evidence-backed, and safe
  for affected consumers.
- Success: breaking, deprecating, and retiring behavior identifies consumers,
  migration, rollback, and release communication.
- Non-goals: imposing a universal version scheme over repository contracts,
  releasing artifacts, or promoting a capability automatically.

## Activation and Boundary

- Positive applicability: public behavior, compatibility, version, release,
  promotion, deprecation, or retirement decisions.
- Exclusions: private implementation changes with no contract or lifecycle claim.
- Explicit-only: no; it is a compact installed default.
- Priority and conflicts: compatibility; `versioning`, `compatibility`, and
  `lifecycle`.
- Yields to: host authority, safety, and narrower repository versioning/release
  contracts.
- Stop conditions: impact, affected consumers, evidence, migration, or rollback
  is materially unknown for the requested claim.

## Contract

- Inputs: behavioral impact, public contracts, consumers, current version and
  status, compatibility evidence, migration, rollback, and release channel.
- Output effect: classify by actual impact, separate version from status, and
  reject unsupported compatibility or promotion claims.
- Constraints: no implicit release, promotion, deprecation, or retirement.
- Dependencies: `evidence`.
- Known limitation: concrete SemVer mappings come from the narrower repository
  contract.

## Execution and Safety

- Mode: read-only policy constraint; it grants no publishing or mutation
  authority.
- External systems, side effects, destructive actions, and approvals: none from
  the policy itself.
- Verification: inspect applicable contracts, consumers, evidence, migration,
  rollback, and communication requirements.

## Progressive Disclosure

- Installed source: impact, version/status, evidence, and migration boundaries.
- Detailed repository SemVer and lifecycle rules remain conditional governance.
- Runtime references, scripts, templates, assets, and policy-owned tools: none.

## Evidence and Evaluation

- Evidence today: six matched pairs pass with 100% capability objective success
  and 0.20% unrelated overhead. Zero tool calls were recorded; correction turns
  were not measured. The policy refused an
  unsupported compatibility classification that the baseline made, producing
  an initial 33.3-point objective gain.
- No-capability baseline: matched versioning/lifecycle tasks without this policy.
- Planned positive coverage: primary impact classification, contract boundary,
  and ambiguous promotion or deprecation request.
- Planned negative coverage: non-interference, private-change boundary, and an
  unrelated task.
- Metrics and gate: classification accuracy, unsupported-claim refusal, blinded
  actionability, tokens, corrections, and the Phase 1 quality floor.
- Promotion: only after fresh representative pairs demonstrate value.

## Budgets, Compatibility, and Decision

- Always-loaded context: at most 90 estimated tokens; no conditional context or
  policy-owned tool calls.
- Bootstrap compatibility: `0.1.0-dev.0` in controlled complete-pack tests.
- Host behavior tested only on Codex CLI 0.146.0; broader compatibility unknown.
- Alternatives: duplicate release rules in every workflow, rejected as
  divergence; do nothing remains the evaluation baseline.
- Decision: retain as experimental for controlled field testing. The objective gain is promising; the apparent 40.4%
  aggregate token reduction wins only one of three applicable pairs and blinded
  review remains unresolved.

## Documentation Impact

Update the catalog, roadmap, evaluation guide, and lifecycle evidence when cases
or status change.
