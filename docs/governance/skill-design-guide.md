# Skill Design Guide

Status: accepted Phase -1 design contract; effectiveness remains unvalidated
until forward evaluation.

Use this guide for routers and workflows. Policies and references use the same
evidence and maintenance standards but are not represented as independent
skills unless they meet the promotion criteria.

## Start With a Specification

Copy [the capability specification template](../../templates/capability-spec.md)
and resolve its open fields before implementation. A proposal must state:

- the problem, goal, scope, and non-goals;
- positive and negative triggers;
- required inputs, output contract, constraints, and dependencies;
- read/write scope, side effects, approvals, rollback, and stop conditions;
- progressive-disclosure resources;
- baseline, evaluation cases, metrics, and promotion criteria;
- lifecycle status, owner, compatibility, and budgets.

Unknowns must be marked `TBD` with an owner or validation action. Do not convert
an assumed behavior into a requirement merely to complete the template.

## Choose the Smallest Capability Shape

1. Use a policy only for a short cross-cutting constraint that should apply to
   many tasks.
2. Use a router when the primary job is choosing among several paths.
3. Use a workflow for a repeatable operation with a distinct output and
   execution contract.
4. Use a reference when specialist knowledge is needed only inside another
   capability.
5. Use a resource when deterministic data or execution is more reliable than
   prompt instructions.

Do not create a skill for guidance already covered by a selected policy or an
existing workflow. Do not make a router a second implementation layer.

## Write Precise Activation Metadata

The `SKILL.md` frontmatter contains only:

```yaml
---
name: capability-id
description: Use when <positive intent>. Do not use when <nearest negative cases>.
---
```

The name must equal the directory and catalog ID. The description is routing
metadata, not a feature summary. Include observable user intent, important
positive triggers, and the nearest confusing negative trigger. Avoid broad
phrases such as "improve code" or claims such as "best" and "production-ready."

Disable implicit invocation in `agents/openai.yaml` when accidental activation
has meaningful cost or side effects. Explicit-only behavior must be tested; it
must not be assumed from documentation.

## Structure `SKILL.md`

Prefer this order, omitting sections that do not apply:

1. Outcome and boundary.
2. Inputs and prerequisites.
3. Routing or execution workflow.
4. Validation and evidence requirements.
5. Side effects, approvals, rollback, and stop conditions.
6. Conditional references and deterministic resources.
7. Output contract.

Use imperative instructions and decision tables where they shorten real
branching logic. Keep rationale only when it prevents a likely error. Link to a
reference at the point where it becomes necessary and say when to read it.
Never require all references to load up front.

## Design for Safe Execution

Every workflow must satisfy the
[safe-change and execution contract](safe-change.md). Read-only workflows still
declare their inspected systems and privacy boundaries. Mutating workflows
declare exact write scope, authorization, idempotency, partial-failure behavior,
verification, rollback, and destructive-action confirmation.

A workflow stops when its acceptance criteria are met, its budget is exhausted,
a required fact cannot be obtained safely, validation fails without an in-scope
repair, or further work needs new authority. It reports partial results without
claiming completion.

## Design for Evidence and Evaluation

Each capability needs a no-capability baseline and both positive and negative
cases. Select objective checks first: task success, tests, lint, schema checks,
benchmarks, trigger precision, token count, turns, latency, and tool calls. Use
blinded human preference only for subjective output dimensions.

Classify claims as measured, observed, documented, inferred, or assumed. An
optimization requires a reproducible before/after result. A capability advances
through lifecycle states only under the gates in
[versioning-and-lifecycle.md](versioning-and-lifecycle.md).

Keep examples and evaluation cases separate. Forward tests receive raw task
artifacts, not expected answers. Record environment, model or host compatibility,
case version, failures, and regressions so results can be reproduced.

## Control Context and Runtime Cost

- Budget the description, `SKILL.md`, conditional references, tool calls, time,
  and total tokens per completed task.
- Prefer a narrow direct path before specialist routing.
- Avoid repeating policy text or reference content in a skill body.
- Use deterministic scripts for stable parsing, validation, and generation.
- Stop loading material once the route is decided.
- Compare total completion cost and correction turns against the baseline; a
  shorter answer alone is not evidence of efficiency.

## Implementation Readiness Checklist

A skill is ready to implement when its specification has no unresolved item
that changes its public contract or required authority, its owner and pack are
identified, dependencies have compatible contracts, the evaluation suite is
planned, and its affected documentation is known. Implementation does not make
the capability validated; only recorded evaluation evidence can do that.
