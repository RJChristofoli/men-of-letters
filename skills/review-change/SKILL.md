---
name: review-change
description: Review an existing pull request, branch, commit, local diff, or user-specified comparison for actionable software defects caused by that change. Use for code review, PR review, regression analysis, or change risk assessment. The comparison diff defines the finding scope; inspect unchanged repository code only as supporting context. Prioritize correctness, security, data, contracts, and missing tests; stay read-only unless fixes are explicitly requested.
---

# Review Change

Find defects that the author would want to fix before shipping.

## Delta Gate

Before analysis, state the reviewed delta: base, target, and whether staged,
unstaged, or untracked changes are included. Resolve the comparison from the user
request or repository context; state any necessary assumption. Inspect the full
delta before producing findings.

Inspect unchanged callers, consumers, contracts, data paths, and tests only as
targeted evidence for changed behavior. Run focused read-only checks when they
can confirm or reject a suspected defect.

## Classify Candidates

Classify each candidate before reporting it:

- **Introduced defect:** the delta creates a reachable failure or omits a required
  counterpart change. It may be a finding.
- **Pre-existing problem:** it fails the same way without the delta. Do not report
  it unless the delta makes it newly reachable or materially worsens its impact;
  then report only the introduced regression.
- **Optional improvement:** it improves maintainability, style, or resilience
  without fixing a defect caused by the delta. Do not report it as a finding.

Admit only introduced defects, including missing counterpart updates required by
a changed contract, schema, interface, dependency, migration, event, or data
flow. Do not broaden the task into a repository audit.

Prioritize correctness, security, data integrity, compatibility contracts,
concurrency, partial failure, resource bounds, and missing coverage for a
credible regression.

## Write Findings

For every finding, include all of:

- the smallest relevant location, preferably a changed line;
- a concrete triggering scenario;
- the resulting impact;
- the causal relationship to the delta;
- the smallest viable correction.

Assign severity from realistic impact and order findings by severity. If a
failure manifests in unchanged code or a missing counterpart update, cite the
changed behavior that activates it.

## Final Finding Gate

Before delivery, remove:

- preferences and optional improvements;
- risks without a reachable triggering scenario;
- findings outside the delta's causal scope;
- duplicate findings with the same root cause and correction;
- severity labels unsupported by the demonstrated impact.

Keep findings concise. If none survive the gate, say that no material defect was
found and mention only meaningful validation gaps or residual risks.

Remain read-only unless the user explicitly asks to apply fixes.
