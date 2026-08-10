A team asks to extract payment retry handling into a new microservice because 2%
of concurrent retries create duplicate rows. The current monolith already owns
the transaction, has no unique constraint on `(payment_id, attempt)`, and all
callers depend on its existing response contract. Delivery is due in three days.

Choose the engineering response. Return JSON matching the supplied schema. Do
not browse or run tools. Base the decision only on the stated facts and include
proportionate validation and rollback.
