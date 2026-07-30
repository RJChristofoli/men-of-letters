# Publishing, Licensing, and Provenance

Status: accepted Phase 0 publishing contract.

## Repository and License

The canonical repository is the public GitHub repository
`RJChristofoli/men-of-letters`; GitHub reported `PUBLIC` visibility and `main` as
the default branch on 2026-07-30. Repository-authored material is distributed
under Apache License 2.0, as recorded in the root `LICENSE` file.

Apache-2.0 was selected for permissive reuse with an explicit patent grant and
clear redistribution obligations. It does not relicense third-party material;
each incorporated dependency or adapted artifact must be compatible and retain
its required notices.

## Publishing Model

- GitHub is the source of truth for code, documentation, issues, and release
  history.
- Release independently installable packs/plugins with Git tags and GitHub
  Releases using the versioning contract.
- Release the bootstrap CLI independently. Initial releases may attach immutable
  source archives or platform artifacts to GitHub Releases.
- Do not publish to a plugin marketplace, package registry, or additional
  distribution channel until provenance, compatibility, clean installation,
  update, removal, rollback, and discovery checks pass for that artifact.
- Published archives are generated from a clean tagged commit. They must contain
  their license, required notices, resolved manifests, checksums, and provenance
  summary and must not contain local links or development state.
- A registry or marketplace copy is a distribution mirror, not a new source of
  truth. Its version and digest must match the GitHub release.

The initial support model is best-effort open-source maintenance. No stability,
compatibility, response-time, or security-fix promise exists beyond the contract
declared by a specific release.

## Provenance Rules

`provenance.yaml` is the machine-readable inventory of external material copied,
adapted, generated, or redistributed by the repository. Package-manager lockfiles
remain the inventory for ordinary dependencies; provenance records are required
for bundled content and generated artifacts whose origin is not obvious from a
lockfile.

Before third-party material enters an active source or release:

1. Record its name, exact upstream URL, immutable revision or version, author or
   owner, license identifier, retrieval date, repository paths, use type, and
   local modifications.
2. Retrieve and inspect the upstream license and required attribution. A missing,
   unknown, source-available-only, noncommercial, or otherwise incompatible
   license blocks inclusion.
3. Prefer linking to official documentation over copying it. Prefer a clean-room
   original implementation when the idea is unprotected but the expression is
   not reusable.
4. Preserve copyright, license, and NOTICE requirements in the distributed
   artifact. Add `THIRD_PARTY_NOTICES.md` when any included material requires or
   benefits from a human-readable notice.
5. Verify that the intended distribution channel and modification type are
   permitted. Record the reviewer and evidence status.
6. Re-check provenance when updating the upstream revision or changing how the
   material is distributed.

Do not copy skill text merely because it is publicly accessible. Prompts,
templates, examples, fixtures, schemas, scripts, images, and generated outputs
all require an origin decision. Secrets, personal data, confidential artifacts,
and telemetry from real users are never acceptable evaluation fixtures.

## Contribution Provenance

Contributions intentionally submitted to the repository are accepted under the
Apache-2.0 contribution terms unless explicitly marked otherwise. Contributors
must have the right to submit their work and must disclose adapted or generated
material. A future DCO or CLA requires a separate recorded decision; neither is
implied today.

## Release Gate

Repository validation must reject malformed provenance entries, missing files,
duplicate IDs, non-immutable upstream references for bundled material, and
unreviewed or license-incompatible status. An empty third-party inventory is
valid and means the current repository claims only original work and ordinary
declared dependencies.
