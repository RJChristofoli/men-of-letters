---
name: research-solution
description: Research and compare technical approaches, libraries, platforms, architecture options, and feasibility before implementation. Use when a decision depends on current external facts, authoritative sources, alternatives, or a reversible experiment. Skip accepted designs, routine debugging, code implementation, and diff review.
---

# Research Solution

Produce an evidence-backed recommendation without mutating the repository or
external systems.

## Frame the Decision

1. Define the desired outcome, actual decision, decisive constraints, current
   state, and acceptance signals.
2. Inspect supplied repository evidence before expanding the research surface.
3. Ask only when one missing choice can change the option ranking.

## Research

- Research only facts that may change the recommendation or validation test.
- Prefer primary and authoritative sources for compatibility, security,
  licensing, support, and product behavior.
- Verify temporally unstable claims instead of answering from memory.
- Separate measured, observed, documented, inferred, and assumed support.
- Stop when another source cannot change the ranking or next experiment.

## Compare and Decide

1. Include no change when viable and compare one to three distinct alternatives.
2. Apply the same decisive criteria, failure modes, operating cost, migration
   burden, and exit cost to every option.
3. Recommend one option with confidence, trade-offs, and contraindications, or
   state exactly which evidence is still required.
4. Define the smallest reversible test that can falsify the recommendation,
   including success, failure, retained evidence, cleanup, and rollback.

Read [evidence-and-alternatives.md](references/evidence-and-alternatives.md) only
when evidence conflicts or a costly-to-reverse decision remains ambiguous.

## Report

Use the user's requested format. Otherwise lead with the recommendation, then
present decision boundary, decisive evidence, alternatives, validation test,
risks, and rollback. Cite inspected repository artifacts and external sources
near the claims they support.
