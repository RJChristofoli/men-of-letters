---
name: research-solution
description: Research and compare technical approaches, libraries, platforms, architecture options, and feasibility when a decision materially depends on current external evidence such as documented behavior, compatibility, vendor capabilities, standards, licensing, support, or cost. Use authoritative sources and isolated reversible experiments when documentation cannot resolve a decisive uncertainty. Skip repository-centered design analysis, accepted designs, routine debugging, code implementation, and diff review.
---

# Research Solution

Produce an evidence-backed recommendation without mutating the repository or
external systems.

## Frame the Decision

1. Define the desired outcome, actual decision, decisive constraints, current
   state, and acceptance signals.
2. Inspect supplied repository evidence before expanding the research surface.
3. Separate questions answerable from the repository from those requiring current
   external evidence. Use `analyze-technical-solution` when the repository is the
   primary decision source.
4. Ask only when one missing choice can materially change option ranking.

## Build the Evidence

- Research only claims capable of changing the recommendation or required
  validation.
- Prefer primary and authoritative sources for compatibility, security, licensing,
  support, pricing, standards, and product behavior.
- Record applicable version, publication or retrieval date, environment, and
  scope for temporally unstable or version-sensitive claims.
- Keep documented facts, observed measurements, inferences, and assumptions
  distinct. Do not convert vendor claims into observed results.
- Resolve material source conflicts or state which uncertainty remains. Read
  [evidence-and-alternatives.md](references/evidence-and-alternatives.md) when
  evidence conflicts or costly reversal keeps the decision ambiguous.

Stop researching when decisive claims have suitable support, relevant conflicts
are resolved or recorded, and more evidence would not change the option ranking or
next validation.

## Compare and Decide

1. Compare the smallest set of materially distinct viable options. Include no
   change when credible; do not invent or exclude an option to meet a fixed count.
2. Apply the same decisive criteria, failure modes, operating cost, migration
   burden, maintenance burden, reversibility, and exit cost to every option where
   those dimensions matter.
3. Recommend one option with confidence, trade-offs, contraindications, and
   conditions that would change the ranking. If evidence is insufficient, state
   exactly which fact or observation remains decisive.

## Validate Uncertainty

Do not invent an experiment when authoritative documentation already resolves the
decision. When ranking depends on uncertain empirical behavior, define or run the
smallest falsifiable and reversible test.

Run experiments only in an isolated temporary workspace with synthetic or
sanitized data. Do not mutate the repository, production, accounts, or external
services. If decisive validation requires broader effects, describe it for later
authorized execution instead of running it as research. State hypothesis,
representative scope, success and failure signals, stop condition, retained
evidence, cleanup, rollback, and the decision following each result.

## Report

Use the user's requested format. Otherwise lead with the recommendation, then
present the decision boundary, decisive evidence with nearby citations,
alternatives, confidence, material risks, and rollback or exit path. Include an
experiment only when unresolved empirical uncertainty requires one. Distinguish
facts established for the applicable version from assumptions requiring later
validation.
