# Policy Precedence and Conflict Handling

Status: accepted Phase -1 contract; installer enforcement remains unimplemented.

Men of Letters policies are defaults installed into host-supported durable
instruction surfaces. They never override the host's instruction hierarchy,
platform safety controls, or authority boundaries.

## Resolution Order

Resolve instructions in this order:

1. Apply the host platform's authority and instruction-precedence rules.
2. Within the same authority, apply the instruction with the narrower applicable
   scope. A file-scoped repository rule is narrower than a repository default.
3. Within the same authority and scope, an explicit task requirement overrides
   a default only when the higher-authority contract permits the override.
4. When two Men of Letters policies still conflict, use the internal priority
   order below.
5. If a material conflict remains ambiguous, choose the safer reversible path,
   preserve existing state, and report the conflict instead of inventing a rule.

Later file position is not a supported precedence mechanism. The installer must
not reorder third-party or manually authored instructions to manufacture a win.

## Internal Policy Priority

From highest to lowest:

1. Safety, security, privacy, authorization, and irreversible-change controls.
2. Correctness, evidence, validation, and safe-change requirements.
3. Repository-specific accepted contracts and compatibility requirements.
4. Domain defaults, including backend and documentation defaults.
5. Efficiency, token, formatting, and stylistic preferences.

A lower-priority policy may optimize only inside the constraints established by
higher-priority policies. For example, token efficiency cannot suppress a
required security check, and a documentation preference cannot change runtime
behavior.

## Policy Authoring Contract

Every policy source and future catalog entry must declare:

- a stable policy ID and owner;
- its scope and positive applicability conditions;
- exclusions and conditions under which it yields;
- whether each statement is required or recommended;
- the internal priority category it belongs to;
- known conflict keys, such as `artifact-language`, `approval`, or
  `response-detail`;
- the evidence or accepted decision supporting it.

Use one policy to own each default. Cross-reference another policy rather than
restating it. Keep installed text self-contained enough to act without loading
repository governance documents.

## Conflict Handling

The bootstrap installer must perform a preflight before writing:

- detect duplicate Men of Letters policy IDs and malformed managed markers;
- detect overlapping conflict keys in the selected policy set;
- distinguish an identical already-managed policy from manual or third-party
  content;
- display the competing sources, effective scopes, priority, and proposed
  resolution;
- fail closed when a required policy conflict has no deterministic resolution.

Recommended-policy conflicts may be resolved by a documented higher-priority
choice. Required-policy conflicts need an explicit compatible configuration or
the installation stops. The installer never edits unmanaged content to resolve
a conflict.

At runtime, a capability encountering an unresolved material conflict must name
the conflicting requirements, explain the affected outcome, take any safe
read-only work that remains useful, and request a decision when authority is
needed. Record recurring conflicts as evaluation cases and fix their source
contract rather than relying on ad hoc prompt wording.
