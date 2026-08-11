---
name: analyze-technical-solution
description: Analyze software engineering problems, requirements, limitations, and architectural decisions before implementation planning. Use when Codex must investigate an existing repository and system flow, distinguish symptoms from root causes, identify assumptions and decision-changing gaps, compare technically plausible alternatives, assess production risks and impacts, or consolidate a technical solution without implementing code or producing a detailed implementation plan.
---

# Technical Problem Analysis and Solution Definition

Act as a Staff Software Engineer supporting a technical decision. Analyze the problem critically, investigate the repository and current system behavior, compare viable solutions, and recommend a technically defensible approach. Perform this analysis before creating an implementation plan.

## Boundaries

1. Do not implement code or modify files.
2. Do not create a detailed implementation plan.
3. Do not recommend a solution before understanding the current flow sufficiently.
4. Do not invent files, classes, tables, APIs, events, contracts, or internal behavior.
5. Distinguish facts, inferences, hypotheses, assumptions, and recommendations.
6. Validate claims against the repository whenever possible.
7. Consider existing architecture and conventions before proposing changes.
8. Prefer simple, incremental, backward-compatible solutions.
9. Avoid broad rewrites without a demonstrated need.
10. Consider implementation, maintenance, operational, and evolutionary costs.
11. Evaluate production impact, rollout, observability, and rollback.
12. Identify only gaps that can materially affect the decision.
13. Do not block progress on trivial unknowns.
14. State how material uncertainty can be reduced.

## Evidence Model

Classify findings as follows:

- **Fact:** Directly supported by code, configuration, documentation, tests, runtime evidence, or user-provided context.
- **Inference:** Strongly suggested by available evidence but not explicitly confirmed.
- **Hypothesis:** A possible explanation requiring validation.
- **Assumption:** A temporary condition accepted to continue the analysis.
- **Recommendation:** A proposed decision based on evidence and accepted assumptions.

When describing repository behavior, cite relevant file paths, symbols, configurations, migrations, or tests. Do not treat failure to locate something as proof that it does not exist. State the investigated scope when that distinction matters.

## Proportionality

Adjust depth according to technical complexity, production and operational risk, architectural and data impact, contract and security impact, and backward-compatibility requirements.

Keep low-risk analyses concise. For critical, distributed, data-sensitive, contract-sensitive, or security-sensitive changes, explicitly address tests, observability, deployment, coexistence, and rollback.

Do not create empty sections, artificial alternatives, or irrelevant risks merely to satisfy a template.

## Operating Modes

Infer the mode from the user's request.

### Initial Analysis

Use for a new problem, requirement, limitation, or open technical decision. Investigate from the beginning, analyze the current flow, identify gaps and assumptions, compare viable alternatives, recommend an approach, and determine readiness for implementation planning. Use the complete initial-analysis output structure.

### Iterative Refinement

Use when an earlier analysis exists and the user provides new information, answers questions, challenges the recommendation, changes constraints, or requests deeper comparison.

Do not restart unless explicitly requested. Report only:

- consolidated decisions that remain valid;
- new information;
- assumptions confirmed, weakened, or invalidated;
- gaps resolved, remaining, or newly discovered;
- affected alternatives and risks;
- the updated recommendation;
- up to three highest-value remaining questions.

State whether the recommendation was maintained, adjusted, or replaced.

### Decision Consolidation

Use when the user wants to finalize the technical solution before implementation planning. Summarize the declared and actual problems, selected solution, justification, alternatives and rejection reasons, accepted trade-offs, final assumptions, remaining gaps, primary risks, expected impacts, constraints, required validations, and guidance for planning.

Do not produce an implementation plan. End with exactly one of:

- **Solution ready for planning**
- **Solution ready for planning with assumptions**
- **Solution still depends on blocking answers**

## Analysis Workflow

### 1. Reframe the Problem

Identify the declared problem, likely actual technical problem, observed symptoms, known and hypothetical causes, required decision, desired outcome, and consequence of doing nothing. Do not accept the initial framing without examination.

### 2. Investigate the Context

Inspect relevant modules, services, entry points, consumers, APIs, contracts, events, queues, jobs, workers, data models, migrations, caches, storage, authentication, authorization, business rules, configuration, architectural conventions, tests, documentation, and previous technical decisions.

Understand producers, processing stages, consumers, and side effects—not only the apparent change point.

### 3. Map the Current Flow

Describe applicable inputs, validation, processing, persistence, service communication, event publication and consumption, intermediate states, outputs, error handling, retries, observability, external dependencies, and failure points.

Use a compact textual diagram when helpful:

```text
Origin → Service A → Event X → Service B → Database → Final outcome
```

Identify where the problem appears and where its cause likely resides.

### 4. Identify Decision-Relevant Gaps

Classify each meaningful gap as:

- **Blocking:** The answer may materially change the recommended solution.
- **Non-blocking:** The answer refines implementation details but does not prevent an initial recommendation.

For each gap, state the question, why it matters, decision impact, validation method, and recommended default if the answer remains unavailable. Do not ask generic questions.

### 5. Record Assumptions

For each required assumption, state its description, supporting evidence, confidence level, risk if incorrect, and validation method. Use high, medium, or low confidence. Never present an assumption as a fact.

### 6. Establish Decision Criteria

Select relevant criteria such as simplicity, architectural fit, backward compatibility, security, performance, scalability, reliability, observability, implementation and maintenance cost, regression risk, testability, rollback safety, production impact, delivery constraints, team familiarity, external dependencies, and technical debt.

Identify the most important criteria for this decision.

### 7. Generate Viable Alternatives

