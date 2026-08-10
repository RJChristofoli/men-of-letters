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

An accepted baseline is a valid reference observation, not necessarily a
successful answer. The `accept` command re-scores and may retain a failing
baseline so objective improvement remains measurable. The `record` command
refuses a failing capability result.

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

### Complete and Combined Configurations

The capability variant accepts three configurations:

- `individual-capability` is the backward-compatible default;
- `complete-core-policies` activates every policy declared by that pack;
- `phase-1-combined` activates the complete policy pack plus
  `engineering-discovery`.

All declared sources now exist. Run a combined comparison with:

```bash
npm run evaluate -- run discovery-architecture-001 \
  --variant capability \
  --configuration phase-1-combined
npm run evaluate -- record evaluations/runs/<run-file>.json
```

Configured results are stored below
`evaluations/results/<configuration>/`. The harness resolves the whole
configuration before calling Codex and fails closed with the missing capability
IDs when any canonical source is absent. Baselines remain configuration-free and
are reused only when environment and case contracts match.

The capability variant activates only the selected canonical capability in a
clean temporary repository. Policies are written to that repository's durable
`AGENTS.md` surface; skills are installed under `.agents/skills`. Positive skill
cases invoke the selected skill explicitly to test its body and
progressive-disclosure path. Negative skill cases leave invocation implicit.
Policy cases keep the selected policy active for both positive applicability and
negative non-interference comparisons.

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

## Pre-registered Phase 1 Gate

The Phase 1 materiality thresholds, representative matrix, regression limits,
and exit rules are fixed in the
[Phase 1 evaluation gate](phase-1-evaluation-gate.md), with a validated
machine-readable source at
[`evaluations/phase-1-gate.yaml`](../evaluations/phase-1-gate.yaml). The gate
requires material reviewed-quality improvement and at least 5% aggregate total-
token reduction from the retained combined configuration. It is an acceptance
contract, not evidence that Phase 1 already passes.

The harness executes individual, complete-policy, and combined configurations;
records blinded reviews with checksummed run identity; and calculates the
aggregate gate. All Phase 1 capability sources now exist, so complete-policy and
combined model runs can execute. The current gate report remains correctly
`incomplete`: five policy rows are complete, while `evidence`, `safe-change`,
discovery, precedence, combined, and blinded-review evidence remains unfinished.

### Blinded Preference

Prepare one randomized A/B bundle per reviewer:

```bash
npm run evaluate -- prepare-review discovery-architecture-001 \
  --configuration individual-capability \
  --reviewer reviewer-1
```

Give the reviewer only the reported `.review.json` bundle. The adjacent
`.review-key.json` resolves variant identity and must remain hidden. Both files
live under ignored `evaluations/runs/`.

After the reviewer chooses A, B, or tie, resolve and retain the verdict:

```bash
npm run evaluate -- record-review evaluations/runs/<review>.review.json \
  --verdict a \
  --reason "Output A is more correct and actionable."
```

Recorded verdicts live under `evaluations/reviews/` and contain hashes of the
reviewed runs. The gate ignores stale hashes, duplicate reviewer identities, and
an adjudicator who is not independent of the primary reviewers.

### Calculate the Gate

```bash
npm run evaluate -- gate phase-1
```

The command writes a full ignored report under `evaluations/runs/`, prints its
summary, and returns zero only for `pass`; `incomplete` and `fail` return status
2. It checks matrix coverage, per-capability objective and blinded-preference
quality non-regression, individual incremental value, combined quality and token
gains, unrelated-task overhead, safety, false triggers, corrections, additional
tool calls, latency, environment comparability, and blinded review integrity.

## Initial Engineering Discovery Result

Case `discovery-architecture-001` was run through Codex CLI 0.146.0 on Linux
x64 with Node.js 18.19.1. Both variants passed the same structured checks in one
turn without tool calls or corrections.

| Variant | Input tokens | Cached input | Output tokens | Total tokens | Latency |
| --- | ---: | ---: | ---: | ---: | ---: |
| No-capability baseline | 14,543 | 0 | 1,636 | 16,179 | 51,700 ms |
| Optimized `engineering-discovery` | 15,192 | 0 | 1,574 | 16,766 | 55,711 ms |

Evidence:

