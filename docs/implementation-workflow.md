# Implementation Workflow and Skill Usage

Status: proposed operating contract; implementation and token impact are not yet validated.

Repository source of truth: [ROADMAP.md](../ROADMAP.md).

## Purpose

Define how a developer turns a task into a validated code change, which capabilities run automatically, which skills require explicit invocation, the expected prompt and response formats, and how the workflow controls token usage.

## Entry-Point Decision

Create `implement-task` as the explicit top-level workflow for end-to-end implementation.

Invoke it in Codex with:

```text
$implement-task
```

Configure it with `allow_implicit_invocation: false`. End-to-end orchestration can load several workflows and should not start accidentally from every coding request.

`implement-task` is a workflow orchestrator, not a fourth domain router. It owns task intake, route selection, implementation, validation, and completion reporting. It delegates specialist reasoning only when the task requires it.

## Codex Activation Model

Codex supports two skill activation paths:

1. **Explicit:** mention a skill with `$skill-name` in Codex CLI or the IDE extension, or select it through `/skills`.
2. **Implicit:** Codex may select a skill when the request matches its `description`.

Implicit invocation is enabled by default. A skill can disable it in `agents/openai.yaml`:

```yaml
policy:
  allow_implicit_invocation: false
```

Codex initially receives skill names and descriptions, then loads the full `SKILL.md` only for selected skills. A `policies/` directory is an organizational convention, not an automatic Codex instruction source. Policies become automatic only after an installer activates a compact selected set in a supported durable-instruction surface.

Skill-to-skill routing is part of this repository's orchestration contract, not a platform guarantee. Validate automatic routing before relying on it for critical work. Until validated, explicit invocation remains the predictable path.

## Recommended Invocation Policy

| Capability | Type | Invocation | Reason |
| --- | --- | --- | --- |
| Selected repository policies | Policy | Automatic after installation | Small cross-cutting constraints |
| `implement-task` | Workflow orchestrator | Explicit only | Prevent accidental multi-skill cost |
| `engineering-discovery` | Router | Implicit for narrow design triggers; explicit when certainty matters | Used before a solution exists |
| `backend-review` | Router | Implicit for review requests; routed after medium/high-risk changes | Reviews existing artifacts |
| `optimize-engineering` | Router | Implicit only for explicit optimization intent | Requires a target and baseline |
| `security-review` | Workflow | Implicit for security-review requests; risk-routed by `implement-task` | High-impact specialist validation |
| `test-change` | Workflow | Implicit for test-design requests; conditionally routed | Avoid loading it merely to run existing tests |
| `refactor-safely` | Workflow | Implicit for explicit refactoring intent | Behavior-preserving change contract |
| `generate-adr` | Workflow | Explicit or routed after durable decisions | Not every discovery requires an ADR |
| `generate-docs` | Workflow | Explicit or routed after user-facing behavior changes | Avoid unnecessary documentation output |

## End-to-End Implementation Flow

```text
Installed policies
      ↓
$implement-task
      ↓
Task intake and repository inspection
      ↓
Route by uncertainty, risk, and acceptance criteria
      ↓
Optional discovery / ADR
      ↓
Smallest sufficient implementation
      ↓
Tests and objective validation
      ↓
Conditional backend / security review
      ↓
Conditional measured optimization
      ↓
Evidence-based completion report
```

### 1. Intake

Extract:

- Goal and user-visible outcome.
- Acceptance criteria.
- Existing behavior and relevant repository context.
- Constraints and out-of-scope work.
- Risk signals.
- Required validation.
- Requested depth and budget.

Inspect repository instructions and code before asking questions. Ask only when a missing decision materially changes the implementation or requires additional authority.

### 2. Route

