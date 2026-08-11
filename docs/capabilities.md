# Capability Guide

This guide is the practical inventory for Men of Letters. It distinguishes the
eight installable Phase 1 capabilities from the eight capabilities that exist
only as planned catalog entries. The catalog remains the machine-readable source
of truth for type, lifecycle status, dependencies, and installation pack.

## Read the Status Before Use

| Status in this guide | Meaning for a developer |
| --- | --- |
| `experimental` | Implemented, internally checked, reversible, and ready for controlled dogfooding. It is not yet proven to improve real development work. |
| `proposed` | Planned contract only. There is no installable source and invoking its name does not activate a Men of Letters workflow. |

Phase 1 is an **experimental field candidate**, not a supported stable release.
Use it on work you can review and roll back. Record both useful and harmful
outcomes; field evidence is what will justify later promotion, revision, or
removal.

## Install the Phase 1 Candidate

Phase 1 consists of seven always-on policies in `core-policies` and the
on-demand `engineering-discovery` skill. Install both to evaluate the complete
candidate.

### Prerequisites

- Node.js 18.19 or newer.
- A local clone of this repository.
- A repository with an `AGENTS.md` instruction file, or permission to create it.
- A reviewable branch or other reversible workspace for the first field runs.

Validate the candidate before installing it:

```bash
npm ci
npm run validate
npm test
npm run cli -- list
```

### Safer first install: one repository

Run these commands from the Men of Letters clone. Replace the instruction path
with the absolute path of the target repository's `AGENTS.md`.

Preview every write first:

```bash
npm run cli -- install core-policies \
  --scope repo \
  --target /absolute/path/to/target-repository \
  --instructions /absolute/path/to/target-repository/AGENTS.md \
  --dry-run

npm run cli -- install engineering-discovery \
  --scope repo \
  --target /absolute/path/to/target-repository \
  --dry-run
```

If the preview targets only the intended repository, apply it:

```bash
npm run cli -- install core-policies \
  --scope repo \
  --target /absolute/path/to/target-repository \
  --instructions /absolute/path/to/target-repository/AGENTS.md \
  --yes

npm run cli -- install engineering-discovery \
  --scope repo \
  --target /absolute/path/to/target-repository
```

Check installer ownership and checksums:

```bash
npm run cli -- doctor \
  --scope repo \
  --target /absolute/path/to/target-repository
```


### User scope

Use `--scope user` only after repository-scoped dogfooding succeeds and you want
the candidate across repositories. The durable instruction filename is
host-dependent: replace the placeholder below with the absolute user-level file
that your Codex setup actually loads. Preview both packs before applying them.

```bash
npm run cli -- install core-policies \
  --scope user \
  --instructions /absolute/path/to/user-instruction-file \
  --dry-run

npm run cli -- install engineering-discovery --scope user --dry-run
```

Apply and diagnose:

```bash
npm run cli -- install core-policies \
  --scope user \
  --instructions /absolute/path/to/user-instruction-file \
  --yes

npm run cli -- install engineering-discovery --scope user
npm run cli -- doctor --scope user
```

Re-running `install` performs a checksummed update. To remove the user-scoped
candidate, uninstall discovery first, then preview and confirm policy removal:

```bash
npm run cli -- uninstall engineering-discovery --scope user
npm run cli -- uninstall core-policies --scope user --dry-run
npm run cli -- uninstall core-policies --scope user --yes
```

User scope increases the blast radius. Keep repository-specific instructions
outside managed blocks and begin with work that is independently reviewable and
reversible.

### Remove or diagnose the candidate

The bootstrap keeps checksums, backups, and owned-artifact state. It refuses to
silently replace or remove modified managed content. Diagnose before removal:

```bash
npm run cli -- doctor \
  --scope repo \
  --target /absolute/path/to/target-repository

npm run cli -- uninstall engineering-discovery \
  --scope repo \
  --target /absolute/path/to/target-repository

npm run cli -- uninstall core-policies \
  --scope repo \
  --target /absolute/path/to/target-repository \
  --dry-run

npm run cli -- uninstall core-policies \
  --scope repo \
  --target /absolute/path/to/target-repository \
  --yes
```

Uninstall removes only content whose installer ownership and checksum can be
verified. Do not manually edit the managed policy block; put repository-specific
instructions outside it.

## How Activation Works

- **Policies** do not use `$capability-name`. Once `core-policies` is activated
  in the host instruction file, all seven constrain relevant work
  automatically.
- **Skills and routers** can be invoked explicitly with `$skill-name` in Codex
  CLI or the IDE extension. Codex may also select an installed skill when the
  request matches its description.
- Explicit invocation is the predictable choice for field evaluation because it
  makes it clear which capability was intended to run.
