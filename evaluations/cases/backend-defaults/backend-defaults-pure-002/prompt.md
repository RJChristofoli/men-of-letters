Change a private pure formatter inside an existing server module so it trims
trusted, already-validated labels before display. It performs no I/O, changes no
public contract or stored data, and has a local unit-test suite.

Classify which backend defaults are actually relevant. Return JSON matching the
supplied schema. Do not invent network, authorization, retry, idempotency, or new
layer requirements.
