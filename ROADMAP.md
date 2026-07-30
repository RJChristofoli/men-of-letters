# Men of Letters Roadmap

## Purpose

Build a versioned GitHub repository of reusable agent skills that improves engineering quality, reduces token usage, and avoids duplicated or conflicting instructions.

This document is the source of truth for priorities, validated decisions, progress, and next actions.

## New Thread Continuation Contract

When a new thread is asked to read this roadmap and continue development:

1. Read `README.md`, this entire roadmap, and the documents linked by the README.
2. Inspect the repository state and all applicable repository instructions before changing files.
3. Treat checked design decisions as approved, but do not treat unimplemented or unevaluated capabilities as validated.
4. Execute the current `Next Action`, starting with the earliest unchecked Phase -1 item. Do not jump to skill implementation before its governance contracts exist.
5. Keep artifacts in English and keep conversation language aligned with the user's language.
6. Do not modify `AGENTS.md` unless the user explicitly requests it.
7. Validate each artifact in proportion to risk and apply the documentation maintenance rule in the same work session.

The repository must be sufficient for continuation without access to the chat that created it. If repository evidence conflicts with this roadmap, record the conflict before changing direction.

## Maintenance Rule

Whenever an item is validated, update this document in the same work session:

1. Update its status.
2. Record the evidence or evaluation result.
3. Add any resulting decision to the decision log.
4. Define the next action.

Do not mark recommendations as validated without evidence.

## Documentation Maintenance Rule

Documentation is part of the definition of done for every phase. Update only the artifacts affected by a validated decision, implementation, or release; do not create documentation churn for unchanged behavior.

At each phase checkpoint:

1. Update `ROADMAP.md` with status, evidence, decisions, and the next action.
2. Update `catalog.yaml` when capability status, dependencies, compatibility, ownership, or installation packs change.
3. Update `README.md` when repository purpose, public behavior, available capabilities, or installation changes.
4. Update affected usage, implementation, installer, architecture, and evaluation documents.
5. Verify documented commands and examples against the current repository state.
6. Record released user-visible changes in release notes or a changelog when those artifacts exist.

A phase is not complete while its affected documentation is stale.

## Goals

- Reduce total tokens per completed task, not only tokens per response.
- Improve correctness, security, maintainability, and production readiness.
- Improve algorithms, code, runtime behavior, delivery pipelines, engineering flow, architecture, and technology choices through measurable optimization.
- Minimize always-loaded context.
- Use progressive disclosure: small skill metadata, concise `SKILL.md`, conditional references, and deterministic scripts where useful.
- Version skills and test them against repeatable evaluations.
- Keep specialized capabilities installable without forcing every skill into every session.

## Architecture Decision

Build a governed engineering capability platform rather than a flat catalog of skills.

### Capability layers

| Layer | Responsibility | Initial components |
| --- | --- | --- |
| Policies | Apply compact cross-cutting constraints | `engineering-principles`, `evidence`, `backend-defaults`, `documentation`, `token-efficiency`, `versioning-and-lifecycle`, `safe-change` |
| Routers | Select the relevant path and load only required context | `engineering-discovery`, `backend-review`, `optimize-engineering` |
| Workflows | Execute operations with defined inputs, outputs, side effects, and validation | `security-review`, `test-change`, `refactor-safely`, `generate-adr`, `generate-docs` |
| References | Supply conditional specialist knowledge | Architecture, API, database, performance, observability, Kafka, runtime, pipeline, and technology evaluation |
| Resources | Provide deterministic or reusable implementation material | Scripts, templates, assets, schemas, benchmarks, checklists, and fixtures |

Policies are not skills. They require a selective installation or activation mechanism because files stored under `policies/` are not automatically enforced by Codex.

Keep the initial router set limited to three. A router selects paths; it must not absorb independent workflows.

Start specialist capabilities as references. Promote a reference to an independent skill only when it has a distinct trigger, workflow, tooling, output, evaluation suite, and demonstrated recurring demand.

### Operating flow

```text
Policies + Evidence
        ↓
Engineering Discovery
        ↓
Decision / Optional ADR
        ↓
Implementation
        ↓
Testing / Safe Refactoring
        ↓
Backend or Security Review
        ↓
Engineering Optimization
        ↓
Evaluation and Regression
```

