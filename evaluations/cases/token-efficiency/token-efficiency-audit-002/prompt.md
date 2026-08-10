Create a detailed six-part release audit for the following service. The request
explicitly requires one finding for each named area, and each finding must state
the evidence, risk, and remediation. Do not shorten or merge the areas. Return
JSON matching the supplied schema.

Facts:

- Correctness: the new reconciliation path has unit tests but no duplicate-event
  integration test.
- Security: the callback verifies a signature but logs the complete request body.
- Data: the migration adds a non-null column without a default or backfill plan.
- Operations: an alert exists for failures but has no runbook link.
- Rollback: the deploy document says to revert, but the migration is irreversible.
- Compatibility: one consumer still uses the previous event field name.
