# Safe Change and Execution Contract

Status: accepted Phase -1 contract; automation that validates the contract is
planned for Phase 0.

This contract applies to repository changes, workflow skills, deterministic
scripts, and the bootstrap installer. It scales validation to risk while keeping
authority and rollback explicit.

## Required Declaration

Before execution, every workflow or mutating resource declares:

- outcome and acceptance criteria;
- mode: read-only or mutating;
- exact files, directories, systems, accounts, and data it may read or change;
- authority already supplied and any additional approval required;
- expected side effects and externally visible actions;
- invariants and behavior that must remain unchanged;
- idempotency and concurrency assumptions;
- preflight, validation, and evidence to retain;
- partial-failure behavior and transaction boundary;
- rollback method and rollback criterion;
- stop conditions, including irreversible or destructive boundaries.

The declaration belongs in the capability specification and is summarized in
the executable workflow. Dynamic targets must be resolved and displayed before
mutation; unresolved variables, broad roots, or unbounded globs are not valid
targets for destructive operations.

## Risk Classes

| Risk | Typical scope | Minimum control |
| --- | --- | --- |
| Low | Read-only inspection or easily reverted local authored file | Scope check, focused validation, diff review |
| Medium | Multiple files, generated artifacts, dependency or configuration change | Preflight, backups or version-control recovery, focused tests plus integration check |
| High | Persistent instructions, credentials/permissions, external systems, publishing, migration, destructive action | Explicit target and approval, dry-run where possible, backup, staged/transactional execution, independent review, rollback verification |

Security sensitivity, privileged access, personal data, broad blast radius, weak
observability, and difficult rollback raise the class regardless of diff size.

## Execution Protocol

1. Inspect applicable instructions, current state, ownership, and local changes.
2. Resolve precise targets and dependencies. Preserve unrelated and user-owned
   changes.
3. Capture the narrow baseline needed to detect a regression.
4. Select the smallest reversible change that can meet the acceptance criteria.
5. Obtain explicit confirmation immediately before a destructive, irreversible,
   privileged, publishing, or persistent-instruction mutation not already
   specifically authorized.
6. Stage changes and use atomic or transactional replacement where supported.
7. Validate the changed behavior, invariants, scope, and side effects. For an
   optimization, compare the same reproducible baseline before and after.
8. Review the diff and documentation impact. Roll back when a declared rollback
   criterion is met.
9. Report outcome, evidence class, failed or skipped checks, residual risk,
   rollback availability, and the next safe action.

Read-only authorization does not imply write, messaging, publishing, or deletion
authority. A request to diagnose does not authorize a fix. A request to
implement does authorize ordinary in-scope file edits and validation, but not a
materially different external action.

## Destructive and Irreversible Actions

Prefer a recoverable alternative. Before proceeding, verify identity and scope
through a read-only check, show the exact targets and consequence, confirm that
backups or recovery are usable, and obtain explicit confirmation. Never use a
home directory, filesystem root, workspace root, unresolved environment
variable, or broad pattern as a recursive destructive target.

Delete or overwrite only content whose ownership is established. After a
material deletion, report what was removed and how it can be recovered. If the
target changes between preflight and mutation, stop and re-plan.

## Failure and Stop Conditions

Stop mutation and preserve the last known good state when:

- scope, ownership, instruction precedence, or authority is ambiguous;
- preconditions, compatibility, dependency, checksum, or collision checks fail;
- the baseline cannot be reproduced for a required optimization claim;
- required validation fails and repair would expand scope;
- rollback is unavailable for a high-risk change without explicit acceptance;
- observed state changes after preflight;
- a budget is exhausted before the acceptance criteria are proven.

Return useful read-only findings and identify the exact decision or authority
needed. Do not describe an incomplete or unmeasured result as complete,
validated, safe, or optimized.

## Repository Change Checklist

- Applicable instructions and working-tree changes inspected.
- Exact owned targets and documentation impact identified.
- Baseline and acceptance criteria recorded.
- Change kept within declared scope.
- Relevant tests, schemas, examples, commands, and links checked.
- Final diff reviewed for secrets, generated noise, stale docs, and unrelated
  edits.
- Evidence, limitations, rollback, roadmap status, and next action updated.