Use only the stages required by the task.

## Roadmap

### Phase -1 — Governance and Engineering Principles

- [x] Approve separation between policies, routers, workflows, references, and resources.
- [x] Approve evidence as a repository-wide principle.
- [x] Approve lifecycle states: `proposed`, `experimental`, `validated`, `stable`, `deprecated`, and `retired`.
- [x] Approve plugins as the primary distribution mechanism and a separate bootstrap installer for policies and local development.
- [x] Approve documentation maintenance as part of every phase's definition of done.
- [x] Define naming and repository conventions.
- [x] Define the Skill Design Guide and specification template.
- [x] Define policy precedence and conflict handling.
- [x] Define installation scopes, pack dependencies, collision handling, and policy-managed block conventions.
- [x] Define ownership and decision process.
- [x] Define versioning, release, compatibility, and deprecation rules.
- [x] Define safe-change and execution-contract requirements.

Phase -1 evidence (2026-07-30): the accepted contracts are indexed in
[`docs/governance/README.md`](docs/governance/README.md), with the authoring
template at [`templates/capability-spec.md`](templates/capability-spec.md).
Repository inspection confirmed that no implementation or release artifacts yet
exist, so this checkpoint validates governance completeness and internal
consistency only—not installer, capability, or evaluation effectiveness. All 13
current Markdown files passed local-link, trailing-whitespace, and final-newline
checks, and the tracked diff passed Git's whitespace validation.

### Phase 0 — Platform Foundation

- [x] Choose `men-of-letters` as the repository, product, plugin, and future CLI name.
- [x] Confirm repository visibility, license, and publishing model.
- [x] Verify licensing and provenance before copying or adapting third-party skills.
- [x] Define plugin, bootstrap installer, and installation-pack boundaries.
- [x] Create repository structure, `catalog.yaml`, and validation workflow.
- [x] Define selective policy installation and activation.
- [x] Create the evaluation harness and baseline without custom skills.
- [x] Capture token usage, completion rate, correction turns, latency, false triggers, and context overhead.
- [x] Add automated validation for metadata, structure, dependencies, and policy budgets.
- [x] Implement a minimal bootstrap CLI with `list`, `install`, `uninstall`, and `doctor` commands.
- [x] Add dry-run, idempotency, conflict detection, dependency checks, backups, and explicit confirmation before modifying persistent instruction files.
- [x] Package the first versioned installation packs as plugins while keeping policy activation and local development in the bootstrap installer.
- [x] Validate installation, update, removal, rollback, skill discovery, and policy activation in a clean environment.

Phase 0 evidence (2026-07-30): GitHub reported a public repository with `main`
as the default branch. Apache-2.0, GitHub Releases, and provenance gates are
documented; `catalog.yaml`, six pack manifests, seven schemas, CI validation, an
evaluation harness, an experimental bootstrap CLI, and the proposed
`engineering-discovery` plugin slice are implemented. Repository validation
passes for 16 capabilities, six packs, two cases, two accepted baselines, two
capability results, and zero third-party records. The bootstrap clean-environment
suite passes 14/14 cases across repository/user scopes, dry-run, copy/link,
idempotency, update, doctor, collision protection, policy activation, removal,
and forced rollback. The plugin validator, skill validator, and generated
development archive contents also pass inspection.

The discovery comparison passed objective task checks but regressed from 18,473
to 55,489 total tokens and from 46,596 ms to 60,841 ms without a material quality
gain. It remains `proposed`; Phase 0 platform completion does not validate that
capability or authorize a public release.

### Phase 1 — Core Policies and Discovery

- [ ] Create the compact core policy set.
- [ ] Version the existing token-efficiency setup instead of duplicating Caveman and RTK.
- [x] Create `engineering-discovery` for feature design, technology research, architecture proposals, and trade-off analysis.
- [ ] Create a discovery-brief template and optional ADR handoff.
- [x] Forward-test discovery against the no-skill baseline.

### Phase 2 — Review and Optimization

