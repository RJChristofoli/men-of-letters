---
name: debug-problem
description: Diagnose software failures, regressions, incorrect behavior, flaky tests, and performance problems when the cause is unknown or root-cause discovery is the primary task. Use to investigate, reproduce, explain, or, when authorized, fix a bug after establishing a supported cause. If the cause and intended correction are already known, use implement-change. Stay read-only for diagnosis-only requests; skip design analysis, diff review, and open-ended technology research.
---

# Debug Problem

Find the earliest supported cause before choosing a fix.

## Set the Boundary

1. Capture the reported symptom, expected behavior, affected environment and
   version, frequency, timing, and available reproduction evidence.
2. Determine whether the request authorizes diagnosis only or diagnosis plus fix.
3. Read repository instructions, inspect the working tree, and preserve existing
   user changes.
4. Trace only paths that can explain the observed failure. Do not turn debugging
   into a general audit or architecture redesign.

Diagnosis-only is read-only for the repository and external systems. Use existing
logs, metrics, traces, tests, and configuration. Do not add instrumentation,
change persistent configuration, replay production traffic, or mutate real data
without explicit authorization. Prefer an isolated local reproduction with
sanitized or synthetic data.

## Evidence Gate

Keep these states distinct:

- **Observation:** directly reproduced or present in logs, tests, traces, metrics,
  configuration, or code behavior.
- **Hypothesis:** possible explanation not yet established.
- **Probable cause:** best-supported explanation, but material alternatives or a
  decisive validation remain.
- **Confirmed cause:** identifies the earliest incorrect state or violated
  invariant and is supported by reproduction or converging evidence while
  credible competing hypotheses have been rejected.

Do not present a hypothesis or probable cause as root cause. State confidence and
the smallest discriminating check when confirmation is unavailable. Do not apply
a risky or broad fix based only on an unconfirmed explanation.

## Investigate

1. Reproduce safely when practical; otherwise state the exact missing evidence.
2. Trace input, state transitions, side effects, and output through the failing
   path. Locate the earliest divergence from expected behavior.
3. Rank hypotheses from existing evidence and test the cheapest high-information
   discriminator first.
4. Use focused logs, tests, history, configuration, existing instrumentation, or
   instrumentation confined to an authorized temporary reproduction to reject
   alternatives rather than collecting evidence only for the leading idea.
5. Check asynchronous delivery, transactions, caches, authorization, concurrency,
   resource bounds, and external dependencies only where they intersect the flow.

For flaky behavior, control or record seed, clock, ordering, concurrency, retries,
and environment; repeat enough to distinguish a real pattern without inventing a
failure rate. For performance, measure a representative baseline and separate CPU,
memory, I/O, locking, network, and dependency latency before attributing cause.

## Resolve

- For diagnosis-only requests, do not edit files. Report confirmed or probable
  cause, supporting and conflicting evidence, and the next discriminating check.
- When a fix is authorized and the cause is supported, state affected components,
  preserve unrelated work, and apply the smallest compatible correction.
- If the correction expands public behavior, compatibility, ownership, operational
  impact, or blast radius beyond the request, obtain authorization before editing
  that surface.
- Add a regression check that fails for the original cause when meaningful and
  feasible. Avoid hidden retries, symptom suppression, random edits, and broad
  rewrites.

## Verify and Report

Re-run the original failure path and relevant adjacent behavior. Lead with the
confirmed cause or fixed outcome. Cite concrete evidence and distinguish passed,
failed, skipped, and inconclusive checks. State residual uncertainty, environment
limits, and whether the observed evidence proves causation or only correlation.
