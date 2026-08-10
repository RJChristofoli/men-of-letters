Add a payment-provider webhook to an existing payments module. The provider
retries deliveries until a 2xx response, signs each request, and supplies a
stable `event_id`. The module already owns payment state and exposes the current
public payment contract. Duplicate processing can charge twice.

Describe the implementation defaults to apply. Return JSON matching the supplied
schema. Do not browse or run tools. Do not claim performance improvement.