- [ ] Create `backend-review` as the central review router.
- [ ] Create risk-triggered `security-review` as an independent workflow.
- [x] Define and approve the scope and validation contract for `optimize-engineering`.
- [ ] Create `optimize-engineering` as an on-demand optimization router.
- [ ] Add architecture, API, database, performance, observability, runtime, pipeline, and technology-evaluation references.
- [ ] Forward-test review and optimization on representative backend tasks.

### Phase 3 — Engineering Workflows

- [ ] Create `test-change` for focused test selection, implementation, and verification.
- [ ] Create `refactor-safely`.
- [ ] Create `generate-adr` with a reusable template.
- [ ] Create `generate-docs` with scoped templates and freshness checks.
- [ ] Create Kafka-specific capability only after recurring demand is demonstrated.
- [ ] Reassess prompt compression only if Caveman and `caveman-compress` leave a measurable gap.

### Phase 4 — Evaluation, Regression, and Lifecycle

- [ ] Run benchmark and regression suites across all packs.
- [ ] Compare task success, token usage, latency, correction turns, false triggers, and context overhead.
- [ ] Run blinded human-preference comparisons for subjective outputs.
- [ ] Detect skill conflicts and policy-precedence failures.
- [ ] Promote, revise, deprecate, or retire capabilities using recorded evidence.
- [ ] Create cost-optimization capability only when real cost data and evaluation cases exist.

Evaluation starts in Phase 0 and gates every phase. Phase 4 evaluates the complete ecosystem and manages lifecycle decisions.

## Engineering Discovery Track

Use `engineering-discovery` before implementation when no accepted solution exists.

### Modes

- Feature design.
- Technology research.
- Architecture proposal.
- Alternative comparison.
- Trade-off analysis.
- Feasibility discovery.
- Proof-of-concept planning.

### Required output

- Goal and need.
- Current state.
- Constraints and assumptions.
- Alternatives, including doing nothing when relevant.
- Evidence and confidence.
- Trade-offs and contraindications.
- Recommendation.
- Expected gain without fabricated precision.
- Validation experiment.
- Risks, reversibility, and optional ADR handoff.

Discovery produces a decision proposal, not implementation, unless the user explicitly expands the task.

## Engineering Optimization Track

### Core principle

Do not claim an optimization without a target, metric, baseline, observed bottleneck, measured result, and rollback criterion. Treat unmeasured changes as hypotheses, cleanup, or refactoring.

Full optimization must remain on-demand. The future `backend-defaults` policy may include only a lightweight rule to avoid obvious waste and reject evidence-free optimization.

### Modes

- **Optimize:** improve a measurable property such as latency, throughput, CPU, memory, cost, pipeline duration, or delivery time.
- **Simplify:** reduce duplication, dead code, accidental complexity, coupling, or maintenance burden while preserving behavior.

Do not assume cleaner code is faster or faster code is easier to maintain. Record trade-offs explicitly.

### Scope and metrics

| Area | Typical work | Evidence |
| --- | --- | --- |
| Algorithms | Complexity, data structures, loops, concurrency | Big O, execution time, allocations |
| Code | Duplication, dead code, complexity, readability | Complexity, size, duplication, tests |
| Runtime | CPU, memory, I/O, latency, throughput | p95/p99, CPU, RAM, requests per second |
| Data | Queries, indexes, locks, transactions | Query time, scans, lock time, contention |
| Pipeline | Build, tests, caching, parallelism, deployment | Duration, cache hit rate, failures, retries |
| Engineering flow | Handoffs, rework, slow feedback | Lead time, cycle time, correction count |
| Architecture | Dependencies, coupling, communication paths | Reliability, latency, failure rate, cost |
| Technology | Libraries, frameworks, infrastructure | Total cost, risk, support, migration effort |
| Agent operations | Context, commands, skill loading, responses | Tokens per task, turns, latency, false triggers |

### Required workflow

1. Preserve expected behavior and define constraints.
2. Select the optimization target and metric.
3. Capture a reproducible baseline.
4. Locate the observed bottleneck.
5. Compare options by impact, effort, and risk.
6. Apply the smallest sufficient change.
7. Run tests and relevant benchmarks.
8. Compare before and after results.
9. Keep only a proven improvement or clearly justified simplification.
10. Record limitations, trade-offs, evidence, and rollback path.

### Planned progressive-disclosure structure

