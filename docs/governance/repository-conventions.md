# Repository and Naming Conventions

Status: accepted Phase -1 contract.

This document defines the source layout and names used by Men of Letters. It
does not claim that the planned packaging or installer behavior is implemented.

## Naming

- Use lowercase ASCII `kebab-case` for capability, policy, pack, plugin, and
  evaluation-suite IDs.
- Give capabilities functional, intent-oriented IDs such as
  `engineering-discovery` or `test-change`. Do not use personas, seniority, or
  the Men of Letters theme in capability IDs.
- Treat an ID as a stable public identifier after its first release. A rename is
  a removal plus an addition and follows the deprecation rules.
- Match a skill directory to its capability ID and keep the entry point named
  `SKILL.md`.
- Use lowercase `kebab-case.md` for documentation, references, and templates.
  Keep conventional ecosystem filenames such as `README.md`, `AGENTS.md`, and
  `CHANGELOG.md` unchanged.
- Use `snake_case` for catalog and manifest field names. Use SemVer strings with
  no `v` prefix inside data files.
- Prefix generated evaluation case IDs with their suite ID. Case IDs must be
  stable and must not reveal the expected answer to the capability under test.

## Planned Source Layout

Phase 0 may add only the parts it needs, but it must preserve these ownership
boundaries:

```text
catalog.yaml                     capability registry
packs/                           installation-pack definitions
policies/                        canonical compact policy sources
plugins/<pack-id>/               distributable skill-bearing plugin
  .codex-plugin/plugin.json
  skills/<capability-id>/
    SKILL.md
    agents/openai.yaml            optional activation configuration
    references/                   conditional guidance, one level deep
    scripts/                      deterministic helpers
    templates/                    capability-owned output templates
    assets/                       non-instruction resources
bootstrap/                       policy/local-development installer source
schemas/                         machine-readable contract schemas
evaluations/<suite-id>/          cases, fixtures, and scoring configuration
templates/                       repository-wide authoring templates
docs/                            focused public and maintainer documentation
tests/                           repository and installer tests
```

A skill has one canonical source location under its owning plugin. Local
development may link to that source. Released artifacts use immutable copies;
generated packages must not become a second hand-edited source tree. Policies
remain canonical under `policies/` because a plugin directory alone does not
activate them as durable instructions.

`catalog.yaml` is the registry of capabilities, while pack definitions and
plugin manifests describe distribution. Do not duplicate descriptive metadata
unless a target format requires it. When duplication is required, catalog
validation must detect disagreement.

## Capability Boundaries

- **Policy:** a compact cross-cutting rule installed selectively into a durable
  instruction surface. It is not a skill.
- **Router:** selects a narrow workflow or reference path. It does not implement
  every path it can select.
- **Workflow:** performs a defined operation with an execution contract.
- **Reference:** conditionally loaded specialist knowledge without an
  independent execution lifecycle.
- **Resource:** deterministic support material such as a script, schema,
  fixture, template, or benchmark.

Promote a reference into a skill only after it has an independent trigger,
workflow, output, evaluation suite, and recurring demand. Shared material gets
one owner; use links or generation during packaging instead of copied guidance.

## Authoring Rules

- Keep official `SKILL.md` frontmatter limited to `name` and `description`.
- Keep lifecycle, owner, compatibility, dependencies, suite, pack, and release
  metadata in `catalog.yaml` and distribution manifests.
- Target fewer than 200 lines per `SKILL.md` and never exceed 500 lines.
- Keep references one level below their skill and load them conditionally.
- Prefer scripts for deterministic transformations and checks. Document their
  inputs, outputs, side effects, failure modes, and supported environment.
- Keep examples separate from evaluation cases. Do not train a capability on
  the expected answers used to score it.
- Use relative links within repository documentation. Verify that every local
  link and documented command resolves before a phase checkpoint.
- Keep authored files in English, UTF-8, with LF line endings and a final
  newline. Preserve syntax-required indentation and avoid trailing whitespace.
- Do not commit secrets, personal data, machine-specific absolute paths,
  generated caches, or local agent state.

## Change Discipline

Every change must identify its capability, pack, or repository-contract owner;
avoid unrelated edits. Generated files must identify their generator and are
updated through it. Changes to naming, layout, metadata fields, or public IDs
are repository-contract changes and require the decision process in
[ownership-and-decisions.md](ownership-and-decisions.md).
