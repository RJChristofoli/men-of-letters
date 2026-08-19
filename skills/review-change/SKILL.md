---
name: review-change
description: Review an existing pull request, branch, commit, local diff, or user-specified comparison for actionable software defects caused by that change. Use for code review, PR review, regression analysis, or change risk assessment. The comparison diff defines the finding scope; inspect unchanged repository code only as supporting evidence. Stay read-only unless fixes are explicitly requested.
---

# Review Change

Find defects that the author would want to fix before shipping.

## Resolve the Delta

Honor a user-specified comparison. Otherwise use these defaults:

- pull request: merge base of the base branch through the PR head;
- commit: the commit's first parent through the commit;
- branch: merge base of its upstream or clearly established base through its head;
- working tree: staged, unstaged, and untracked changes.

Do not guess when more than one plausible base would materially change the review.
State the reviewed base and target and whether staged, unstaged, and untracked
changes are included. Inspect the complete resolved delta before producing
findings.

Inspect unchanged callers, consumers, contracts, data paths, and tests only as
targeted evidence for behavior changed by the delta. Run focused read-only checks
when they can confirm or reject a suspected defect.

## Classify Candidates

Classify each candidate before reporting it:

- **Introduced defect:** the delta creates a reachable failure or omits a required
  counterpart change. It may be a finding.
- **Pre-existing problem:** it fails the same way without the delta. Exclude it
  unless the delta makes it newly reachable or materially worsens its impact;
  then report only the introduced regression.
- **Optional improvement:** it changes maintainability, style, resilience, or
  preference without fixing a defect caused by the delta. Exclude it.

Admit a finding only when a concrete execution path is supported by code,
contract, test, or other repository evidence. An unresolved suspicion that
depends on missing external information is a validation gap, not a finding.
Questions and hypotheses do not receive severity.

Missing test coverage alone is not a defect. Report a test finding only when the
delta makes a test conceal a regression, assert incorrect behavior, or omit a
counterpart required by a changed test contract. Otherwise mention meaningful
missing coverage under validation gaps.

Prioritize correctness, security, data integrity, compatibility contracts,
concurrency, partial failure, and resource bounds. Do not broaden the task into a
repository audit.

## Assign Severity

Use only this scale, based on demonstrated impact and realistic reachability:

- **P0:** broad catastrophic failure, severe unrecoverable data loss, or critical
  vulnerability that requires stopping delivery or operation.
- **P1:** serious and likely failure in an important path, including substantial
  security, data, availability, or compatibility impact.
- **P2:** reachable functional defect with bounded impact or specific triggering
  conditions.
- **P3:** real defect with limited impact. Never use P3 for style, preference,
  speculative hardening, or optional cleanup.

Probability may lower priority when the triggering conditions are narrow; it may
not raise priority beyond the demonstrated impact. When evidence supports more
than one priority, use the lower one.

## Write Findings

Order findings by severity and lead with them. Use this structure for every
finding:

```text
[P1] Actionable title — path/to/file.ext:line

Scenario: Concrete condition that triggers the problem.
Impact: Resulting incorrect behavior.
Delta cause: Changed behavior that introduces or activates the failure.
Correction: Smallest viable fix.
```

Translate the title and field labels to the user's language while preserving
their meaning and order.

Use the smallest relevant location, preferably a changed line. If the failure
manifests in unchanged code or a missing counterpart has no changed line, locate
the changed contract or behavior that activates it and identify the affected
consumer in the explanation. Do not cite a whole function when a smaller changed
range demonstrates the cause.

Keep each field concise, but do not omit or merge away its meaning. A formatting
or compression skill may shorten prose; it cannot remove severity, location,
scenario, impact, delta cause, or correction, and cannot admit nits, optional
improvements, speculative risks, or questions as findings.

## Final Finding Gate

Before delivery, remove:

- preferences and optional improvements;
- risks without a supported reachable scenario;
- findings outside the delta's causal scope;
- duplicate findings with the same root cause and correction;
- missing-test claims without an incorrect test behavior or required counterpart;
- severity labels unsupported by the demonstrated impact.

If no finding survives, clearly state in the user's language that no material
defect was found. Then include only meaningful validation gaps and residual risks,
if any. A validation gap states what could not be verified; a residual risk states
the concrete unresolved effect without presenting it as a defect.

Remain read-only unless the user explicitly asks to apply fixes.
