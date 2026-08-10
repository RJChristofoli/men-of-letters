# Distribution and Installation Boundaries

Status: accepted Phase 0 architecture contract; implementation validation is
tracked separately.

## Boundary Decision

Keep authoring, released skill distribution, policy activation, and local
development separate:

| Boundary | Owns | Does not own |
| --- | --- | --- |
| Catalog | Capability identity, type, lifecycle, owner, source, dependencies, compatibility, evaluation, and pack membership | Installation state or duplicated skill instructions |
| Pack manifest | Versioned installable composition and dependencies | Capability lifecycle evidence |
| Skill-bearing plugin | Canonical router/workflow sources and host plugin metadata | Durable policy activation |
| Policy source | Canonical compact cross-cutting instruction | Host discovery or mutation |
| Bootstrap CLI | Pack resolution, policy activation, repository/user-scope local development, state, collision detection, backup, rollback, and doctor checks | Capability reasoning or released-plugin replacement |
| Evaluation harness | Cases, run records, metrics, comparisons, and promotion evidence | Production telemetry collection by default |

The catalog points to canonical sources. Pack and plugin manifests may repeat only
fields required by their consumers; validation detects disagreement.

## Initial Packs

| Pack ID | Distribution | Initial responsibility | Dependencies |
| --- | --- | --- | --- |
| `core-policies` | Bootstrap-managed policy pack | Evidence, safe change, documentation, token efficiency, versioning, and backend defaults | None |
| `engineering-discovery` | Skill-bearing plugin | Pre-implementation discovery router | Optional `core-policies` activation |
| `backend-quality` | Skill-bearing plugin | Backend review plus testing and refactoring workflows | Optional `core-policies` activation |
| `engineering-optimization` | Skill-bearing plugin | Measured optimization router and references | `backend-quality`; optional `core-policies` activation |
| `documentation-workflows` | Skill-bearing plugin | ADR and maintained-documentation workflows | Optional `core-policies` activation |
| `specialist-reviews` | Skill-bearing plugin | Independently justified specialist workflows, initially security review | `backend-quality`; optional `core-policies` activation |

An optional policy activation is not silently installed with a plugin. The
bootstrap may offer it in a plan, but persistent-instruction mutation requires
separate confirmation.

Pack boundaries optimize for narrow discovery and independent release. Do not
create a single all-capabilities plugin in Phase 0. A future convenience bundle
may depend on packs without duplicating their files.

## Canonical Layout

```text
catalog.yaml
provenance.yaml
packs/<pack-id>.yaml
policies/<policy-id>.md
plugins/<pack-id>/.codex-plugin/plugin.json
plugins/<pack-id>/skills/<capability-id>/...
bootstrap/
evaluations/{cases,runs,baselines,results,reviews}/
schemas/
scripts/
tests/
```

The first vertical slice must exercise catalog entry, pack composition, canonical
source, plugin metadata, structural validation, positive/negative evaluation
cases, a no-capability comparison, and release-file enumeration before bootstrap
development expands.

## Bootstrap Boundary

The CLI operates only on an explicit `--scope repo|user`. Repository scope uses
the target repository's `.agents/skills` and `.men-of-letters/state.json`. User
scope uses `$HOME/.agents/skills` and the XDG state location defined by the
installation contract. Released plugins remain host-installed artifacts; the
bootstrap may inspect them but does not emulate a host marketplace.

Bootstrap pack installation may:

- copy immutable released skill artifacts for explicitly supported standalone
  installation;
- create opt-in links to canonical sources in local-development mode;
- activate selected policies through managed blocks;
- validate and record owned files, dependencies, checksums, and backups.

It may not edit unmanaged content, install undeclared dependencies, select user
scope implicitly, publish artifacts, or turn a policy into a discoverable skill.

## Release Boundary

Each skill-bearing pack is one independently versioned plugin. `core-policies`
is independently versioned but distributed through bootstrap until a host offers
a native selective policy mechanism. Bootstrap has its own version and state
schema. Compatibility is declared only for combinations exercised by automated
or recorded clean-environment tests.

GitHub Releases are the initial channel. Marketplace and registry publication
remain gated by the publishing and provenance contract.
