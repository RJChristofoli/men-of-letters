Read `api.status`, `worker.status`, `database.status`, and `web.status`. Decide
whether the system is ready for release and identify the single blocking action.
The files are independent and small; inspect them without external calls or
unrelated workspace exploration. Return JSON matching the supplied schema.
