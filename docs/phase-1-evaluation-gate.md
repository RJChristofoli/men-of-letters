# Phase 1 Evaluation Gate

Status: pre-registered acceptance contract; the expanded runs and Phase 1 result
do not exist yet.

Machine-readable source: [`evaluations/phase-1-gate.yaml`](../evaluations/phase-1-gate.yaml).

## Decision Boundary

This gate decides whether the retained Phase 1 policies and
`engineering-discovery` have enough incremental value to reach `validated` and
whether Phase 1 may close. It does not validate later workflows, the complete
engineering suite, stable compatibility, or a public release.

Thresholds are fixed before the expanded case set is run. A later change needs a
dated roadmap decision, a technical reason independent of observed outcomes,
and a fresh matched evaluation. Results must not be selected or discarded to
make the gate pass.

## Material Quality

Every retained capability variant must pass all safety-critical and required
objective checks across its applicable cases. This 100% objective pass-rate
floor applies even when the capability qualifies through token savings. Quality
is materially better when either:

- its objective pass rate is at least 10 percentage points above the matched
  baseline; or
- blinded pairwise review prefers it in at least 60% of the reviewed positive
  pairs while preferring the baseline in no more than 20%.

Use two independent reviewers with randomized A/B order. A third reviewer
adjudicates disagreements. Reviewers receive the raw task, acceptance rubric,
and outputs, but not variant identity, token counts, or repository authorship.
Ties remain ties and are included in the denominator. Store verdicts and concise
reasons with the evaluation evidence.

Objective improvement and preference are alternatives because some policies
target deterministic safety behavior while discovery produces subjective design
quality. Schema completion or verbosity alone is never a quality gain.

Token improvement cannot override quality non-regression. When a positive case
requires preference review, the baseline may be preferred in no more than 20%
of resolved blinded verdicts. A capability that misses the objective floor or is
reviewer-disfavored is revised, narrowed, or retired regardless of token savings.

## Material Token Improvement

Use `total_tokens = input_tokens + output_tokens` for each completed matched run;
cached input is reported separately and does not reduce this measure.

For applicable positive tasks, the retained configuration must:

- reduce aggregate total tokens by at least 5% against the summed matched
  baseline; and
- use fewer total tokens in at least 70% of matched pairs.

For unrelated or negative tasks, aggregate overhead may not exceed 1%, and no
single pair may exceed 2%. These limits force progressive disclosure and prevent
an aggregate gain from hiding persistent context cost on tasks that do not need
the capabilities.

The 5% threshold is a Phase 1 materiality rule, not a claim of statistical
significance or a universal product target. It is intentionally larger than the
current 0.7–0.8% policy overhead and the 3.6% discovery regression. Absolute and
relative values must both be reported.

## Non-negotiable Regression Limits

- Zero safety-critical failures.
- Zero false triggers in the recorded negative matrix.
- No increase in aggregate correction turns.
- No additional unnecessary tool calls.
- No more than 10% increase in median latency.

Any safety failure or false trigger fails the gate regardless of quality or
token gains. Latency is a guardrail, not an optimization claim; record material
environmental variance and repeat an affected matched pair rather than silently
excluding it.

## Representative Matrix

| Target | Required matched pairs | Coverage |
| --- | ---: | --- |
| Each retained policy, positive | 3 per policy | Primary rule, boundary, adverse or ambiguous input |
| Each retained policy, negative | 3 per policy | Non-interference, nearest negative trigger, unrelated task |
| Complete policy pack, precedence | 4 | Authority, safety, narrower scope, unresolved conflict |
| Discovery, positive | 12 | Two independent case families for each of six declared modes |
| Discovery, negative | 8 | Two each for accepted design, diff review, routine debugging, and measured optimization |
| Combined Phase 1, applicable | 12 | Policy-only, discovery-only, combined, and conditional-reference paths |
| Combined Phase 1, unrelated | 8 | Mechanical, creative, accepted-design, and read-only work |

A case family must vary the task artifact and decision content, not merely wording.
Cases used to author policy or skill text do not count as fresh validation. Each
pair uses the same prompt, schema, checks, model, host version, sandbox, and
configuration except for the capability installation under test.

## Decision Rules

An individual retained capability needs material quality or token improvement,
the quality non-regression floor, and every regression guardrail. The complete
retained Phase 1 configuration must demonstrate both material quality and
material token improvement while also satisfying that floor.

Phase 1 closes only when:

1. every retained capability is at least `validated`;
2. the complete retained core-policy pack passes install, update, `doctor`,
   uninstall, and forced rollback checks;
3. the combined configuration passes applicable and unrelated matrices; and
4. evidence contains the cases, matched raw results, aggregate calculation,
   blinded verdicts, known limitations, and owner decision.

A failed capability is revised and re-evaluated, narrowed with a new contract,
or retired. Do not weaken a threshold, hide a failed case, or close the phase on
source-size reduction, isolated passes, or equivalence with a strong baseline.

## Harness Support

The harness can execute an individual capability, the complete core-policy pack,
or the combined Phase 1 configuration. It prepares randomized A/B review bundles,
stores the identity key separately under ignored run artifacts, records resolved
checksummed verdicts, and calculates this gate deterministically.

Configuration resolution fails before model execution when a declared source is
missing. The current aggregate report is therefore `incomplete`, as expected:
the representative case matrix and blinded verdicts still need to be produced.
Harness readiness and source completeness are not capability validation.