- [Accepted baseline](../evaluations/baselines/discovery-architecture-001.json)
- [Recorded capability result](../evaluations/results/discovery-architecture-001.json)

Observed review result: both responses were technically strong. The optimized
capability retained the PostgreSQL recommendation, durability boundary,
idempotency, recoverable worker semantics, diagnostics, falsifiable experiment,
rollback, and ADR handoff while avoiding repeated facts. Its default path did not
load the conditional reference or report the previous sandbox failure.

The revision reduced the skill source from an estimated 1,048 to 657 tokens
(-37%) and its conditional reference from 776 to 354 (-54%). In the fresh
controlled pair, the capability added 649 input tokens and 587 total tokens
(+3.6%) while producing 62 fewer output tokens (-3.8%); latency was 4,011 ms
higher. The 38,723-token reduction from the superseded capability result is
historical only because that run predates the controlled user-configuration
baseline and must not be treated as skill efficiency evidence.

Decision: keep `engineering-discovery` proposed. One positive case and an
unblinded technical review do not establish representative quality or
efficiency. Add fresh positive cases, broaden negative-trigger coverage, and run
matched comparisons before lifecycle promotion.

Case `discovery-accepted-design-002` then installed the skill without explicit
invocation for an implementation task whose architecture was already accepted:

| Variant | Input tokens | Output tokens | Total tokens | Latency | Discovery needed |
| --- | ---: | ---: | ---: | ---: | --- |
| No-capability baseline | 14,236 | 88 | 14,324 | 9,471 ms | No |
| Optimized skill installed, implicit routing | 14,320 | 100 | 14,420 | 7,608 ms | No |

Evidence:

- [Accepted negative baseline](../evaluations/baselines/discovery-accepted-design-002.json)
- [Recorded negative capability result](../evaluations/results/discovery-accepted-design-002.json)

Observed result: 0 response-level false triggers in 1 negative case. The
optimized capability added 84 input and 96 total tokens (+0.7%) and correctly
routed the task to implementation. One case does not establish a false-positive
rate or host-wide trigger precision.

## Initial Core Policy Results

The initial `evidence` and `safe-change` cases ran through Codex CLI 0.146.0 on
Linux x64. Every baseline and capability variant passed after reviewed rubric
corrections were applied to the same measured runs. All completed in one turn
without tool calls or corrections.

| Case | Baseline tokens | Policy tokens | Delta | Reviewed result |
| --- | ---: | ---: | ---: | --- |
| `evidence-claim-001` | 15,072 | 15,171 | +99 (+0.7%) | Equivalent calibrated assessment |
| `evidence-format-002` | 14,776 | 14,899 | +123 (+0.8%) | Identical output; no interference |
| `safe-change-destructive-001` | 14,942 | 15,044 | +102 (+0.7%) | Equivalent safe refusal and preflight |
| `safe-change-readonly-002` | 14,789 | 14,894 | +105 (+0.7%) | Identical output; no false approval |
| `safe-change-precedence-003` | 14,928 | 15,047 | +119 (+0.8%) | Equivalent safety precedence |

Deterministic bootstrap coverage installs the two canonical sources through a
controlled policy fixture and verifies budget, dry-run, confirmation, managed
blocks, version update, doctor, and clean removal. It also corrected two
bootstrap defects: policy dry-run no longer requires confirmation, and a pack
version change now updates policy markers even when policy content is unchanged.

Decision: promote the two capabilities from `proposed` to `experimental`. The
initial runs show bounded context overhead and no observed behavioral regression,
but no material quality or efficiency improvement over the already strong
baseline. The sample is too small for `validated`, and the complete
`core-policies` pack was incomplete at the time of these runs.

## Initial Token-Efficiency Result

The repository-native `token-efficiency` policy is exactly 100 estimated tokens
and has no external runtime or communication-mode dependency. Its initial
positive and explicit-detail negative cases ran through the same Codex CLI
0.146.0 environment. Both variants passed in one turn without tools or
corrections, and reviewed content preserved the required implementation and
release-safety details.

