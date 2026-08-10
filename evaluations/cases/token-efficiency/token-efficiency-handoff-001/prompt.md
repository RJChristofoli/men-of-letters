Produce an actionable implementation handoff from the notes below for a senior
engineer. Preserve the decision, required constraints, verification, and
rollback. The notes contain repetition and unrelated material. Return JSON
matching the supplied schema.

Notes:

- Change only the existing payment retry worker.
- Keep the existing retry table; do not add a queue or database migration.
- A queue was discussed twice but rejected because this increment must preserve
  the deployed durability boundary.
- Retry delays are 30, 120, and 600 seconds, with no fourth attempt.
- Use `order_id` plus `attempt` as the idempotency key.
- The UI redesign belongs to a later project and is unrelated.
- Unit-test the delay schedule and terminal attempt.
- Integration-test duplicate delivery and confirm only one charge occurs.
- Emit the existing `payment_retry_exhausted` metric after the terminal attempt.
- Roll back by disabling the existing `payment_retry_v2` feature flag.
- Do not rename the metric in this increment.
- The team lunch is Friday and has no bearing on implementation.
- The rejected queue option would require new operational ownership.
- Preserve current retry-table cleanup behavior.
