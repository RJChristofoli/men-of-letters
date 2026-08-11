# Versioning, Compatibility, and Lifecycle

Status: accepted Phase -1 contract; no pack or capability has been released.

## Version Unit

Use SemVer 2.0.0 for each independently installable pack/plugin. Do not add
per-capability versions while capabilities ship only as part of a pack. Version
the future bootstrap CLI independently because its installation and state-schema
compatibility differ from plugin behavior.

Record versions in manifests without a `v` prefix. Use release tags of the form
`<pack-id>/v<semver>` and `bootstrap/v<semver>`. A repository-wide marketing
version may be added only when a single coordinated release actually exists.

## SemVer Interpretation

- **Major:** removes or renames a public capability or policy ID; makes a
  trigger, required input, output contract, side effect, managed format, pack
  dependency, or compatibility requirement incompatible; or removes a
  previously supported migration path.
- **Minor:** adds a capability or backward-compatible behavior, expands optional
  output, adds an opt-in policy, or deprecates without removal.
- **Patch:** fixes behavior to match the accepted contract, improves compatible
  guidance/tests/docs, or changes packaging without changing public behavior.

Before `1.0.0`, incompatible changes increment the minor version and must still
include migration and release notes. Pre-release identifiers may be used for
experimental artifacts. Build metadata must not encode compatibility decisions.

A policy wording change is behavioral: classify it by its effect, not its line
count. Evaluation fixtures and schemas used only inside development follow the
owning pack or bootstrap version unless distributed independently.

## Compatibility

Catalog and manifests must record only tested compatibility, using explicit
constraints for:

- Codex or another supported host surface;
- required pack/plugin versions;
- bootstrap CLI and state-schema versions where relevant;
- runtime requirements of scripts.

An absent compatibility claim means unknown, not compatible. Phase 0 must define
the initial tested matrix before the first release. Dependency resolution fails
closed on unsatisfied constraints. A compatibility expansion requires recorded
tests; a compatibility removal follows the breaking-change process.

State and catalog schemas carry their own integer `schema_version`. Readers may
accept older known versions and migrate them transactionally. They must reject a
newer unknown schema without mutation.

## Lifecycle States and Gates

```text
proposed → experimental → validated → stable → deprecated → retired
```

- **Proposed:** specification or design exists. No implementation or quality
  claim is implied.
- **Experimental:** implementation is installable in a controlled scope; core
  structure, safety checks, and initial positive/negative cases pass. Contract
  changes remain likely.
- **Validated:** representative controlled and field evidence outperforms or
  materially matches the no-capability baseline on declared success criteria
  without unacceptable safety, trigger, token, latency, or correction
  regressions. Forward tests alone do not prove end-user value.
- **Stable:** validated across the published compatibility matrix and maintained
  through at least one regression cycle; ownership, support, migration, and
  release documentation are complete.
- **Deprecated:** still available but discouraged. Catalog, discovery surfaces,
  and release notes identify the replacement or reason, migration path, support
  window, and planned removal release.
- **Retired:** removed from active packs and discovery. Historical records,
  evaluation evidence, and migration documentation remain accessible.

Promotion evidence includes suite/case versions, environment, raw result
location, metric comparison, known failures, owner proposal, and required
approval. Documentation completion alone never advances an implementation
state. A regression can block a release or return an unreleased capability to an
earlier state; released artifacts retain their historical record.

## Deprecation and Removal

Deprecation occurs in a minor or major release, never silently in a patch. The
deprecation record must specify an explicit support window and removal version.
Because release cadence is not yet established, this contract sets no fabricated
calendar duration; removal must occur no earlier than the next major release and
after at least one published release containing the warning and migration path.

During the support window, security and critical correctness fixes continue for
the deprecated path unless the notice explicitly documents why that is unsafe or
impossible. Retirement verifies that pack dependencies, policies, docs, examples,
and installer state can migrate or cleanly remove the capability.

## Release Requirements

Every release must have a resolved manifest, compatibility checks, dependency
validation, relevant evaluation/regression results, install/update/uninstall
checks proportional to the change, documentation verification, and user-visible
release notes. Signatures, provenance attestations, and the publishing channel
remain Phase 0 decisions and must be settled before public distribution.
