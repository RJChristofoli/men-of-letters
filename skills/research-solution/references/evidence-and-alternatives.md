# Evidence and Alternatives

Use this reference only when conflicting evidence or reversal cost prevents a
confident recommendation from the core workflow.

## Resolve Evidence

- Prefer representative measurement, then observed behavior, authoritative
  documentation, inference, and explicit assumptions.
- Keep evidence class separate from confidence.
- Record conflicts and identify which source controls the decision.
- Check publication date, applicable version, environment, and population before
  generalizing a result.
- Do not invent numeric gains, weights, probabilities, or precision.

## Compare Options

Merge options with the same material trade-off. Compare only decisive axes:

- required behavior and failure recovery;
- security, privacy, compatibility, and operability;
- delivery, migration, and maintenance burden;
- measured performance or cost;
- support, lock-in, reversibility, and exit cost.

Avoid weighted scores unless the user owns the weights and the inputs are
comparable.

## Design the Test

Isolate the riskiest assumption. State the hypothesis, falsifier, representative
scope, success and regression signals, stop conditions, retained evidence,
cleanup, rollback, and the decision following each plausible result.

Recommend an ADR only for a durable boundary, shared contract, security model,
migration constraint, or costly reversal.
