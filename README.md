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

Phase 0 foundation is implemented and validated at an experimental level. Phase
1 has experimental `evidence`, `safe-change`, and native `token-efficiency`
policies with initial controlled comparisons; the catalog, schemas, evaluation
harness, bootstrap CLI, and first proposed plugin slice also exist. No stable
capability or public release is available yet.

## Installation

There is no supported stable installation yet. For local development:

```bash
git clone https://github.com/RJChristofoli/men-of-letters.git
cd men-of-letters
npm ci
npm run validate
npm test
npm run cli -- list
```

Preview the proposed discovery pack without changing the repository:

```bash
npm run cli -- install engineering-discovery --scope repo --allow-proposed --dry-run
```

See the bootstrap guide before installing or activating policies. Proposed-pack
installation is for evaluation only.

## Continue development

Start a new thread in this repository with:

```text
Read ROADMAP.md and the repository, determine the current state, and continue Phase 1 from the current Next Action. Keep the roadmap and affected documentation synchronized with validated decisions.
```

The next thread must treat [ROADMAP.md](ROADMAP.md) as the source of truth and read the linked documentation before changing direction.

## Documentation

- [Roadmap and current next action](ROADMAP.md)
- [Governance contracts and capability specification](docs/governance/README.md)
- [Distribution architecture](docs/architecture/distribution-boundaries.md)
- [Bootstrap CLI](docs/bootstrap-cli.md)
- [Evaluation harness and current evidence](docs/evaluation.md)
- [Implementation workflow and skill usage](docs/implementation-workflow.md)
