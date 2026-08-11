---
name: review-change
description: Review a local diff, branch, commit, or pull request for actionable software defects. Use when the user asks for code review, PR review, regression analysis, or risk assessment of existing changes. Prioritize correctness, security, data, contracts, and missing tests; stay read-only unless fixes are explicitly requested.
---

# Review Change

Find defects that the author would want to fix before shipping.

## Inspect

1. Read applicable repository instructions and determine the comparison base.
2. Inspect the complete diff, then trace affected callers, consumers, contracts,
   data paths, and tests where necessary.
3. Evaluate changed behavior rather than formatting in isolation.
4. Run focused read-only checks when they can confirm or reject a suspected issue.

## Prioritize

Look first for:

- incorrect behavior and regressions;
- security or authorization failures;
- data loss, corruption, or unsafe migrations;
- broken API, event, or compatibility contracts;
- concurrency, retry, ordering, and partial-failure bugs;
- resource leaks or unbounded work;
- tests that miss a credible failure introduced by the change.

Do not report preference-only style issues, speculative risks without a reachable
scenario, or pre-existing problems unrelated to the diff.

## Write Findings

For each finding:

1. Assign severity based on realistic impact.
2. Cite the smallest useful file and line location.
3. Explain the triggering scenario and resulting failure.
4. Suggest the smallest viable correction when it is clear.

Order findings by severity. Keep summaries brief and do not bury findings behind
process narration. If no material defect is found, say so and mention only
meaningful validation gaps or residual risks.

Remain read-only unless the user explicitly asks to apply fixes.
