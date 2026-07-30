# Documentation Maintenance Checklist

Status: accepted Phase -1 contract.

Documentation is part of the definition of done, but only affected artifacts
change. A decision record does not substitute for working implementation or
evaluation evidence.

## Impact Map

| Change | Required documentation review |
| --- | --- |
| Priority, phase status, validated evidence, or next action | `ROADMAP.md` |
| Repository purpose, public behavior, available capabilities, installation, or entry points | `README.md` |
| Capability ID, type, status, owner, dependency, compatibility, suite, pack, or release | `catalog.yaml` |
| Trigger, inputs, outputs, side effects, limitations, or workflow | Capability specification, `SKILL.md`, and usage guide |
| Naming, layout, precedence, ownership, lifecycle, or safe-change contract | Affected governance document and roadmap decision log |
| Pack contents, dependencies, scope, policy activation, collision, or managed state | Pack manifest and installer documentation |
| Publicly released behavior | Changelog or release notes for the owning pack/plugin |
| Evaluation method, case, environment, metric, or result | Evaluation documentation and evidence index |
| Architecture or durable cross-component trade-off | ADR when the roadmap decision log is insufficient |

If an artifact does not yet exist, record its creation at the phase where its
underlying implementation begins. Do not create an empty catalog, changelog, or
release note merely to satisfy a checkbox.

## Author Checklist

- Identify affected audiences and artifacts before implementation.
- State status precisely: proposed, implemented, evaluated, validated, released,
  deprecated, and retired are not synonyms.
- Classify important claims as measured, observed, documented, inferred, or
  assumed; link evidence when retained in the repository.
- Update examples, commands, file trees, IDs, versions, compatibility, and links
  to match the same revision.
- Explain user-visible migration, rollback, limitations, and removed behavior.
- Preserve concise entry-point docs; link focused detail rather than duplicating
  it in the README or `SKILL.md`.
- Update only installer-owned managed blocks through the installer once it
  exists. Never hand-edit generated artifacts.
- Keep authored artifacts in English and follow repository naming conventions.

## Phase Checkpoint

Before completing a phase or roadmap item:

1. Compare the final diff and validation evidence with the impact map.
2. Run repository schema, metadata, documentation-link, and documented-command
   checks that exist for the phase.
3. Review every changed status and claim against its evidence. An approved
   design may be marked defined or accepted, not implementation-validated.
4. Update the roadmap item, evidence/result, decision log, known issues, and one
   concrete next action in the same work session.
5. Confirm catalog/manifests and release notes are synchronized when they exist
   and are affected.
6. Record skipped or unavailable checks with their consequence and owner.

Review the rendered or parsed form for tables, links, YAML, JSON, and templates;
source readability alone is insufficient. A checkpoint passes only when a new
thread can determine what exists, what evidence supports it, what remains
unvalidated, and what to do next without prior chat context.
