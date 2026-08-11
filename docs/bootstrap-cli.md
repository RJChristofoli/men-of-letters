# Bootstrap CLI

Status: experimental Phase 0 infrastructure. No stable CLI or plugin release has
been published.

The bootstrap manages repository- or user-scoped standalone skill copies, local
development links, and selectively activated policy blocks. Released plugins
remain the preferred skill distribution mechanism; bootstrap does not emulate a
marketplace.

## Prerequisites

- Node.js 18.19 or newer.
- A clean clone of this repository for development commands.
- Explicit authority for the selected target scope.

Install locked development dependencies and validate the repository:

```bash
npm ci
npm run validate
npm test
```

## Commands

List packs:

```bash
npm run cli -- list
```

Preview the experimental discovery pack in repository scope:

```bash
npm run cli -- install engineering-discovery \
  --scope repo \
  --target /absolute/path/to/target-repository \
  --dry-run
```

Install, diagnose, and remove it:

```bash
npm run cli -- install engineering-discovery \
  --scope repo \
  --target /absolute/path/to/target-repository

npm run cli -- doctor \
  --scope repo \
  --target /absolute/path/to/target-repository

npm run cli -- uninstall engineering-discovery \
  --scope repo \
  --target /absolute/path/to/target-repository
```

`--allow-proposed` is not required for the two Phase 1 experimental packs. It
remains an explicit development escape hatch for proposed packs and never
converts them into supported releases.

Use `--scope user` only when the capability should be shared across repositories.
`--target <directory>` overrides the repository root or home directory and is
useful for clean-environment tests. `--local-link` creates an opt-in development
link instead of an immutable copy.

## Policy Activation

Policy packs require an explicit host instruction target and confirmation:

```bash
npm run cli -- install core-policies \
  --scope repo \
  --target /absolute/path/to/target-repository \
  --instructions /absolute/path/to/target-repository/AGENTS.md \
  --dry-run

npm run cli -- install core-policies \
  --scope repo \
  --target /absolute/path/to/target-repository \
  --instructions /absolute/path/to/target-repository/AGENTS.md \
  --yes
```

The current `core-policies` pack has all seven canonical sources. Complete-pack
install, version update, `doctor`, uninstall, and rollback behavior run in clean
controlled scope, and a canonical temporary install/doctor/uninstall smoke test
passes. All seven policies and the pack are experimental and install without
`--allow-proposed` for controlled field evaluation. Activation uses checksummed
managed blocks, preserves unmanaged bytes, backs up existing instruction files,
and requires `--yes` only when applying changes after dry-run review.

## State and Safety

Repository scope stores state under `.men-of-letters/state.json`. User scope
uses `$XDG_STATE_HOME/men-of-letters/state.json` when `XDG_STATE_HOME` is an
absolute path, otherwise `.local/state/men-of-letters/state.json` below the
selected home. An explicit `--target` keeps state below that target. State
records pack versions, dependencies, owned artifacts, checksums, links, managed
policy blocks, backups, and the last operation.

The CLI resolves dependencies and all targets before mutation. It refuses
unmanaged collisions, modified managed content, incompatible dependencies,
missing sources, malformed policy markers, and removal of a required dependency.
Install and uninstall use snapshots and restore prior state on mid-operation
failure. Uninstall removes only verified installer-owned content.

## Package a Plugin

Build the experimental engineering-discovery archive:

```bash
npm run package-plugin -- engineering-discovery
tar -tzf dist/engineering-discovery-0.1.0-dev.0.tar.gz
```

The generated `dist/` archive is not committed. It includes the plugin, license,
provenance summary, and a release manifest with file checksums. Packaging a
development archive does not authorize public distribution.

## Experimental Readiness Scope

The Node test suite covers repository and user scopes, policy budget, dry-run,
proposed-pack gating, copied and linked installs, idempotency, update, discovery
path, doctor, collision handling, modified-content refusal, policy confirmation
and byte preservation, policy version-marker update, uninstall, state schema,
XDG state resolution, state-path traversal rejection, and forced rollback.
Marketplace install, signed releases, Windows behavior, and stable host
compatibility remain unvalidated.
