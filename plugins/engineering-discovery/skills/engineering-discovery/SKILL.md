---
name: engineering-discovery
description: Use when an engineering feature, architecture, technology, feasibility, or trade-off decision lacks an accepted solution and needs evidence-backed alternatives before implementation. Produces a decision proposal and validation experiment. Do not use for implementing an accepted design, reviewing an existing diff, routine debugging, or optimizing without a measured target.
---

# Engineering Discovery

Produce a decision proposal, not implementation. Resolve enough uncertainty to
choose a reversible next step without pretending that assumptions are facts.

## Establish the Boundary

- Extract the goal, need, current state, constraints, acceptance criteria, and
  decision owner from the request and available artifacts.
- Inspect relevant repository context and authoritative sources before asking
  questions. Ask only when a missing choice materially changes the decision.
- Select the narrowest mode: feature design, technology research, architecture
  proposal, alternative comparison, trade-off analysis, feasibility discovery,
  or proof-of-concept planning.
- Stop at a decision proposal unless the user explicitly authorizes a proof of
  concept or implementation as a separate mutating task.

Skip this skill when the solution is already accepted and the task is to
implement it. Route existing-diff assessment to review and measured performance
work to optimization.

## Build the Decision

1. Describe the current state from inspected evidence. Separate constraints from
   assumptions and name important unknowns.
2. Classify material claims as measured, observed, documented, inferred, or
   assumed. Scale research depth to decision cost and reversibility.
3. Compare the current path or doing nothing when relevant plus the smallest set
   of genuinely distinct alternatives. Do not pad the list.
4. Evaluate each option against the same constraints. Include benefits,
   trade-offs, failure modes, operational cost, migration effort, reversibility,
   and conditions where the option is contraindicated.
5. Recommend one option or explicitly recommend gathering more evidence. Explain
   why it fits better than the alternatives and state confidence.
6. Describe expected gains qualitatively unless reproducible measurements support
   numbers. Never fabricate precision.
7. Define the smallest experiment that can disprove the recommendation. Include
   success signals, failure signals, scope, cost, rollback, and evidence to keep.
8. Identify risks and decide whether the result needs an ADR handoff because it
   creates a durable, cross-component, or difficult-to-reverse constraint.

Read [evidence-and-alternatives.md](references/evidence-and-alternatives.md) when
evidence quality is disputed, a new technology is being selected, options cross
system boundaries, or the trade-off table needs more rigor. Do not load it for a
simple, well-bounded comparison.

## Apply the Read-Only Contract

- Read only the files, systems, and sources needed for the decision.
- Do not edit code, persistent instructions, external systems, tickets, or
  messages during discovery.
- Treat a proof of concept as a separate scope with explicit write targets,
  validation, cleanup, and rollback.
- Stop when the recommendation is supportable, a required fact is inaccessible,
  alternatives become equivalent under current evidence, or further work needs
  new authority.
- Report missing evidence and partial confidence instead of silently expanding
  scope or claiming completion.

## Return the Proposal

Use the user's requested format. Otherwise return these sections in order:

1. Goal and need.
2. Current state.
3. Constraints and assumptions.
4. Alternatives, including no change when relevant.
5. Evidence and confidence.
6. Trade-offs and contraindications.
7. Recommendation and expected gain.
8. Validation experiment.
9. Risks and reversibility.
10. ADR handoff recommendation.

Keep the answer proportional to decision risk. Cite repository or official-source
evidence where available, label inference explicitly, and make the next action
concrete enough that implementation can begin without replaying the discovery.
