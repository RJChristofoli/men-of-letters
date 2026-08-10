Produce exactly five separate release findings, one for each supplied area. Each
finding must preserve its evidence, risk, and required action. Do not merge or
shorten areas. Return JSON matching the supplied schema.

- Architecture: two services write directly to one shared database schema.
- Security: the service account has wildcard permissions.
- Data: a required column has no backfill plan.
- Operations: queue depth is measured but has no alert.
- Rollback: the runbook says revert but has no restore rehearsal.
