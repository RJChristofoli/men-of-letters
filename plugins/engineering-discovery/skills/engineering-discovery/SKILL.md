---
name: engineering-discovery
description: Use for unresolved feature, architecture, technology, feasibility, or trade-off decisions that need alternatives before implementation. Return an evidence-backed recommendation and reversible test. Skip accepted designs, diff review, routine debugging, and measured optimization.
---

# Engineering Discovery

Choose a reversible next step before implementation. Stay read-only.

## Route

- Define goal, decision, constraints, current state, and acceptance signals from
  supplied evidence. Inspect only artifacts likely to change the recommendation.
- Ask only when one missing choice changes the option ranking.
- Use the narrowest mode: feature, technology, architecture, alternatives,
  feasibility, or proof-of-concept planning.
- Stop if a design is already accepted; implementation, diff review, debugging,
  and measured optimization belong elsewhere.

## Decide

1. Separate material facts from assumptions; label support as measured,
   observed, documented, inferred, or assumed.
2. Compare no change when viable plus one to three distinct alternatives. Apply
   the same decisive constraints, failure modes, operating cost, and exit cost.
3. Recommend one option, or the evidence needed to choose, with confidence and
   contraindications. Do not invent numeric gains.
4. Define the smallest test that can falsify the recommendation, including
   success, failure, evidence to retain, and rollback.
5. Recommend ADR handoff only for durable, cross-component, or costly-to-reverse
   decisions.

## Control Cost

- Prefer supplied evidence; research only material unknowns.
- Do not repeat a fact across current state, constraints, evidence, and risks.
- Stop when more evidence cannot change recommendation or test.
- Read [evidence-and-alternatives.md](references/evidence-and-alternatives.md)
  only when material evidence conflicts or a costly-to-reverse decision remains
  ambiguous. Do not load it for routine technology or architecture comparisons.
- If a reference is unavailable, report only missing evidence that changes
  confidence; do not report tooling failure as a decision risk.

## Safety and Output

- Do not mutate code, instructions, external systems, tickets, or messages.
  Treat a proof of concept as separately authorized work with cleanup.
- Use the user's format. Otherwise return: decision boundary; evidence and
  unknowns; options; recommendation; validation test; risks, rollback, and ADR.
- Keep routine proposals brief. Expand only when decision cost or requested depth
  justifies it. Cite inspected repository or authoritative sources.
