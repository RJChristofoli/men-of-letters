---
name: review-change
description: Review an existing pull request, branch, commit, local diff, or user-specified comparison for actionable software defects caused by that change. Use for code review, PR review, regression analysis, or change risk assessment. The comparison diff defines the finding scope; inspect unchanged repository code only as supporting context. Prioritize correctness, security, data, contracts, and missing tests; stay read-only unless fixes are explicitly requested.
---

# Review Change

Find defects that the author would want to fix before shipping.

## Inspect

1. Read applicable repository instructions and determine the comparison. For a
   pull request or branch, resolve the appropriate base; for a commit, local
   changes, or a user-specified comparison, use that review surface.
2. Inspect the complete relevant diff before producing findings.
3. Explore unchanged callers, consumers, contracts, data paths, and tests only
   when something in the diff justifies that targeted context.
4. Evaluate changed behavior rather than formatting in isolation, and run focused
   read-only checks when they can confirm or reject a suspected issue.

A finding is admissible only when it is causally attributable to the reviewed
change: code directly introduced it, changed behavior caused a regression, a
pre-existing condition became newly reachable or materially worse, or a modified
contract, schema, interface, dependency, migration, event, or data flow required
a counterpart update that is missing. Do not report a defect that would exist in
exactly the same way without the reviewed change, and do not broaden the task into
a repository audit.

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
2. Cite the changed line that caused the problem when possible.
3. Explain the triggering scenario and resulting failure.
4. Suggest the smallest viable correction when it is clear.

If the failure manifests in unchanged code or a missing counterpart update, make
its causal relationship to the reviewed diff explicit.

Order findings by severity. Keep summaries brief and do not bury findings behind
process narration. If no material defect is found, say so and mention only
meaningful validation gaps or residual risks.

Remain read-only unless the user explicitly asks to apply fixes.
