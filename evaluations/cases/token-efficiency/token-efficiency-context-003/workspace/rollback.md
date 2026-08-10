# Current rollback

Redeploy `api@2.4.0`. Database changes are additive and backward-compatible.
Trigger rollback when the five-minute 5xx rate exceeds 1% or contract checks
fail.
