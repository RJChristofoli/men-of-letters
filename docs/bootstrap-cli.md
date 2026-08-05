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

Preview the proposed discovery pack in repository scope:

```bash
npm run cli -- install engineering-discovery \
  --scope repo \
  --allow-proposed \
  --dry-run
```

Install, diagnose, and remove it:

```bash
npm run cli -- install engineering-discovery --scope repo --allow-proposed
npm run cli -- doctor --scope repo
npm run cli -- uninstall engineering-discovery --scope repo
```

`--allow-proposed` is intentionally explicit. It is for local evaluation and
does not convert a proposed capability into a supported release.

Use `--scope user` only when the capability should be shared across repositories.
`--target <directory>` overrides the repository root or home directory and is
useful for clean-environment tests. `--local-link` creates an opt-in development
link instead of an immutable copy.

## Policy Activation

Policy packs require an explicit host instruction target and confirmation:

```bash
npm run cli -- install core-policies \
  --scope repo \
  --instructions /absolute/path/to/AGENTS.md \
  --allow-proposed \
  --dry-run

npm run cli -- install core-policies \
  --scope repo \
  --instructions /absolute/path/to/AGENTS.md \
  --allow-proposed \
  --yes
```

The current `core-policies` pack implements `evidence` and `safe-change`, but its
remaining policy sources are absent, so installing the complete pack still stops
before mutation. The activation path is tested with the canonical policies in a
controlled partial-pack fixture. It uses checksummed managed blocks, preserves
unmanaged bytes, backs up existing instruction files, and requires `--yes` only
when applying changes after dry-run review.

## State and Safety

Repository scope stores state under `.men-of-letters/state.json`; user scope uses
`.local/state/men-of-letters/state.json` below the selected home. State records
pack versions, dependencies, owned artifacts, checksums, links, managed policy
blocks, backups, and the last operation.

The CLI resolves dependencies and all targets before mutation. It refuses
unmanaged collisions, modified managed content, incompatible dependencies,
missing sources, malformed policy markers, and removal of a required dependency.
Install and uninstall use snapshots and restore prior state on mid-operation
failure. Uninstall removes only verified installer-owned content.

## Package a Plugin

Build the proposed engineering-discovery archive:

```bash
npm run package-plugin -- engineering-discovery
tar -tzf dist/engineering-discovery-0.1.0-dev.0.tar.gz
```

The generated `dist/` archive is not committed. It includes the plugin, license,
provenance summary, and a release manifest with file checksums. Packaging a
development archive does not authorize publishing it.

## Validated Scope

The Node test suite covers repository and user scopes, policy budget, dry-run, proposed-pack
gating, copied and linked installs, idempotency, update, discovery path, doctor,
collision handling, modified-content refusal, policy confirmation and byte
preservation, policy version-marker update, uninstall, state schema, state-path
traversal rejection, and forced rollback. Marketplace install, signed releases,
Windows behavior, and stable host compatibility remain unvalidated.
