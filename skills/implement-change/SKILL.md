---
name: implement-change
description: Implement a sufficiently defined behavior, change, or fix in an existing repository when the intended result or correction is already known and the primary work is modifying files and validating the result. Use to add, modify, fix, refactor, migrate, or complete code. If the cause of a failure is still unknown, use debug-problem. Skip review-only, diagnosis-only, research, and pre-implementation architecture decisions.
---

# Implement Change

Deliver the requested behavior with the smallest compatible change.

## Establish the Change

1. Read applicable repository instructions and inspect the working tree. Identify
   pre-existing user changes before editing overlapping files.
2. Translate the request into observable acceptance criteria and trace affected
   entry points, contracts, data, tests, generated artifacts, and documentation.
3. Before editing, state the known components and classify planned work on two
   independent axes:
   - **Purpose:** necessary behavior, related test or documentation, or
     opportunistic cleanup.
   - **Reach:** local, shared, or material expansion.
4. Exclude opportunistic cleanup. Ask only when a missing decision changes accepted
   behavior or when a material expansion is not already authorized by the request.

A shared file or API is not automatically a material expansion. Expansion is
material when it broadens behavior, ownership, compatibility, operational impact,
or blast radius beyond the requested outcome. A necessary shared change that is
clearly implied by the accepted behavior may proceed.

Known components are an initial scope, not a prediction of every file. Add a newly
discovered file automatically when it is the smallest direct dependency of an
acceptance criterion and does not materially expand the request. State the scope
update before editing it.

## Keep the Change Safe

- Preserve unrelated user work and intentional compatibility. Never discard or
  overwrite pre-existing changes to simplify the implementation.
- Resolve exact mutation targets and inspect overlapping edits before writing.
- Prefer reversible operations. Confirm destructive, privileged, publishing, or
  otherwise irreversible actions not already authorized by the request.
- Stop before mutation when a failed precondition makes the requested operation
  unsafe.
- If a required material expansion appears, explain why it is required and obtain
  authorization before editing that surface. Do not leave a partial expansion in
  the worktree while waiting.

## Implement

- Follow existing architecture, names, and patterns unless they cause the problem.
- Validate input and authorization at changed trust boundaries.
- Handle retries, idempotency, concurrency, partial failure, and observability only
  where the changed path makes them relevant.
- Update generated artifacts, dependency locks, migrations, and documentation only
  when they are required counterparts of verified behavior.
- Avoid speculative abstractions and unrelated refactors.

## Verify

1. Run the narrowest relevant checks first, then broader checks when risk warrants.
2. Add or update tests for changed behavior and credible regression paths when the
   repository supports meaningful automated coverage. Do not create artificial
   tests for documentation-only or purely mechanical changes; state why no test
   was added.
3. When a check fails, classify it as introduced by the change, pre-existing,
   unrelated, or inconclusive. Establish a baseline when attribution matters and
   can be checked safely.
4. Inspect the final attributable diff for debug artifacts, accidental scope,
   unintended contract changes, and missing counterpart updates.
5. Distinguish passed, failed, and skipped validation. Never claim an unobserved
   result.

## Final Scope Gate

Before completion:

1. Compare every change attributable to this task with the acceptance criteria and
   latest declared scope.
2. Remove only opportunistic work introduced by this task; preserve all
   pre-existing user changes.
3. Ensure every material expansion was authorized and every direct scope update
   was disclosed.
4. Do not claim completion while required behavior is missing or an unauthorized
   expansion remains.

## Hand Off

Lead with the implemented outcome. Report changed components, satisfied behavior,
validation commands and outcomes, authorized expansions, and material limitations.
Mention pre-existing failures or skipped checks only when they affect confidence or
the user's next action.
