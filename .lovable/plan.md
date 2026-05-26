## Security audit results

Fresh scan returned 4 warn-level findings. No critical/error-level issues. No data exposure vulnerability that would let a hacker steal user data.

### Finding 1 & 2 — SECURITY DEFINER functions callable by anon/authenticated (warn)

You have ~20 `SECURITY DEFINER` functions in the `public` schema. PostgREST exposes them as RPC endpoints by default, meaning anyone (anon or signed-in) could call them via `supabase.rpc(...)`. Most are internal trigger/cleanup helpers that should never be callable from clients.

**Functions that must stay callable** (used by RLS or edge functions):
- `has_role(uuid, app_role)` — referenced in dozens of RLS policies; revoking would break the whole admin model
- `is_ip_blacklisted(inet)` — called by edge functions (service_role bypasses grants anyway, but keep open for safety)

**Functions to lock down** (revoke EXECUTE from `anon`, `authenticated`, `PUBLIC`; keep `service_role`):
- Trigger helpers: `update_updated_at_column`, `update_enrollment_count`, `update_course_rating`, `update_subtitle_jobs_updated_at`, `validate_application_status`
- Cleanup jobs: `cleanup_old_rate_limits`, `cleanup_old_utaab_records`, `cleanup_old_security_events`, `cleanup_expired_admin_sessions`
- Admin/system: `ensure_admin_role`, `provision_root_admin`, `log_security_event`, `get_security_metrics`, `generate_certificate_number`
- Email queue internals: `enqueue_email`, `delete_email`, `read_email_batch`, `move_to_dlq`

Impact of fix: zero functional change (clients never called these). Closes the warn finding.

### Finding 3 — Users can't access their own files in `certificates` storage bucket (warn)

The scanner assumes participants log in and download their own cert. Your actual flow is different: the `cert-pdf-url` edge function uses service-role to mint signed URLs, returned to the public `/verify-certificate` page. Users don't need direct storage access.

**Action:** Ignore this finding with explanation (verification is server-mediated via edge function). No code change.

### Finding 4 — `cert_records` has no public SELECT policy (warn)

Same situation: public verification goes through `cert-pdf-url` edge function (service_role bypasses RLS), so a public policy is unnecessary and would actually leak more data than the edge function does (the function only returns sanitized fields).

**Action:** Ignore this finding with explanation. No code change.

---

## Changes to make

### 1. Migration: revoke EXECUTE on internal definer functions

```sql
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_enrollment_count()  FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_course_rating()     FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_subtitle_jobs_updated_at() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.validate_application_status()      FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.cleanup_old_rate_limits()          FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.cleanup_old_utaab_records()        FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.cleanup_old_security_events()      FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.cleanup_expired_admin_sessions()   FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.ensure_admin_role(text)            FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.provision_root_admin()             FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.log_security_event(text,text,inet,uuid,text,text,jsonb) FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_security_metrics(integer)      FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.generate_certificate_number()      FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.enqueue_email(text,jsonb)          FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.delete_email(text,bigint)          FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.read_email_batch(text,integer,integer) FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.move_to_dlq(text,text,bigint,jsonb) FROM anon, authenticated, PUBLIC;
-- has_role and is_ip_blacklisted left as-is (needed by RLS / edge functions)
```

### 2. Mark findings 3 and 4 as ignored in scanner

With explanations pointing to the `cert-pdf-url` edge function as the intended access path.

### 3. Update security memory

Record the architectural decision: certificate access is server-mediated; only `has_role` and `is_ip_blacklisted` are intentionally callable definer functions.

---

## What this does NOT include

- No changes to RLS policies on data tables (already correct).
- No changes to edge functions.
- No frontend changes.
- Will not touch `has_role()` or `is_ip_blacklisted()` — breaking them would break admin access for the entire site.
