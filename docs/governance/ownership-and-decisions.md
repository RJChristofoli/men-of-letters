# Ownership and Decision Process

Status: accepted Phase -1 governance contract. Initial owners will be assigned
when `catalog.yaml`, pack manifests, and `CODEOWNERS` are created in Phase 0.

## Roles

- **Capability owner:** maintains the specification, implementation, evaluation
  suite, documentation, dependencies, and lifecycle evidence for one capability.
- **Pack owner:** maintains pack composition, compatibility, release notes, and
  cross-capability integration.
- **Platform owner:** maintains catalog/schema validation, packaging, bootstrap,
  installation safety, and evaluation infrastructure.
- **Governance maintainer:** approves repository-wide contracts, lifecycle gate
  interpretations, cross-pack conflicts, and breaking policy changes.

Owner values use stable GitHub handles or team IDs in machine-readable metadata.
Every catalog capability and pack must have one accountable owner; additional
reviewers do not dilute that ownership. An unavailable owner is reassigned
before release or status promotion.

## Decision Classes

| Class | Examples | Required record and review |
| --- | --- | --- |
| Local, reversible | Wording fix, test fixture, implementation detail within an accepted contract | Change rationale, affected owner, required checks |
| Capability contract | Trigger, output, side effect, dependency, budget, evaluation threshold | Updated specification/catalog/docs and capability-owner review |
| Cross-pack or platform | Naming/layout, precedence, schema, installation behavior, compatibility policy | Decision log or ADR and platform/governance review |
| Breaking, deprecating, or retiring | Removed ID, incompatible output, dropped compatibility, policy reversal | Migration/rollback plan, affected owners, release notice, governance approval |
| Emergency safety | Active security, privacy, destructive-action, or supply-chain risk | Immediate least-destructive mitigation, evidence, owner notification, follow-up record |

Use a concise roadmap decision-log entry when the decision is easily reversible
and its context fits there. Use an ADR when alternatives, long-term constraints,
or cross-component consequences need a durable standalone record. Supersede old
decisions; do not silently rewrite their history.

## Decision Workflow

1. Identify the decision owner, affected capabilities/packs, authority boundary,
   and whether the change is reversible.
2. Record current evidence, assumptions, constraints, alternatives including no
   change, trade-offs, compatibility, migration, and rollback.
3. Obtain the review required by the decision class before treating it as
   accepted. Authors do not self-approve cross-pack, breaking, or emergency
   follow-up decisions when another maintainer is available.
4. Update the source contract, catalog/manifests, affected documentation,
   evaluation cases, and roadmap in the same change.
5. Validate with the narrowest decisive checks, then record the result and next
   action. Approval validates the decision, not the capability's effectiveness.

When owners disagree, preserve the current compatible behavior while evidence
is gathered. Escalate unresolved cross-boundary decisions to a governance
maintainer. Security and irreversible-change controls take the safer temporary
path, but the exception still requires a follow-up decision record.

## Lifecycle Accountability

The capability owner proposes lifecycle changes with evidence. The pack owner
confirms integration and compatibility. A governance maintainer approves
promotion to `stable`, plus all deprecation and retirement transitions.
Automated checks verify required artifacts but do not replace accountable human
approval for those transitions.