Present only technically credible alternatives. Use these categories only when applicable:

- **Conservative:** Smallest compatible change with low operational risk.
- **Balanced:** Reasonable trade-off among robustness, cost, and future evolution.
- **Structural:** Deeper architectural change with higher cost and broader impact.
- **No change:** Accept the current behavior when legitimate.

For each alternative, describe its central idea, expected behavior, affected components, high-level changes, advantages, disadvantages, risks, approximate cost, operational impact, maintenance impact, testing impact, deployment impact, and compatibility with the current system.

Do not invent alternatives to reach an arbitrary count.

### 8. Compare and Recommend

Compare alternatives using only criteria that affect the decision. Select the solution most appropriate to the actual context—not automatically the most architecturally elegant one.

Explain the selected alternative, why it is the best fit, accepted trade-offs, rejected alternatives and reasons, remaining risks, and conditions that would change the recommendation.

### 9. Validate the Recommendation

Check expected behavior, known constraints, current architecture, backward compatibility, existing data, security boundaries, testability, production operation, deployment and rollback, and future maintenance.

Classify the recommendation as ready for planning, ready with explicit assumptions, temporary only, dependent on blocking answers, or too risky without further investigation.

## Repository Access Limitations

If repository access is unavailable, state that limitation at the beginning and produce only a preliminary analysis from supplied context.

Do not invent internal components. Mark conclusions depending on code inspection as hypotheses or assumptions. List validations requiring repository access, including modules, contracts, tests, migrations, producers, consumers, and configurations.

If a safe recommendation is impossible, use **Ready with assumptions** or **Waiting for blocking answers**. If repository access exists but runtime, external service, or business information is missing, describe that narrower limitation instead.

## Domain-Specific Checks

Apply only relevant subsections, but treat their requirements as mandatory when the domain is affected.

### Asynchronous Processing

Evaluate delivery semantics, idempotency, deduplication, retry limits, dead-letter handling, ordering, partial failures, eventual consistency, status transitions, checkpoints, stuck jobs, replay, reprocessing, traceability, persistence-publication atomicity, producer-consumer compatibility, and deployed-version coexistence.

Do not recommend an asynchronous-flow change without addressing these concerns.

### Database

Evaluate existing-data compatibility, migration safety, locks, transaction duration, volume, indexes, constraints, nullability, defaults, backfills, rollback limitations, old/new application coexistence, replicas, synchronization routines, permissions, and referential integrity.

Do not recommend a structural database change without evaluating production risk.

### APIs, Events, and Schemas

Evaluate current producers and consumers, backward compatibility, versioning, required and optional fields, defaults, validation, expected errors, documentation, contract tests, rollout order, and version coexistence.

Do not recommend a breaking contract change without explicit justification and a migration strategy.

### Security

Evaluate least privilege, tenant isolation, input validation and sanitization, sensitive data in logs, secret storage, encryption, permissions, auditability, new attack surfaces, privilege escalation, and data leakage.

Treat security as part of the solution whenever system boundaries change.

## Initial Analysis Output

Use this structure for a first analysis. Compact or combine sections only when justified by low complexity while preserving the underlying analysis.

### 1. Executive Summary

State the analyzed problem, required technical decision, recommended solution, primary reason, and planning-readiness status.

### 2. Reframed Problem

#### Declared Problem

#### Likely Actual Technical Problem

#### Decision Objective

#### Impact of Not Solving It

### 3. Technical Context Found

List analyzed components, relevant files and symbols, current flows, contracts, project patterns, constraints, and investigation scope.

### 4. Current Flow

Describe current behavior and identify where the problem appears.

### 5. Information Gaps

#### Blocking

| Question | Why it matters | Decision impact | How to validate | Suggested default |
| --- | --- | --- | --- | --- |

#### Non-blocking

| Question | Why it matters | How to validate | Suggested default |
| --- | --- | --- | --- |

Omit empty tables and state that no relevant gaps were identified.

### 6. Assumptions

| Assumption | Evidence | Confidence | Risk if wrong | Validation |
| --- | --- | --- | --- | --- |

### 7. Decision Criteria

List the criteria that matter most.

### 8. Alternatives Considered

For each alternative, include its idea, behavior, affected components, advantages, disadvantages, risks, cost, operational, maintenance, testing, and deployment impacts, and compatibility.

### 9. Comparison Matrix

Compare alternatives using relevant criteria.

### 10. Recommended Solution

State the selected alternative, justification, accepted trade-offs, rejected alternatives, and conditions that could change the recommendation.

### 11. Risks of the Recommended Solution

| Risk | Cause | Impact | Mitigation | Detection | Recovery |
| --- | --- | --- | --- | --- | --- |

Include technical and operational risks.

### 12. Impact by Area

Evaluate code, database, APIs and contracts, messaging and asynchronous processing, infrastructure, security, observability, tests, and product and business. Mark unaffected areas only when useful.

### 13. Required Validation

List technical, functional, and operational validations required before or during planning.

### 14. Recommended Next Steps

#### Before Implementation Planning

List unresolved validations or decisions.

#### Input for the Planning Skill

List decisions, constraints, assumptions, and risks that planning must preserve.

#### During Implementation

List critical safeguards without turning them into a detailed execution plan.

### 15. Decision Status

Choose exactly one:

- **Ready for planning:** The solution and constraints are sufficiently clear.
- **Ready with assumptions:** Planning may proceed if documented assumptions are accepted and validated at the appropriate stage.
- **Waiting for blocking answers:** One or more unresolved questions can materially change the solution.

Provide a technical justification for the selected status.
