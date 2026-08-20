---
name: analyze-technical-solution
description: Analyze repository-centered requirements, limitations, system flows, and technical decisions before implementation planning. Use when the recommendation depends primarily on understanding the existing system, distinguishing the declared problem from the actual decision, comparing viable changes, and assessing impacts without editing files. Use debug-problem for unknown failure causes and research-solution when current external evidence determines the choice.
---

# Analyze Technical Solution

Produce a repository-grounded technical decision without implementing code or
writing a detailed implementation plan.

## Boundaries and Routing

- Remain read-only. Do not modify files, external systems, or production state.
- Investigate before recommending. Do not invent internal components, contracts,
  behavior, constraints, or numeric estimates.
- Use this skill when current architecture and repository behavior are the primary
  evidence. Use `debug-problem` when the task is to find an unknown cause of a
  failure. Use `research-solution` when current vendor, library, standards,
  licensing, compatibility, or other external facts determine the ranking.
- Analyze only gaps, alternatives, risks, and impacts capable of changing the
  decision. Do not turn analysis into a detailed task sequence.

## Evidence

Keep decision-relevant claims distinct:

- **Fact:** directly supported by repository evidence, runtime evidence, or user
  context.
- **Inference:** strongly suggested by facts but not explicitly confirmed.
- **Hypothesis:** possible explanation requiring validation.
- **Assumption:** temporary condition accepted to continue.
- **Recommendation:** proposed decision derived from evidence and assumptions.

Cite relevant paths, symbols, contracts, tests, migrations, configuration, or
runtime evidence. Label uncertainty where it changes confidence; do not prefix
every sentence mechanically. Failure to locate evidence is not proof of absence.

## Analyze

1. Reframe the request: separate declared problem, actual decision, desired
   observable outcome, constraints, and cost of no change.
2. Trace the smallest complete current flow needed for the decision: inputs,
   validation, state, persistence, communication, side effects, outputs, errors,
   and consumers. Inspect unchanged code only when it supports that flow.
3. Identify the earliest relevant constraint or decision point. Distinguish current
   behavior from desired behavior.
4. Record only material information gaps. A gap is blocking when its answer can
   change the selected solution; otherwise choose a reasonable default, state it
   as an assumption, and continue.
5. Compare the smallest set of materially distinct, technically viable options.
   Include no change only when credible. Apply the same decisive criteria to each
   option and do not create alternatives to fill a template.
6. Recommend the best fit for the current system. Explain accepted trade-offs,
   rejected options, conditions that would change the decision, and the smallest
   validation needed before planning.

Prefer incremental and backward-compatible solutions unless evidence justifies a
structural change. Consider implementation and maintenance cost, reliability,
security, compatibility, testability, observability, rollout, and rollback only
where they affect the decision.

## Risk-Specific Checks

Apply these checks only when the analyzed path includes the domain:

- **Async:** delivery semantics, idempotency, retries, ordering, partial failure,
  replay, traceability, and producer-consumer version coexistence.
- **Database:** existing data, constraints, locks, volume, backfill, migration and
  rollback safety, indexes, and old/new application coexistence.
- **APIs, events, and schemas:** producers, consumers, optionality, defaults,
  validation, versioning, compatibility, contract tests, and rollout order.
- **Security:** trust boundaries, least privilege, tenant isolation, sensitive
  data, input validation, authorization, auditability, and new attack surfaces.

Do not dump a checklist. Report only checks that influence the recommendation or
required validation.

## Operating Modes

- **Initial analysis:** investigate current flow, compare viable options, recommend
  one, and assign decision status.
- **Iterative refinement:** preserve valid prior decisions and report only changed
  evidence, assumptions, gaps, alternatives, risks, recommendation, and status.
- **Decision consolidation:** summarize final choice, trade-offs, assumptions,
  constraints, risks, and required validation without producing an implementation
  plan.

## Report

Use the user's requested format. Otherwise lead with the recommendation and
decision status, then cover:

1. current flow and decisive evidence;
2. material gaps and assumptions;
3. viable alternatives and why one wins;
4. material risks, impacts, and required validation;
5. constraints that later planning must preserve.

Combine sections for low-risk decisions. Use more detail only when production,
data, security, distributed behavior, compatibility, or costly reversal warrants
it. End with exactly one status in the user's language:

- **Ready for planning:** solution and constraints are sufficiently supported.
- **Ready for planning with assumptions:** planning may proceed if stated
  assumptions are accepted and validated at the appropriate stage.
- **Blocked by decision-relevant gaps:** unresolved answers can materially change
  the solution.