```text
optimize-engineering/
├── SKILL.md
└── references/
    ├── measurement.md
    ├── algorithms-and-code.md
    ├── runtime-and-data.md
    ├── pipelines.md
    ├── delivery-flow.md
    └── architecture-and-technology.md
```

Reuse planned review modules instead of duplicating them: `performance-review` identifies bottlenecks, database review detects data risks, `refactor-safely` preserves behavior, and `backend-review` evaluates the resulting change.

### Implementation order

1. Algorithms and code simplification.
2. CI and delivery pipeline optimization.
3. Runtime and database optimization.
4. Architecture and technology optimization.
5. Engineering-flow optimization.
6. Cost optimization after real cost data exists.

## Repository Contracts

### Skill Design Guide

Detailed contract: [`docs/governance/skill-design-guide.md`](docs/governance/skill-design-guide.md).
Authoring template: [`templates/capability-spec.md`](templates/capability-spec.md).

Every proposed skill must define:

- Problem, goal, scope, and non-goals.
- Positive and negative triggers.
- Inputs, outputs, and constraints.
- References, scripts, templates, and assets.
- Side effects and required approvals.
- Validation, metrics, and evaluation suite.
- Known limitations and dependencies.
- Lifecycle status and owner.
- Token, time, and tool-call budgets.
- Stop conditions and rollback behavior.

Keep official `SKILL.md` frontmatter limited to `name` and `description`. Store version, ownership, lifecycle, compatibility, dependencies, and evaluation metadata in the repository catalog, plugin manifests, and Git releases.

### Execution contract

Detailed contract: [`docs/governance/safe-change.md`](docs/governance/safe-change.md).

Every workflow must declare whether it is read-only or mutating, affected files or systems, approvals, side effects, idempotency, rollback, and stop conditions. Destructive or irreversible actions require explicit confirmation.

### Documentation contract

Checkpoint checklist: [`docs/governance/documentation-checklist.md`](docs/governance/documentation-checklist.md).

Keep the repository `README.md` simple and brief. It must explain:

- What the repository does.
- How it works at a high level.
- What problems and workflows it helps with.
- How to install and start using it.

Keep detailed architecture, governance, evaluation, workflow, and troubleshooting material in focused documents linked from the README. Do not turn the README into an internal design history.

For every phase, identify the affected documentation before implementation and verify it at the phase checkpoint. Documentation-only completion is insufficient: examples and commands must match validated behavior.

### Evidence contract

Classify important claims as:

- **Measured:** benchmark or telemetry.
- **Observed:** code, logs, or reproduced behavior.
- **Documented:** official documentation or another reliable source.
- **Inferred:** technical conclusion not yet measured.
- **Assumed:** explicit hypothesis.

Recommendations must explain why, alternatives, trade-offs, when not to use the choice, expected gain, validation plan, migration cost, rollback, and confidence. Never fabricate expected gains.

### Context budgets

Initial targets:

- Keep selected always-on policies within approximately 800 tokens total.
- Keep descriptions short and trigger-specific.
- Target fewer than 200 lines per `SKILL.md`; never exceed 500 lines.
- Keep references one level deep and load them conditionally.
- Avoid duplicating content between `SKILL.md` and references.
- Scale evidence detail to decision risk.
- Measure tokens per completed task rather than per response.

### Catalog, lifecycle, and versioning

Detailed contract: [`docs/governance/versioning-and-lifecycle.md`](docs/governance/versioning-and-lifecycle.md).

Create `catalog.yaml` with capability ID, type, status, owner, dependencies, compatibility, evaluation suite, installation pack, and introduced or deprecated release.

Use lifecycle states:

```text
proposed → experimental → validated → stable → deprecated → retired
```

Use SemVer by installation pack or plugin initially. Do not add per-skill versions until independently released skill lifecycles justify the overhead.

### Packaging

Repository conventions are defined in
[`docs/governance/repository-conventions.md`](docs/governance/repository-conventions.md),
and installation ownership and collision behavior are defined in
[`docs/governance/installation-contract.md`](docs/governance/installation-contract.md).

Prefer modular installation packs:

- `core-policies`
- `backend-quality`
- `engineering-discovery`
- `engineering-optimization`
- `documentation-workflows`
- `specialist-reviews`

