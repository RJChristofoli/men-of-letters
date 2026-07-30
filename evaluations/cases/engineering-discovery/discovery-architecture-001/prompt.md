Design the next step for this engineering problem. Return a decision proposal,
not implementation.

A two-engineer team runs a Node.js monolith backed by PostgreSQL. Customers can
request audit reports. Report generation currently runs inside the HTTP request,
takes between 20 seconds and 4 minutes, and causes request timeouts and repeated
work when clients retry. PostgreSQL is the source of truth, Redis is already used
for ephemeral caching, and the team cannot adopt a new managed service this
quarter. Reports must not be lost, duplicate delivery is tolerable if recorded,
and operators need to determine why a report failed.

Compare at least doing nothing with mitigations, a PostgreSQL-backed job design,
and a Redis-backed queue. Mention another alternative only if it changes the
decision. Separate documented or observed facts from assumptions, identify when
each option is contraindicated, recommend a reversible validation experiment,
and avoid fabricated numerical gains. State whether the decision deserves an
ADR. Return only JSON matching the supplied schema.
