<!-- owner: RJChristofoli; priority: domain-defaults; conflicts: architecture,naming,production-readiness -->
# Backend Defaults

For backend changes, preserve public contracts and data; validate untrusted input
and authorization. Define failure handling, idempotency, and observability where
external or asynchronous effects require them. Prefer existing boundaries and
domain names; add layers only for a demonstrated need. Avoid obvious unbounded
work, but require measurement before claiming optimization. Yield to repository
contracts and higher-priority policies.