Install only relevant packs to reduce metadata, context overhead, and conflicts.

## Distribution and Installation Track

Treat authoring, local activation, policy installation, and reusable distribution as separate concerns.

| Concern | Mechanism |
| --- | --- |
| Repository authoring | Versioned source, catalog, validation, and local links where useful |
| Repository-scoped skills | `.agents/skills` under the target repository |
| User-scoped skills | `$HOME/.agents/skills` |
| Reusable distribution | Versioned plugins and modular installation packs |
| Always-on policies | Bootstrap installer with selective, managed persistent-instruction changes |
| Maintenance | Installer manifest, diagnostics, updates, rollback, and clean removal |

The bootstrap installer is infrastructure, not a skill. It complements official plugin distribution by handling policy activation and local development workflows that standalone skill or plugin installation does not enforce automatically.

Policy resolution follows
[`docs/governance/policy-precedence.md`](docs/governance/policy-precedence.md).
Ownership and changes to these contracts follow
[`docs/governance/ownership-and-decisions.md`](docs/governance/ownership-and-decisions.md).

### Initial bootstrap CLI

```text
men-of-letters list
men-of-letters install <pack> --scope user|repo
men-of-letters uninstall <pack> --scope user|repo
men-of-letters doctor
```

The first version must:

- Support `--dry-run` for mutating operations.
- Be idempotent and detect collisions before writing.
- Resolve pack dependencies and verify compatible versions.
- Record installed files and managed policy blocks in a manifest.
- Back up persistent instruction files before changing them.
- Require explicit confirmation before modifying `AGENTS.md` or equivalent persistent instructions.
- Remove only installer-owned content and preserve manual user content.
- Provide a rollback path for failed installs and updates.
- Verify that installed skills are discoverable in the selected scope.

Use links for local authoring when appropriate and immutable copied or packaged artifacts for released versions. Do not implement the installer before repository conventions, the catalog contract, policy precedence, and installation-pack boundaries are defined.

## Capability Classification Decisions

| Original idea | Final treatment |
| --- | --- |
| Documentation Language | Compact policy |
| Production Ready Mindset | Merge into `backend-defaults` policy |
| Token Optimization | Version current RTK and Caveman setup |
| Naming Consistency | Merge into `backend-defaults` policy |
| Clean Architecture Guard | Merge non-dogmatic boundary rules into `backend-defaults` |
| Code Reviewer | Route through `backend-review` |
| Senior Backend Review | Merge into `backend-review` |
| Architecture Reviewer | Conditional reference under `backend-review` |
| Performance Review | Conditional reference initially |
| Security Review | Independent risk-triggered workflow |
| Database Review | Conditional reference initially |
| API Review | Conditional reference initially |
| Observability | Conditional reference initially |
| Testing | Independent `test-change` workflow |
| Refactor | Independent `refactor-safely` workflow |
| ADR Generator | Independent template-driven workflow |
| Documentation Generator | Independent scoped workflow |
| Engineering Discovery | Router for pre-implementation decisions |
| Engineering Optimization | On-demand router with conditional references |
| Algorithm Improvement | `optimize-engineering` mode with benchmarks and complexity evidence |
| Code Cleanup | `simplify` mode integrated with `refactor-safely` |
| Pipeline and Flow Optimization | Conditional `optimize-engineering` references |
| Kafka Review | Defer until recurring demand |
| Cost Optimization | Defer until measurable cost data exists |
| Prompt Compression | Defer due to overlap with Caveman tooling |

## Evaluation Criteria

Compare every capability with a baseline that does not use it.

Measure:

- Task success and technical correctness.
- Tests, lint, benchmarks, or other objective verification.
- Input, output, and total tokens per completed task.
- Total turns and correction cycles.
- Trigger precision and false-positive rate.
- Context loaded for unrelated tasks.
- Latency and tool-call overhead.
- Clarity, actionability, and safety.
- Policy conflicts and unintended side effects.
- Blinded human preference when outputs are subjective.

Protect evaluation integrity:

- Keep evaluation cases separate from skill examples.
- Use hidden or fresh cases when practical.
- Pass raw artifacts rather than expected answers during forward-tests.
- Test both positive and negative triggers.
- Avoid exposing secrets or personal data through telemetry.

