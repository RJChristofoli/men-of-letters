# Evaluation Harness

Status: experimental Phase 0 infrastructure.

The harness compares a capability variant with the same no-capability task. It
records task checks, token usage, turns, tool calls, latency, correction turns,
environment, and the structured response. Baseline and capability runs must use
the same case, output schema, Codex CLI configuration, and execution environment.

## Run a Case

```bash
npm run evaluate -- run discovery-architecture-001 --variant baseline
npm run evaluate -- run discovery-architecture-001 --variant capability
```

Add `--accept-baseline` only to a reviewed baseline run. Accepted baseline files
are committed under `evaluations/baselines/`; raw runs under `evaluations/runs/`
are local and ignored by Git.

If review corrects only an objective rubric without changing the task or output,
re-score and accept the existing measured run without another model call:

```bash
npm run evaluate -- accept evaluations/runs/<run-file>.json
```

After reviewing a capability response, re-score it against the current case and
retain it as comparative evidence:

```bash
npm run evaluate -- record evaluations/runs/<run-file>.json
```

Recorded capability results live under `evaluations/results/`. Passing objective
checks does not by itself justify lifecycle promotion.

The capability variant installs only the selected canonical skill into a clean
temporary repository. Positive cases invoke it explicitly to test the skill body
and progressive-disclosure path. Negative cases leave invocation implicit so
routing output and context overhead can reveal false-trigger regressions.

## Integrity

- Cases contain raw problem artifacts and objective output checks, not an ideal
  answer exposed to the capability.
- A schema-complete answer is not automatically technically correct. Review the
  response and record blinded human preference for subjective comparisons.
- Do not compare runs made with different cases, models, host versions, or
  materially different configuration as if they were controlled.
- Never place secrets, private code, personal data, or real user telemetry in a
  case or committed run.
- A single passing case is experimental evidence, not validation across the
  capability's declared scope.

## Initial Engineering Discovery Result

Case `discovery-architecture-001` was run through Codex CLI 0.146.0 on Linux
x64 with Node.js 18.19.1. Both variants passed the same structured checks in one
turn without tool calls or corrections.

| Variant | Input tokens | Cached input | Output tokens | Total tokens | Latency |
| --- | ---: | ---: | ---: | ---: | ---: |
| No-capability baseline | 16,561 | 0 | 1,912 | 18,473 | 46,596 ms |
| `engineering-discovery` | 53,481 | 34,304 | 2,008 | 55,489 | 60,841 ms |

Evidence:

- [Accepted baseline](../evaluations/baselines/discovery-architecture-001.json)
- [Recorded capability result](../evaluations/results/discovery-architecture-001.json)

Observed review result: both responses were technically strong. The baseline
included an additional PostgreSQL-outbox/Redis alternative; the capability was
slightly more explicit about confidence and at-least-once semantics. The
capability also reported that its conditional reference could not be inspected
because the host read-only sandbox failed to initialize. That host failure and
the substantial token/latency regression prevent a quality or efficiency claim.

Decision: keep `engineering-discovery` proposed. Add more negative-trigger and
fresh positive cases, reduce loading overhead, fix or isolate reference access,
and repeat controlled comparisons before lifecycle promotion.

Case `discovery-accepted-design-002` then installed the skill without explicit
invocation for an implementation task whose architecture was already accepted:

| Variant | Input tokens | Output tokens | Total tokens | Latency | Discovery needed |
| --- | ---: | ---: | ---: | ---: | --- |
| No-capability baseline | 16,250 | 83 | 16,333 | 7,617 ms | No |
| Skill installed, implicit routing | 16,353 | 72 | 16,425 | 6,313 ms | No |

Evidence:

- [Accepted negative baseline](../evaluations/baselines/discovery-accepted-design-002.json)
- [Recorded negative capability result](../evaluations/results/discovery-accepted-design-002.json)

Observed result: 0 response-level false triggers in 1 negative case, with 92
additional total tokens. One case does not establish a false-positive rate or
host-wide trigger precision, but it records the initial context overhead and
confirms the negative routing contract for this task.
