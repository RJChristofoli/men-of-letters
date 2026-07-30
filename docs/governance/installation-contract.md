# Installation and Managed-Content Contract

Status: accepted contract with an experimental Phase 0 bootstrap, schemas, and
initial pack manifests. Stable distribution remains unvalidated.

This contract separates released plugin installation from policy activation and
repository-local development. It governs the future bootstrap installer.

## Scopes

| Scope | Skills | Policies and state | Intended use |
| --- | --- | --- | --- |
| Repository | `<repo>/.agents/skills` | target repository instruction file plus `<repo>/.men-of-letters/state.json` | Project-specific, version-controlled capability selection |
| User | `$HOME/.agents/skills` | user durable-instruction surface plus `$XDG_STATE_HOME/men-of-letters/state.json` | Capabilities intentionally shared across repositories |
| Released plugin | Host plugin installation | Host plugin metadata; policy activation remains separate | Immutable, versioned skill distribution |
| Local development | Links from a selected repo or user scope | Bootstrap state records link targets | Testing canonical sources without packaging copies |

If `XDG_STATE_HOME` is unset, use `$HOME/.local/state`. The exact durable
instruction filename is host-dependent and must be discovered before mutation;
the CLI must not assume that every host uses `AGENTS.md`.

Repository scope wins for project-specific capability selection, but it does not
override the host instruction hierarchy. Dependencies install into the same
scope unless a pack explicitly declares a supported external dependency.

## Packs and Dependencies

A pack definition must have a stable ID, version, owner, contents, dependencies,
compatible host and bootstrap versions, and policy activation requirements.
Resolve the complete dependency graph before writing. Reject missing or cyclic
dependencies and incompatible version constraints. A dependency already present
at a compatible version is reused; an incompatible installed version requires
an explicit update plan.

Phase 0 established the initial pack boundaries and manifest schema. Future
changes may not weaken the preflight, ownership, or rollback requirements in
this contract.

## Collision Rules

Before mutation, compare every target with the desired artifact and installer
state:

- An identical installer-owned artifact is an idempotent no-op.
- A changed installer-owned artifact is updated only after its recorded checksum
  and ownership match the current target.
- An unmanaged target, unexpected symlink, modified managed artifact, duplicate
  policy block, or path owned by another pack is a collision.
- Never overwrite, merge, rename, or delete a collision automatically.
- Shared files require explicit multi-pack ownership in the manifest and
  byte-identical content; otherwise installation stops.

Dry-run performs the same resolution and collision checks and reports the
planned writes, links, backups, policy changes, dependencies, and removals
without mutating state.

## Managed Policy Blocks

Each installed policy occupies exactly one full-line-delimited block:

```text
<!-- men-of-letters:start policy=<policy-id> pack=<pack-id> version=<semver> checksum=<sha256> -->
<policy content>
<!-- men-of-letters:end policy=<policy-id> -->
```

IDs use repository naming rules. The checksum is lowercase hexadecimal SHA-256
of the normalized policy content between the marker lines, encoded as UTF-8 with
LF line endings and exactly one final newline. Marker lines are not included.

The installer may replace or remove only a well-formed block whose ID, owner,
and current checksum match its state record. It preserves all bytes outside its
blocks. Missing, nested, duplicate, malformed, or locally modified blocks stop
the operation and require an explicit repair decision. A failed install restores
the pre-operation file and state.

## Mutation Protocol

For every mutating command, the future CLI must:

1. Resolve scope, pack versions, dependency graph, targets, and compatibility.
2. Inspect current files, links, blocks, state, and collisions.
3. Present an exact plan. Require explicit confirmation before the first change
   to any persistent instruction file, unless the user supplied a dedicated
   non-interactive confirmation flag.
4. Back up each existing file that may change and stage new content in the same
   filesystem where practical.
5. Apply changes atomically where supported, then verify content, checksums,
   discoverability, dependencies, and state.
6. On failure, roll back changes from this operation and report anything that
   could not be restored.

The state record must include schema version, installer version, scope, target
root, packs and versions, dependencies, installed artifact paths and checksums,
managed block metadata, link targets, backups, and operation identity. It must
not contain secrets.

Uninstall removes only verified installer-owned artifacts and managed blocks.
It retains dependencies still required by another installed pack. Update is an
install transaction from one resolved state to another, never an untracked
in-place rewrite.

Released installation uses immutable copies or host-managed plugin artifacts.
Links are opt-in for local authoring only; the doctor command must report broken
or escaped link targets. All resolved targets must remain inside the selected
scope, and path traversal is rejected.