| Condition | Capability |
| --- | --- |
| Clear local change with accepted design | Continue directly |
| Solution does not exist or architecture/technology choice is unresolved | `engineering-discovery` |
| Authentication, authorization, secrets, untrusted input, sensitive data, cryptography, or permissions | `security-review` |
| Tests require new strategy, fixtures, or coverage design | `test-change` |
| Behavior-preserving cleanup is the primary goal | `refactor-safely` |
| Durable architectural decision | `generate-adr` |
| Public API, configuration, operational procedure, or user behavior changed | `generate-docs` |
| Existing diff needs broad quality assessment | `backend-review` |
| Performance, cost, capacity, pipeline time, or algorithmic efficiency is an explicit goal | `optimize-engineering` |

Do not invoke every capability. Select the smallest route that can satisfy the task safely.

### 3. Discover When Necessary

Discovery returns goal, constraints, alternatives, evidence, trade-offs, recommendation, validation experiment, risks, and reversibility. It does not implement unless the user expands the scope.

Skip discovery when the task and solution are already clear.

### 4. Implement

- Preserve existing behavior outside task scope.
- Follow installed policies and repository conventions.
- Apply the smallest sufficient change.
- Avoid unrelated refactors.
- Keep changes reviewable and reversible.
- Report blockers rather than silently expanding scope.

### 5. Validate

- Run the narrowest relevant existing checks first.
- Add or change tests only when behavior or risk requires them.
- Expand validation in proportion to impact.
- Capture decisive evidence instead of dumping logs.
- Compare before and after results for optimization work.

### 6. Review Conditionally

- Low-risk, mechanical change: self-check and targeted validation may be enough.
- Medium/high-risk change: route through `backend-review`.
- Security-sensitive change: route through `security-review` regardless of size.
- Review findings must cite code, tests, logs, documentation, or measured evidence.

### 7. Complete

Return outcome first, then evidence. Do not claim completion while required checks remain unresolved.

## Prompt Contract

### Minimal Prompt

```text
$implement-task

Task: <what must change>
Done when:
- <observable acceptance criterion>
```

Codex inspects the repository and infers routine context. This is the preferred format for clear, low-risk tasks.

### Standard Prompt

```text
$implement-task

Task: <what must change>
Goal: <why it matters>
Context:
- <ticket, files, current behavior, logs, or links>
Acceptance criteria:
- <observable result>
- <required compatibility>
Constraints:
- <technology, policy, time, or compatibility constraint>
Out of scope:
- <explicit exclusions>
Validation:
- <required tests, benchmark, or manual check>
Depth: standard
```

### Depth Modes

| Depth | Behavior | Relative token cost |
| --- | --- | --- |
| `fast` | Clear low-risk change, narrow validation, no optional workflow | Low |
| `standard` | Implementation, relevant tests, conditional targeted review | Medium; default |
| `thorough` | Discovery and specialist review when relevant, broader validation | High |

Depth does not bypass security, irreversible-action confirmation, or required repository checks.

### Prompt Overrides

Use explicit routing when desired:

```text
$implement-task
Task: Implement TASK-123.
Depth: standard.
Skip architecture discovery because the approved design is linked in docs/design.md.
Run security review because this changes authorization.
Do not optimize unrelated code.
```

User instructions override optional automatic routing but cannot remove platform safety constraints.

## Focused Prompt Patterns

### Discovery Only

```text
$engineering-discovery

Goal: Add asynchronous order processing.
Constraints: PostgreSQL remains the source of truth; no new managed service without cost evidence.
Compare alternatives, trade-offs, failure modes, and migration paths. Recommend a validation experiment. Do not implement.
```

### Review Only

```text
$backend-review

Review the current diff. Prioritize correctness, regressions, security boundaries, operational risk, and missing tests. Report only actionable findings with evidence.
```

### Security Review

```text
$security-review

Review the current authentication changes. Trace trust boundaries, authorization checks, input validation, secret handling, failure behavior, and tests. Cite evidence for every finding.
```

### Optimization

```text
$optimize-engineering

Target: Reduce endpoint p95 latency.
Baseline: 420 ms under the attached workload.
Constraint: Preserve response contract and database semantics.
Measure before and after. Treat unmeasured ideas as hypotheses.
```

### Safe Refactoring

