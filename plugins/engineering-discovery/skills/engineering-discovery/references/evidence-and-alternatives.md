# Evidence and Alternative Analysis

Load this reference only for consequential, disputed, or cross-boundary
decisions. The core workflow is sufficient for routine comparisons.

## Evidence Quality

Use the strongest available class and state confidence separately:

| Class | Meaning | Typical source |
| --- | --- | --- |
| Measured | Reproducible result in the relevant environment | Benchmark, telemetry, experiment |
| Observed | Directly inspected current behavior | Code, logs, configuration, reproduced failure |
| Documented | Explicit reliable statement | Official documentation, accepted design, task constraint |
| Inferred | Technical conclusion derived from other evidence | Dependency or failure-mode analysis |
| Assumed | Unverified input needed to proceed | Workload, capacity, team practice |

Do not convert user-provided goals into measured facts. Record conflicts between
sources and explain which source controls the decision. Prefer primary sources
for technology behavior, support, licensing, security, and compatibility.

Stop researching when another source is unlikely to change the option ranking or
the next reversible experiment. Increase evidence depth when failure is costly,
rollback is difficult, or the option creates a durable dependency.

## Alternative Set

Include the current path or doing nothing when it is viable enough to expose the
cost of change. Merge options that differ only in implementation detail. Add an
alternative only when it changes a material trade-off.

Compare options against the same axes:

- fit with required behavior and constraints;
- correctness, security, privacy, and failure recovery;
- operational burden and observability;
- delivery effort, migration path, and team capability;
- performance or cost evidence without speculative precision;
- ecosystem maturity, support, licensing, and lock-in;
- reversibility and exit cost;
- contraindications and evidence that would eliminate the option.

Do not use a weighted score unless weights have a real decision owner and the
inputs are comparable. A prose recommendation with explicit decisive factors is
usually more honest than arithmetic over subjective guesses.

## Validation Experiment

A useful experiment isolates the riskiest assumption instead of implementing the
whole recommendation. Specify:

- hypothesis and the evidence that would falsify it;
- representative fixture, workload, or integration boundary;
- success, regression, safety, and stop signals;
- time, tool, and environment limits;
- retained measurements and decision owner;
- cleanup and rollback;
- what decision follows each plausible result.

Treat an experiment result as local to its environment. Promote it to a broader
claim only after compatibility and representative cases support that scope.

## ADR Handoff

Recommend an ADR when the decision establishes a durable architectural boundary,
technology dependency, cross-team contract, migration constraint, security
model, or costly reversal. Skip an ADR for a local reversible choice whose
rationale remains clear in code or a short decision log.
