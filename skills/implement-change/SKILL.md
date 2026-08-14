---
name: implement-change
description: Implement a sufficiently defined behavior, change, or fix in an existing repository when the intended result or correction is already known and the primary work is modifying files and validating the result. Use to add, modify, fix, refactor, migrate, or complete code. If the main problem is discovering why something fails, use debug-problem. Skip review-only, diagnosis-only, research, and pre-implementation architecture decisions.
---

# Implement Change

Deliver the requested behavior with the smallest compatible change.

## Scope Gate — Before Editing

1. Read applicable repository instructions and inspect the working tree.
2. Define observable acceptance criteria and trace the affected entry points,
   contracts, data, tests, and documentation.
3. Before the first edit, declare the expected files or components and classify
   each planned change:
   - **Necessary:** required to satisfy an acceptance criterion.
   - **Related test or documentation:** directly verifies or describes changed
     behavior.
   - **Opportunistic cleanup:** useful independently of the requested behavior.
   - **Material expansion:** broadens behavior, ownership, compatibility, or
     blast radius beyond the accepted change.
4. Exclude opportunistic cleanup. Obtain authorization before including material
   expansion. Ask when a missing decision changes the accepted behavior or scope.

A necessary dependency is the smallest direct support for an acceptance
criterion. Cleanup is independently useful and optional. Treat a change as
material, even when necessary, if it alters a shared API, global imports,
cross-cutting configuration, bootstrap, shared infrastructure, or pre-existing
behavior outside the requested path.

## Expansion Gate — Before an Undeclared File

Before editing a file or component outside the declared scope:

1. Check whether the original request or delta already included it.
2. Determine whether the edit changes any shared or cross-cutting surface listed
   above.
3. If it is a material expansion, do not edit it; explain the dependency and ask
   for authorization.
4. Add it automatically only when it is a direct, low-risk dependency. Record
   the reason and add it to the declared scope before editing.

## Implement

- Follow existing architecture, names, and patterns unless they cause the problem.
- Handle trust boundaries and external or asynchronous failure properties only
  where the changed path makes them relevant.
- Update documentation only when verified behavior or usage changes.

## Verify

1. Run the narrowest relevant checks first, then broader checks when risk warrants.
2. Add or update tests for changed behavior and credible regression paths.
3. Inspect the final diff for debug artifacts and unintended contract changes.
4. Distinguish passed, failed, and skipped validation. Never claim a result that
   was not observed.

## Final Scope Gate

Before completion:

1. Compare every modified file or component with the declared scope.
2. Remove only your opportunistic cleanup; preserve pre-existing user changes.
3. List each authorized expansion and its reason.
4. Do not complete while any material expansion remains unauthorized. Remove your
   expansion or request authorization first.

## Hand Off

Lead with the implemented outcome. Summarize changed files, validation evidence,
authorized expansions, and any material limitation.
