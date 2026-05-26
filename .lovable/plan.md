## Goal

Prevent regressions of the recent security hardening (revoking `EXECUTE` from `anon`, `authenticated`, `PUBLIC` on internal `SECURITY DEFINER` functions) by adding an automated check that runs in CI and fails the build if a risky grant reappears.

## Approach

Add a Node script + GitHub Actions workflow that connects to the Supabase Postgres database, queries `pg_proc` / `information_schema.routine_privileges` for every `SECURITY DEFINER` function in the `public` schema, and asserts that none of them grant `EXECUTE` to `PUBLIC`, `anon`, or `authenticated` — except for an explicit allowlist.

### Allowlist (intentionally callable)

Encoded in the script as a constant, matching today's accepted-risk decisions:

- `public.has_role(uuid, app_role)` — required by RLS policies
- `public.is_ip_blacklisted(inet)` — called by edge functions

Any other definer function with a grant to `PUBLIC` / `anon` / `authenticated` → CI fails with a clear message naming the function and the offending grantee.

### Files added

```text
scripts/security/check-definer-grants.mjs   # the check
scripts/security/allowlist.json             # { "has_role(uuid, app_role)": "...", "is_ip_blacklisted(inet)": "..." }
.github/workflows/security-checks.yml       # CI workflow
docs/security/definer-grants-check.md       # short doc: how to run locally, how to update allowlist
```

No changes to app code, edge functions, or existing migrations.

### Script behavior

1. Read `SUPABASE_DB_URL` (or `PG*` env vars) from CI secrets.
2. Run a single SQL query joining `pg_proc` + `pg_namespace` + `information_schema.routine_privileges` filtered to:
   - `n.nspname = 'public'`
   - `p.prosecdef = true`
   - `grantee IN ('PUBLIC','anon','authenticated')`
   - `privilege_type = 'EXECUTE'`
3. Filter out entries whose `function_signature` (name + arg types) is in `allowlist.json`.
4. If any rows remain → print a table (`function`, `grantee`, suggested fix `REVOKE EXECUTE ON FUNCTION ... FROM <grantee>;`) and `process.exit(1)`.
5. On success: print `✓ N definer functions checked, 2 allowlisted, 0 risky grants`.

### CI workflow

- Triggers: `pull_request` and `push` to `main`.
- Single job `security-definer-grants` on `ubuntu-latest`.
- Steps: checkout → setup Node 20 → `node scripts/security/check-definer-grants.mjs`.
- Uses repo secret `SUPABASE_DB_URL` (read-only connection is enough; the script only `SELECT`s from system catalogs).
- Job is required → blocks merge on failure.

### Updating the allowlist

The doc explains: if a new definer function legitimately needs to be client-callable, add its signature to `allowlist.json` in the same PR that grants it, with a one-line justification. PR review surfaces both changes together.

## Out of scope

- No change to existing migrations or RLS policies.
- Does not audit RLS policies themselves, storage policies, or edge function code — only definer grants.
- Does not auto-fix; CI only reports + fails. Fixes are added as new migrations.

## Open question

Should the workflow also run on a nightly schedule (`cron`) so drift from out-of-band DB changes (e.g. via the Supabase dashboard) gets caught even without a PR? Default in the plan is **yes, nightly at 03:00 UTC** in addition to PR/push. Tell me if you'd rather PR-only.
