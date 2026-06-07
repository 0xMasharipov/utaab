## Diagnosis

The "Install pg client" step is fine. The job now reaches `node scripts/security/check-definer-grants.mjs`, the script connects, runs its query, and exits **1** — meaning it found risky `EXECUTE` grants on `SECURITY DEFINER` functions in `public`. The annotation only shows "Process completed with exit code 1" because the per-function output is inside the collapsed step log, not the summary panel.

Two things need to change:

### 1. Make the query authoritative (not role-visibility dependent)

`information_schema.routine_privileges` only returns grants the connecting role can see. That's why a query run from the Lovable sandbox role returns 0 rows while CI (privileged role) returns violations. Switch to `pg_proc.proacl` via `aclexplode`, which lists the raw ACL regardless of the caller:

```sql
SELECT
  p.proname AS function_name,
  pg_catalog.pg_get_function_identity_arguments(p.oid) AS arg_types,
  CASE WHEN a.grantee = 0 THEN 'PUBLIC'
       ELSE pg_catalog.pg_get_userbyid(a.grantee) END AS grantee
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
CROSS JOIN LATERAL aclexplode(COALESCE(p.proacl, acldefault('f', p.proowner))) AS a
WHERE n.nspname = 'public'
  AND p.prosecdef = true
  AND a.privilege_type = 'EXECUTE'
  AND (a.grantee = 0
       OR pg_catalog.pg_get_userbyid(a.grantee) IN ('anon','authenticated'))
ORDER BY p.proname, grantee;
```

This both fixes the visibility issue and removes the parameterized `ANY($1)` (no longer needed).

### 2. Make CI surface the violating functions

Add a leading banner line to the script's failure output (already lists each function, just needs to be impossible to miss) and append a GitHub Actions workflow command so the function list appears as an **error annotation** on the run, not just inside a collapsed log:

```js
// at start of the violations branch
console.error(`::error title=Risky SECURITY DEFINER grants::${violations.length} function(s) need REVOKE or allowlisting`);
```

After this change, the GitHub run page will show each risky function as a top-level annotation, and you'll know exactly which signatures to either:
- `REVOKE EXECUTE ON FUNCTION public.<sig> FROM <grantee>;` via a migration, or
- add to `scripts/security/allowlist.json` with a justification.

## What I will NOT change

- The workflow YAML (already correct after the previous fix).
- `allowlist.json` (entries to add are unknown until CI shows the function names).
- Anything outside `scripts/security/check-definer-grants.mjs`.

## Files

- `scripts/security/check-definer-grants.mjs` — replace SQL with `aclexplode`-based query; add `::error::` annotation line on failure.

## Next step after the build

Push to `main` (or open a PR), open the failing **SECURITY DEFINER grants** job — the violating function signatures will now appear as annotations. Send those to me and I'll generate the REVOKE migration or update the allowlist accordingly.