```text
$refactor-safely

Simplify the payment orchestration module without changing observable behavior. Establish characterization tests first, keep steps reviewable, and report remaining risks.
```

## Response Contract

### Initial Response

Keep it short:

- Understood outcome.
- Relevant assumptions or blocking gaps.
- Selected route and why.
- Validation plan.
- Material risks.

Do not repeat the full task or expose internal chain-of-thought.

### Progress Updates

Report only meaningful state changes:

- Repository context discovered.
- Route changed because of evidence.
- Implementation completed.
- Validation result.
- Blocker requiring authority or user choice.

### Final Response

Use this order:

1. **Outcome:** what now works.
2. **Changed:** important files or behavior.
3. **Validation:** tests, checks, benchmarks, and results.
4. **Review:** risks assessed and specialist workflows used.
5. **Evidence:** measured, observed, documented, inferred, or assumed.
6. **Remaining:** unresolved risks or safe next action.

Keep final responses proportional to task complexity.

## Token Consumption Model

### What Is Always Loaded

- System and session instructions.
- Repository instructions such as activated policies.
- Skill names and descriptions available to Codex.

Official Codex behavior limits the initial skills list to at most 2% of the model context window, or 8,000 characters when context size is unknown. If many skills are installed, descriptions may be shortened and some skills may be omitted from the initial list.

### What Loads Conditionally

- Full `SKILL.md` only for selected skills.
- References only when the selected workflow needs them.
- Scripts execute without requiring their full source to remain in prompt context unless inspection is necessary.

### Expected Routes

| Route | Typical loaded capability bodies | Relative cost |
| --- | --- | --- |
| Fast implementation | `implement-task` | Low |
| Standard implementation | `implement-task` plus one targeted workflow when needed | Medium |
| Architecture-heavy task | `implement-task`, `engineering-discovery`, optional `generate-adr`, targeted review | High |
| Security-sensitive task | `implement-task`, `security-review`, relevant tests, backend review when needed | High but justified |
| Optimization task | `implement-task` or `optimize-engineering`, selected reference, benchmark evidence | Variable and potentially high |

Do not promise exact token savings before evaluation. Measure total tokens per completed task, correction turns, latency, and success rate against a no-skill baseline.

### Token-Control Rules

- Keep `implement-task` explicit-only.
- Keep selected policies within the repository budget.
- Use narrow descriptions with positive and negative triggers.
- Skip discovery for clear accepted designs.
- Run existing tests without loading `test-change` unless test design is needed.
- Use full review only for review intent or meaningful risk.
- Load optimization only for explicit measurable goals.
- Generate ADRs and documentation only when their output will be maintained.
- Filter logs and report decisive failures only.
- Stop when acceptance criteria and required validation are satisfied.

## Helper Quick Reference

| User intent | Invoke |
| --- | --- |
| Deliver a complete task | `$implement-task` |
| Decide what to build | `$engineering-discovery` |
| Review an existing diff | `$backend-review` |
| Review security-sensitive work | `$security-review` |
| Improve a measurable property | `$optimize-engineering` |
| Design or add tests | `$test-change` |
| Refactor without behavior change | `$refactor-safely` |
| Record an architectural decision | `$generate-adr` |
| Generate maintained documentation | `$generate-docs` |

## Validation Requirements

Before marking this operating model as validated:

1. Implement the initial skills and policy installer.
2. Test explicit and implicit activation.
3. Test negative triggers and accidental multi-skill loading.
4. Compare fast, standard, and thorough routes against a no-skill baseline.
5. Measure token usage, latency, completion rate, correction turns, and human preference.
6. Verify that security-sensitive tasks cannot skip required review through a depth override.
7. Update this document and [the roadmap](../ROADMAP.md) with measured results.

## Official References

- [Build skills](https://learn.chatgpt.com/docs/build-skills)
- [Build plugin skills](https://developers.openai.com/plugins/build/skills)
- [Skills concepts](https://developers.openai.com/plugins/concepts/skills)
