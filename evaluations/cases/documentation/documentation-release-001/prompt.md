Plan a README update for an English-language repository. Verified behavior: the
new `doctor` command is implemented, `doctor --json` exits 0 when healthy and 2
when issues exist, and `docs/doctor.md` exists. A future `repair` command appears
only in a proposal and has no implementation. The README is an entry document;
detailed diagnostics belong in `docs/doctor.md`.

Return JSON matching the supplied schema. Identify only justified documentation
changes and the checks required before publishing them.
