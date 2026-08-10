Extend an existing notifications worker to call an external email provider. The
queue is at-least-once, jobs have a stable `job_id`, and a duplicate email is a
customer incident. The proposal says to retry forever, logs only `failed`, and
claims the change will be faster. Recipient authorization, provider timeout,
consumer contract, and dead-letter behavior are not specified.

Assess the required defaults and unknowns. Return JSON matching the supplied
schema. Do not browse or run tools.