- Installing a pack name and invoking a capability name are different actions.
  Install `engineering-discovery`; invoke `$engineering-discovery`.

## Phase 1: Available Experimental Capabilities

### Quick Reference

| Capability | Type | Activation | Primary purpose |
| --- | --- | --- | --- |
| `engineering-principles` | Policy | Automatic | Choose the simplest compatible solution from the actual goal and constraints. |
| `evidence` | Policy | Automatic | Tie material claims and completion reports to inspected evidence. |
| `backend-defaults` | Policy | Automatic for backend work | Preserve contracts and data while covering common backend failure boundaries. |
| `documentation` | Policy | Automatic for documentation work | Keep affected documentation accurate, scoped, and honest about status. |
| `token-efficiency` | Policy | Automatic | Minimize unnecessary context, tools, turns, and repetition without weakening correctness. |
| `versioning-and-lifecycle` | Policy | Automatic for release/lifecycle work | Classify compatibility and require migration and rollback for lifecycle changes. |
| `safe-change` | Policy | Automatic for mutations | Keep changes authorized, scoped, reversible, and protective of unrelated work. |
| `engineering-discovery` | Router | `$engineering-discovery` or narrow implicit match | Compare unresolved design options and recommend a reversible validation experiment. |

### `engineering-principles`

- **What it does:** anchors work in the goal, current state, constraints, and
  accepted decisions; favors the smallest compatible solution and makes
  material trade-offs explicit.
- **Use it for:** analysis, implementation, and technical decisions where scope,
  compatibility, or solution complexity matters.
- **Do not use it as:** permission for speculative abstraction, unrelated
  cleanup, or overriding narrower repository contracts.
- **How to activate:** install `core-policies`; it is automatic and is not called
  with `$engineering-principles`.

### `evidence`

- **What it does:** separates measured, observed, documented, inferred, and
  assumed support; requires honest passed, failed, and skipped validation.
- **Use it for:** completion, safety, quality, compatibility, and performance
  claims.
- **Do not use it as:** a demand for citations on trivial prose or a substitute
  for running the check that can settle a claim.
- **How to activate:** install `core-policies`; it applies automatically.

### `backend-defaults`

- **What it does:** preserves public contracts and data; prompts validation and
  authorization at trust boundaries; covers failure handling, idempotency, and
  observability where external or asynchronous effects justify them.
- **Use it for:** APIs, workers, webhooks, persistence, integrations, queues, and
  other backend changes.
- **Do not use it for:** forcing layers, retries, idempotency, or observability
  onto a task with no demonstrated need; repository architecture takes
  precedence.
- **How to activate:** install `core-policies`; it applies automatically when the
  task is backend-related.

### `documentation`

- **What it does:** follows repository language and style, updates only docs
  affected by verified behavior, and keeps commands, links, examples, status,
  and compatibility accurate.
- **Use it for:** README, guides, operational procedures, reference material,
  and documentation accompanying a verified behavior change.
- **Do not use it for:** presenting a roadmap as implemented, using prose as
  proof, or generating documentation that has no owner or maintenance need.
- **How to activate:** install `core-policies`; it applies automatically to
  relevant documentation work.

### `token-efficiency`

- **What it does:** asks the agent to use the least context, tools, turns, and
  detail that still completes the task, and to batch independent work and reuse
  evidence.
- **Use it for:** routine engineering work where repeated narration or broad
  context loading would add cost without changing the result.
- **Do not use it for:** suppressing requested detail, required clarification,
  validation, evidence, correctness, or safety.
- **How to activate:** install `core-policies`; it applies automatically.

### `versioning-and-lifecycle`

- **What it does:** separates version from lifecycle status, classifies changes
  by compatibility impact, and requires evidence for promotion plus migration,
  rollback, consumer, and notice planning for breaking changes or retirement.
- **Use it for:** releases, deprecations, compatibility declarations, migrations,
  and capability promotion.
- **Do not use it for:** inventing compatibility evidence, treating
  `experimental` as stable, or assigning a version bump without considering
  consumers.
- **How to activate:** install `core-policies`; it applies automatically to
  release and lifecycle decisions.

### `safe-change`

- **What it does:** verifies mutation targets and ownership, preserves unrelated
  work, favors reversible operations, and stops when scope, preconditions, or
  rollback are unsafe.
- **Use it for:** file edits, repository mutations, installs, publishing,
  destructive operations, and external state changes.
- **Do not use it as:** blanket permission for destructive, privileged,
  irreversible, persistent, or out-of-scope actions. Those still require clear
  authority or confirmation.
- **How to activate:** install `core-policies`; it applies automatically to
  mutations.