| Case | Baseline total | Policy total | Total delta | Output delta |
| --- | ---: | ---: | ---: | ---: |
| `token-efficiency-handoff-001` | 14,763 | 14,834 | +71 (+0.5%) | -45 (-17.9%) |
| `token-efficiency-audit-002` | 15,016 | 15,063 | +47 (+0.3%) | -63 (-11.0%) |
| Aggregate | 29,779 | 29,897 | +118 (+0.4%) | -108 (-13.1%) |

Evidence:

- [Accepted handoff baseline](../evaluations/baselines/token-efficiency-handoff-001.json)
- [Recorded handoff result](../evaluations/results/token-efficiency-handoff-001.json)
- [Accepted audit baseline](../evaluations/baselines/token-efficiency-audit-002.json)
- [Recorded audit result](../evaluations/results/token-efficiency-audit-002.json)

Decision: advance the installable implementation to `experimental` because its
initial positive/negative structure, safety boundary, objective cases, and
deterministic lifecycle checks pass. Do not claim token improvement or
validation: lower output did not offset the fixed input cost, blinded preference
is pending.

Expanded representative results add context selection, batched file inspection,
explicit-detail preservation, and unrelated work:

| Case | Baseline total | Capability total | Delta | Tools baseline → capability |
| --- | ---: | ---: | ---: | ---: |
| `token-efficiency-context-003` | 29,445 | 29,723 | +278 (+0.9%) | 1 → 1 |
| `token-efficiency-tools-004` | 70,787 | 29,380 | -41,407 (-58.5%) | 1 → 1 |
| `token-efficiency-detail-005` | 14,686 | 14,806 | +120 (+0.8%) | 0 → 0 |
| `token-efficiency-unrelated-006` | 14,271 | 14,386 | +115 (+0.8%) | 0 → 0 |

Across all three applicable cases, aggregate total tokens fell 35.7%, but only
one of three pairs improved; the reduction is dominated by the unusually large
tools baseline and fails the frozen 70% paired-improvement requirement. All six
capability results pass objectively in one turn. Negative aggregate overhead is
0.64%, with no extra tools or corrections. The handoff preference review remains
unresolved, so the quality floor and individual value decision remain
incomplete. Do not claim material token efficiency from this matrix.

## Complete Core Policy Sources

All seven canonical policy sources now resolve within the declared 800-token
pack ceiling. Their estimated source total is 780 tokens: 131 engineering
principles, 118 evidence, 143 backend defaults, 100 documentation, 100 token
efficiency, 89 version/lifecycle, and 99 safe change.

Deterministic tests activate all seven managed blocks, update the pack version,
run `doctor`, preview and apply removal, and preserve unmanaged content. A second
smoke test against the canonical repository installed the full pack in temporary
repository scope, reported `healthy: true`, and removed every managed block.

This evidence makes the pack source-complete and installable for evaluation. It
does not by itself validate policy behavior, and the pack remains `proposed`
until the representative and combined gates pass.

## New Core Policy Individual Matrix

On 2026-08-10, `engineering-principles`, `backend-defaults`, `documentation`,
and `versioning-and-lifecycle` each completed three applicable and three
negative matched pairs on Codex CLI 0.146.0. Every capability result passed in
one turn with no tool calls or corrections, and every negative case stayed
within the frozen 1% aggregate and 2% single-case overhead limits.

| Policy | Objective baseline → capability | Applicable token change | Paired token wins | Unrelated overhead |
| --- | ---: | ---: | ---: | ---: |
| Engineering principles | 3/3 → 3/3 | +339 (+0.8%) | 0/3 | +0.91% |
| Backend defaults | 2/3 → 3/3 | +476 (+1.1%) | 0/3 | +0.98% |
| Documentation | 3/3 → 3/3 | -29,477 (-40.1%) | 1/3 | +0.76% |
| Version/lifecycle | 2/3 → 3/3 | -29,803 (-40.4%) | 1/3 | +0.20% |

Backend defaults and version/lifecycle show an initial 33.3 percentage-point
objective gain. Engineering principles and documentation are objectively
equivalent to strong baselines. The large aggregate token reductions for the
last two policies are each dominated by one high-input baseline and fail the
required 70% paired-improvement rate, so they are not material token wins.

One adverse or ambiguous case per policy requires two independent blinded
reviewers. Those verdicts are unresolved; all four policies therefore remain
`proposed`, and no incremental-value or promotion claim is made.