Adopt or promote a capability only when it provides measurable quality or efficiency improvement without unacceptable regressions. Revise, deprecate, or retire capabilities that fail this gate.

For optimization work, require reproducible before-and-after measurements. If measurement is impractical, document the change as a hypothesis or simplification instead of a validated optimization.

## Decision Log

### 2026-07-30 — Initial direction confirmed

- Use a small always-on layer rather than eight independent always-on skills.
- Prefer one backend review router with conditionally loaded specialist references.
- Avoid recreating functionality already supplied by Caveman, `caveman-compress`, and RTK.
- Build evaluation and versioning foundations before expanding the catalog.
- Keep this roadmap updated whenever validation changes status or direction.

### 2026-07-30 — Engineering optimization track approved

- Initially place `optimize-engineering` in Phase 1 as an on-demand router. This
  phase placement was superseded by the later governed-capability-platform
  decision and the current roadmap places implementation in Phase 2.
- Cover algorithms, code cleanup, runtime, data, pipelines, engineering flow, architecture, technology, and agent operations.
- Separate measurable optimization from maintainability-focused simplification.
- Require baseline, evidence, before-and-after comparison, and rollback criteria.
- Reuse existing review and refactoring plans instead of duplicating their guidance.
- Design approved; skill implementation and effectiveness are not yet validated.

### 2026-07-30 — Governed capability platform approved

- Separate policies, routers, workflows, references, and resources.
- Keep policies compact and selectively installed rather than treating them as skills.
- Limit the initial router set to `engineering-discovery`, `backend-review`, and `optimize-engineering`.
- Keep security review, testing, refactoring, ADR generation, and documentation generation as independent workflows.
- Add discovery before implementation and evidence as a cross-cutting contract.
- Add Phase -1 governance and Phase 4 ecosystem evaluation while keeping evaluation continuous from Phase 0.
- Add the Skill Design Guide, capability catalog, execution contracts, context budgets, lifecycle, modular packaging, and evaluation-integrity requirements.
- Use SemVer by pack or plugin initially; keep version fields outside official skill frontmatter.
- Architecture approved; implementation and effectiveness are not yet validated.

### 2026-07-30 — Distribution and installation model approved

- Use plugins as the primary mechanism for distributing versioned skills and installation packs.
- Build a separate bootstrap installer for selective policy activation and local development workflows.
- Treat the installer as platform infrastructure rather than an agent skill.
- Support user and repository scopes without installing every capability globally.
- Start with `list`, `install`, `uninstall`, and `doctor`, with dry-run, idempotency, collision checks, backups, explicit approval for persistent-instruction changes, and clean removal.
- Implement the installer incrementally in Phase 0 after its catalog, policy, scope, and packaging contracts are defined.
- Design approved; installer implementation and clean-environment validation are not yet complete.

### 2026-07-30 — Documentation definition of done approved

- Treat affected documentation as part of every phase's completion criteria.
- Keep `ROADMAP.md`, `catalog.yaml`, affected guides, and release documentation synchronized with validated changes.
- Update the README when repository purpose, public behavior, available capabilities, or installation changes.
- Keep the README brief and limited to what the repository does, how it works, what it helps with, and how to install and start using it.
- Verify documented commands and examples before completing a phase.
- Policy approved; current repository documentation still requires phase-by-phase verification.

### 2026-07-30 — Repository-local handoff established

- Move `ROADMAP.md` into the `men-of-letters` repository as the single source of truth.
- Make the README the brief entry point for purpose, operation, benefits, installation status, and development continuation.
- Require a new thread to read repository-local documentation and execute the roadmap's `Next Action` without relying on prior chat history.
- Keep Phase -1 as the next implementation boundary; do not scaffold all skills before its contracts are complete.
- Handoff documentation organized; Phase -1 artifacts remain unimplemented.

### 2026-07-30 — Men of Letters identity approved

- Use `men-of-letters` for the repository, product, plugin, and future CLI.
- Keep individual skill IDs functional and trigger-oriented instead of thematic.
- Rename the local repository folder and GitHub remote to match the approved identity.
- Brand approved and applied; plugin and CLI implementation remain planned work.

