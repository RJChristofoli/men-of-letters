# Deep Evidence and Alternatives

Load only after the core workflow cannot rank a costly-to-reverse decision
because material evidence conflicts or is missing.

## Resolve Evidence

- Prefer measured results, then observed behavior, reliable documentation,
  inference, and explicit assumptions.
- Keep confidence separate from evidence class. Record source conflicts and
  which source controls.
- Use primary sources for compatibility, security, licensing, and support.
- Stop research when another source cannot change ranking or the next test.

## Compare Options

Include no change when viable. Merge options with the same material trade-off.
Compare each option against only decisive axes:

- required behavior and failure recovery;
- security, privacy, and operability;
- delivery and migration burden;
- measured performance or cost;
- support, lock-in, reversibility, and elimination evidence.

Avoid weighted scores without owned weights and comparable inputs.

## Design the Test

Isolate the riskiest assumption. State hypothesis and falsifier, representative
scope, success/regression/stop signals, limits, retained evidence, cleanup,
rollback, and the decision following each plausible result. Keep claims local
until representative evidence supports broader scope.

Recommend an ADR only for a durable boundary, dependency, shared contract,
security model, migration constraint, or costly reversal.
