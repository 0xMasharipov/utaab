# SECURITY DEFINER grants CI check

`scripts/security/check-definer-grants.mjs` connects to the project database and fails
if any `SECURITY DEFINER` function in the `public` schema has `EXECUTE` granted to
`PUBLIC`, `anon`, or `authenticated` — unless the function signature is listed in
`scripts/security/allowlist.json`.

Runs in CI via `.github/workflows/security-checks.yml` on every PR, every push to
`main`, and nightly at 03:00 UTC (catches out-of-band changes made through the
Supabase dashboard).

## Why

`SECURITY DEFINER` functions run with the owner's privileges and are exposed by
PostgREST as RPC endpoints. A grant to `anon`/`authenticated`/`PUBLIC` on an
internal helper (trigger function, cleanup job, admin utility) lets any client
invoke it. We previously revoked those grants; this check prevents regressions.

## Allowlist

Edit `scripts/security/allowlist.json`. Keys are `function_name(arg_types)` with
no whitespace (e.g. `has_role(uuid,app_role)`). Values are a short justification.

Add an entry **in the same PR** that introduces a new intentionally-callable
definer function, so reviewers see both changes together.

Current allowlist:

- `has_role(uuid, app_role)` — referenced by dozens of RLS policies.
- `is_ip_blacklisted(inet)` — called by edge functions.

## Running locally

```bash
SUPABASE_DB_URL='postgres://...' node scripts/security/check-definer-grants.mjs
```

Exit codes: `0` = pass, `1` = violations found, `2` = config/connection error.

## Required CI secret

`SUPABASE_DB_URL` in repo Actions secrets. A read-only role is sufficient; the
script only `SELECT`s from `pg_catalog` and `information_schema`.
