---
name: implement-change
description: Implement a sufficiently defined behavior, change, or fix in an existing repository when the intended result or correction is already known and the primary work is modifying files and validating the result. Use to add, modify, fix, refactor, migrate, or complete code. If the main problem is discovering why something fails, use debug-problem. Skip review-only, diagnosis-only, research, and pre-implementation architecture decisions.
---

# Implement Change

Deliver the requested behavior with the smallest compatible change.

## Establish the Change

1. Read applicable repository instructions and inspect the working tree.
2. Translate the request into observable acceptance criteria.
3. Trace the affected entry points, contracts, data, tests, and documentation.
4. Ask only when a missing decision materially changes the implementation.

## Implement

- Follow existing architecture, names, and patterns unless they cause the problem.
- Change only files required by the accepted behavior.
- Preserve unrelated user work and intentional compatibility.
- Validate untrusted input and authorization at trust boundaries.
- Account for failure, retries, idempotency, concurrency, and observability only
  where external or asynchronous effects make them relevant.
- Update documentation only when verified behavior or usage changes.
- Avoid speculative abstractions, unrelated cleanup, and invented requirements.

## Keep Changes Safe

- Resolve exact targets before mutation.
- Prefer reversible operations and never discard unrelated changes.
- Confirm destructive, privileged, publishing, or irreversible actions not
  already authorized by the request.
- Stop when a failed precondition makes the requested change unsafe.

## Verify

1. Run the narrowest relevant checks first, then broader checks when risk warrants.
2. Add or update tests for changed behavior and credible regression paths.
3. Inspect the final diff for accidental scope, debug artifacts, and contract changes.
4. Distinguish passed, failed, and skipped validation. Never claim a result that
   was not observed.

## Hand Off

Lead with the implemented outcome. Summarize changed files, validation evidence,
and any material limitation or follow-up. Keep the response proportional to the
change.
