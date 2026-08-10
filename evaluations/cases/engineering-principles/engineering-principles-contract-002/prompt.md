An accepted customer API contract maps a blank `middle_name` to JSON `null`.
One duplicated parser violates that rule and returns an empty string; the other
four parsers comply. A cleanup request proposes replacing all five parsers with
a new generic abstraction and changing every blank value to an empty string.

Choose the engineering response. Return JSON matching the supplied schema. Do
not browse or run tools. Preserve intentional public behavior and state suitable
validation.
