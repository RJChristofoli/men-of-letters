# men-of-letters

A governed, versioned engineering capability platform for Codex.

## What it does

Packages compact policies, task routers, engineering workflows, references, and deterministic resources that improve software delivery without loading every instruction into every conversation.

## How it works

- Selected policies provide small always-on constraints.
- Skills activate explicitly or when task intent matches a narrow description.
- Routers load only the workflow and references required by the task.
- Evaluations compare quality, token usage, latency, and false triggers against a no-skill baseline.

## What it helps with

The planned capabilities support engineering discovery, backend and security review, testing, safe refactoring, architecture decisions, documentation, and measurable optimization of code, runtime, databases, pipelines, and engineering flow.

## Status

Phase 0 foundation and the Phase 1 experimental field candidate are complete.
All seven core policies and `engineering-discovery` are installable at
`experimental` status. Deterministic validation, 37 matched comparisons,
complete-pack lifecycle tests, the evaluation harness, and safe bootstrap CLI
support controlled dogfooding. Field evidence and blinded review are still
required before any capability reaches `validated`; no stable or public release
is available.

## Installation

There is no stable installation. For development and controlled field testing:

```bash
git clone https://github.com/RJChristofoli/men-of-letters.git
cd men-of-letters
npm ci
npm run validate
npm test
npm run cli -- list
```

Preview the experimental discovery pack without changing the target repository:

```bash
npm run cli -- install engineering-discovery \
  --scope repo \
  --target /absolute/path/to/target-repository \
  --dry-run
```

See the capability and bootstrap guides before installation. Experimental packs
are for controlled, reversible field evaluation.

## Continue development

Start experimental field testing with:

```text
Read ROADMAP.md and docs/capabilities.md. Install the Phase 1 experimental candidate in a reversible repository scope, record every useful or harmful outcome, and preserve evidence by capability and version.
```

Treat [ROADMAP.md](ROADMAP.md) as the source of truth before changing capabilities.

## Documentation

- [Roadmap and current next action](ROADMAP.md)
- [Capabilities, installation, and invocation](docs/capabilities.md)
- [Governance contracts and capability specification](docs/governance/README.md)
- [Distribution architecture](docs/architecture/distribution-boundaries.md)
- [Bootstrap CLI](docs/bootstrap-cli.md)
- [Evaluation harness and current evidence](docs/evaluation.md)
- [Implementation workflow and skill usage](docs/implementation-workflow.md)