### `engineering-discovery`

- **What it does:** stays read-only while defining the decision boundary,
  separating evidence from assumptions, comparing no change plus viable
  alternatives, recommending an option, and specifying a reversible test that
  can falsify the recommendation.
- **Use it for:** unresolved feature design, architecture, technology selection,
  feasibility, trade-offs, and proof-of-concept planning before implementation.
- **Do not use it for:** an accepted design, implementation, diff review, routine
  debugging, or optimization that already has a measurable target and baseline.
- **How to invoke:** `$engineering-discovery`. Narrow matching prompts may invoke
  it implicitly, but explicit use is preferred while collecting field evidence.

Example:

```text
$engineering-discovery

Goal: Add asynchronous order processing.
Constraints: PostgreSQL remains the source of truth; avoid a new managed service
without cost evidence.
Compare viable options and no change. Recommend the smallest reversible test.
Do not implement.
```

Expected output: decision boundary; evidence and unknowns; options;
recommendation; validation test; risks, rollback, and optional ADR handoff.

## Planned Capabilities: Not Yet Available

The following eight entries are useful design contracts, but their catalog
source is `null`. Their packs are not usable implementations. The invocation
shown below is the planned interface only; do not rely on it until the catalog
has a source and the capability reaches `experimental`.

| Capability | Type / status | Intended use | Do not use when | Planned invocation |
| --- | --- | --- | --- | --- |
| `implement-task` | Workflow / `proposed` | Explicit end-to-end intake, routing, implementation, validation, review, and completion reporting. | The user requested analysis or review only, or did not authorize implementation. | `$implement-task` |
| `backend-review` | Router / `proposed` | Review an existing backend diff for correctness, regressions, security boundaries, operations, and missing tests. | No implementation or diff exists, or the need is pre-implementation design. | `$backend-review` |
| `optimize-engineering` | Router / `proposed` | Improve a measurable property of code, runtime, database, capacity, pipeline, or engineering flow using before/after evidence. | There is no explicit optimization goal, target metric, or baseline. | `$optimize-engineering` |
| `security-review` | Workflow / `proposed` | Trace trust boundaries, authorization, input, secrets, sensitive data, failure behavior, and security tests. | A general quality review is sufficient and no security-sensitive boundary exists. | `$security-review` |
| `test-change` | Workflow / `proposed` | Select, design, implement, and verify focused tests for changed behavior and risk. | The task only needs existing tests to be run; loading a test-design workflow would add no value. | `$test-change` |
| `refactor-safely` | Workflow / `proposed` | Preserve observable behavior through characterization, small steps, focused verification, and reviewable rollback. | The requested outcome intentionally changes behavior or is primarily new feature implementation. | `$refactor-safely` |
| `generate-adr` | Workflow / `proposed` | Record a durable, cross-component, or costly-to-reverse architectural decision with context and consequences. | The decision is temporary, local, unresolved, or unlikely to be maintained. | `$generate-adr` |
| `generate-docs` | Workflow / `proposed` | Generate or update maintained documentation for verified public behavior, configuration, or operational procedures. | Behavior is unverified, no maintained artifact is affected, or the output would be disposable prose. | `$generate-docs` |

Examples such as `$implement-task` or `$backend-review` elsewhere in the
repository describe the future operating contract; they do not mean those
skills are currently discoverable.

## Field Evaluation for a Solo Developer

Start with one repository and real tasks you can independently verify. For each
task, record:

- target repository and task;
- Men of Letters commit and installed pack versions;
- model and reasoning configuration;
- whether `engineering-discovery` was explicitly invoked;
- tests or other objective checks and their results;
- manual corrections, extra prompts, elapsed time, and material token/cost data;
- whether the output was accepted, revised, or discarded;
- what helped, what interfered, and any false activation.

Include failures. A useful field claim compares accepted outcomes and effort,
not whether the response merely mentioned expected words. If a capability is
changed after a failure, retain the old result under a distinct case ID or in a
versioned field record, then rerun the new version. Do not silently rewrite
evidence.

Useful starting prompts:

```text
# Baseline task: let installed policies apply automatically
Implement the requested repository change. Preserve existing contracts and run
the relevant checks. Report passed, failed, and skipped validation.
```

```text
# Discovery task: activate the only Phase 1 skill explicitly
$engineering-discovery

We need to choose between <option/context>. Inspect the relevant repository
evidence, compare viable alternatives, and propose a reversible validation test.
Do not implement.
```

When possible, repeat an equivalent task without the candidate or temporarily
remove it using the CLI. Compare correctness, acceptance, interventions,
latency, and cost. A capability remains `experimental` until accumulated field
evidence justifies a stronger lifecycle claim.