### 2026-07-30 — Phase -1 governance contracts accepted

- Use stable functional `kebab-case` IDs and keep each skill's canonical source
  under its owning skill-bearing plugin; keep policies as separate canonical
  sources for selective activation.
- Limit official `SKILL.md` frontmatter to `name` and `description`; require a
  capability specification, progressive disclosure, execution contract,
  baseline, positive and negative evaluation cases, budgets, owner, and pack.
- Resolve host authority first, narrower same-authority scope second, and Men of
  Letters policy priority last; fail closed on unresolved required conflicts.
- Separate repository, user, released-plugin, and local-development scopes. Use
  checksummed installer-owned blocks and refuse unmanaged or modified
  collisions.
- Use accountable capability, pack, platform, and governance ownership with
  recorded review for contract, cross-pack, breaking, and emergency decisions.
- Apply SemVer per independently installable pack/plugin and independently to
  the bootstrap CLI; keep lifecycle status separate from version and require
  evidence gates for promotion.
- Require exact scope, authority, side effects, validation, rollback, and stop
  conditions for workflows and mutations. Treat documentation synchronization
  as a checked phase artifact without equating documentation with validation.
- Contracts accepted and structurally documented; automated enforcement and
  effectiveness remain Phase 0 and later work.

### 2026-07-30 — Phase 0 experimental foundation completed

- Confirm the canonical repository is public with `main` as its default branch;
  license original work under Apache-2.0 and use gated GitHub Releases as the
  initial publishing model.
- Require structured provenance review before bundling or adapting third-party
  material. The initial inventory contains no third-party content.
- Define six modular packs and keep plugin distribution, policy activation,
  bootstrap state, local development, and evaluation as separate boundaries.
- Establish a catalog, pack/provenance/plugin/evaluation/state schemas, semantic
  validation, Node 18/20/22 CI, and accountable ownership through `CODEOWNERS`.
- Capture two no-capability baselines and two capability comparisons. The
  accepted-design negative case produced no response-level false trigger and 92
  additional total tokens with the skill installed.
- Keep `engineering-discovery` proposed: its positive case increased total tokens
  from 18,473 to 55,489 and latency from 46,596 ms to 60,841 ms without a
  material reviewed quality gain; its conditional reference also hit the host
  read-only sandbox failure.
- Implement the experimental bootstrap `list`, `install`, `uninstall`, and
  `doctor` commands with explicit scopes, dry-run, dependency and collision
  checks, checksummed ownership, policy confirmation/backups, idempotency,
  copied/local-link installs, update, removal, and rollback.
- Validate 14/14 clean-environment bootstrap cases and package the proposed
  discovery plugin into a development archive containing its license,
  provenance, and release-file checksums.
- Phase 0 foundation validated at experimental scope; no stable capability,
  marketplace package, registry package, or public release is implied.

## Known Issues and Open Questions

- RTK exists at `$HOME/.headroom/bin/rtk` but is absent from the current shell's
  `PATH`; commands work through the absolute path. Installation/discovery is not
  yet validated for a clean environment.
- No stable or public artifact has been published. Marketplace/registry flows,
  signatures, attestations, Windows behavior, and a broader clean-host matrix
  remain unvalidated.
- `engineering-discovery` remains proposed because its positive comparison
  regressed token usage and latency; the host read-only sandbox also prevented
  its conditional reference from loading in that run.
- One negative case records zero observed response-level false triggers, but it
  does not establish a false-positive rate or broad implicit-trigger precision.
- Core policy sources are not implemented. Policy activation is validated only
  through clean fixture policies and cannot yet install `core-policies`.
- The provenance inventory is empty; every future third-party addition still
  requires license, immutable source, attribution, and reviewer evidence.

## Next Action

Begin Phase 1 with the compact `evidence` and `safe-change` policy sources and
their positive, negative, precedence, context-budget, activation, update, and
removal evaluations. Then integrate the existing RTK and Caveman setup by
reference and provenance rather than duplication. In parallel with that policy
work, add the discovery-brief/ADR handoff template and revise
`engineering-discovery` to reduce positive-case context cost and avoid the
read-only reference-loading failure; do not promote it until fresh comparisons
show a material benefit without trigger regressions.
