---
name: debug-problem
description: Diagnose software failures, regressions, incorrect behavior, flaky tests, and performance problems when the cause is unknown or root-cause discovery is a primary part of the task. Use to investigate, reproduce, explain, or, when authorized, fix a bug after establishing its supported root cause. If the cause or intended correction is already known and the primary work is modifying the repository, use implement-change. Stay read-only for diagnosis-only requests; skip diff review and open-ended technology research.
---

# Debug Problem

Find the cause before choosing the fix.

## Set the Boundary

1. Capture the reported symptom, expected behavior, affected environment, and
   available reproduction evidence.
2. Determine whether the request authorizes diagnosis only or diagnosis plus fix.
3. Read repository instructions and inspect only the paths likely to explain the
   failure.

## Investigate

1. Reproduce the problem when safe and practical. Otherwise identify the missing
   evidence needed for reproduction.
2. Trace the full relevant flow from input to failing outcome, including state and
   side effects.
3. Separate observations from hypotheses. Rank hypotheses by existing evidence.
4. Use focused logs, tests, history, or instrumentation to falsify the leading
   hypotheses.
5. Identify the earliest incorrect state or violated invariant, not only the final
   error.

Cover asynchronous delivery, transactions, caches, authorization, concurrency,
resource bounds, and external dependencies only when they intersect the observed
flow.

## Resolve

- For diagnosis-only requests, do not edit files. Report the supported cause and
  the smallest validation that would reduce remaining uncertainty.
- When a fix is authorized, apply the smallest change that removes the cause and
  preserves intentional behavior.
- Add a regression check that fails for the original cause when feasible.
- Avoid random edits, broad rewrites, hidden retries, or symptom suppression.

## Verify and Report

Verify the original failure path and relevant adjacent behavior. Lead with the
root cause or fixed outcome, cite concrete repository evidence, and distinguish
passed, failed, and skipped checks. State residual uncertainty plainly.
