## Goal
Resolve the 4 outstanding Supabase warnings without weakening any working flow.

## Findings & root cause

1. **`cert_templates` publicly readable** — RLS policy `Templates viewable by everyone (true)` exposes layout JSON and styling. Public site never reads templates from the client (PDF rendering happens via the `cert-pdf-url` edge function with service role). Only the admin page (`CertTemplates.tsx`, `useCertData.ts`) reads them, and admins are covered by the existing `Admins manage templates` ALL policy.
   → **Drop the public SELECT policy.**

2. **`site_visits` has no INSERT policy** — Real inserts run through the `track-visit` edge function with the service-role key (bypasses RLS). With no policy, anon/authenticated callers are silently blocked, which is the desired behavior but the linter flags ambiguity.
   → **Add an explicit `INSERT … WITH CHECK (false)` policy for `anon` and `authenticated`** to make the deny explicit. Service role still bypasses RLS, so `track-visit` keeps working.

3. **`security_events` lacks UPDATE/DELETE policies** — The table is meant to be append-only audit data. No policy means no one (other than bypass roles) can mutate, which is already the desired posture, but again ambiguous to the linter.
   → **Add explicit `UPDATE` and `DELETE` policies that evaluate to `false` for `anon` and `authenticated`.** This documents immutability while leaving service-role cleanup (`cleanup_old_security_events`) intact.

4. **`SECURITY DEFINER` callable by anon / authenticated** — Audit confirms only two functions remain reachable:
   - `private.verify_certificate_by_hash` — moved to the `private` schema and only callable by `service_role` (already remediated; the linter no longer reports it).
   - `public.has_role(_user_id uuid, _role app_role)` — referenced by **76+ RLS policies**. Postgres evaluates `USING`/`WITH CHECK` clauses as the calling role, so revoking `EXECUTE` from `anon`/`authenticated` would break every protected table for those roles. Moving it to `private` and rewriting every policy is high-risk for marginal benefit (the function only returns a boolean derived from `user_roles` and exposes no data).
   
   **Action:** add a defensive hardening layer instead of removing access:
   - Add an explicit `revoke … from public` so only `anon`, `authenticated`, and `service_role` can call it (no other roles).
   - Re-affirm the `SET search_path = public` already on the function.
   - Document the intentional public exposure in the security memory and finding ignore reason — Supabase's own RLS guidance recommends this exact pattern (`SECURITY DEFINER` checker function for role lookups).
   - Re-mark the two related linter findings as ignored with a precise reason that lists `has_role` as the only remaining callable function and explains why removing it is impossible.

## Migration

```sql
-- 1. cert_templates: remove public read
DROP POLICY IF EXISTS "Templates viewable by everyone" ON public.cert_templates;

-- 2. site_visits: explicit deny for non-service-role inserts
CREATE POLICY "Block public visit inserts"
  ON public.site_visits
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (false);

-- 3. security_events: explicit immutability
CREATE POLICY "Block public update of security events"
  ON public.security_events
  FOR UPDATE
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

CREATE POLICY "Block public delete of security events"
  ON public.security_events
  FOR DELETE
  TO anon, authenticated
  USING (false);

-- 4. has_role: tighten grants (idempotent re-affirm)
REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO anon, authenticated, service_role;
```

## Code/scanner follow-up

- No frontend changes needed (admin reads of `cert_templates` covered by existing admin policy, `track-visit` and `cleanup_old_security_events` use service role).
- `security--manage_security_finding`:
  - Mark `cert_templates_public_select` style finding as fixed.
  - Mark `site_visits_no_insert_policy` as fixed.
  - Mark `security_events_no_update_delete` as fixed.
  - Re-ignore `SUPA_anon_security_definer_function_executable` and `SUPA_authenticated_security_definer_function_executable` with the updated reason naming `has_role` as the sole remaining callable function and citing the Supabase-recommended pattern.
- Update `@security-memory` accordingly.

## Verification

- Run Supabase linter post-migration; only the two `has_role`-related warnings should remain (and be ignored with documentation).
- Confirm admin `CertTemplates` page still loads templates.
- Confirm `track-visit` edge function continues to insert (service role bypasses RLS).
- Confirm `cleanup_old_security_events` continues to run (service role bypasses).
