## Security Hardening Plan

Comprehensive fixes for the 11 findings across PII exposure, public quiz answers, Realtime leakage, public PDF/WhatsApp URLs, SECURITY DEFINER permissions, and storage listing.

### 1. Team members — hide email & phone from public

- Drop the broad public SELECT policy on `team_members`.
- Create a public view `public.team_members_public` selecting only safe columns (no `email`, no `phone`). Grant SELECT to `anon, authenticated`.
- Restrict full-row SELECT on `team_members` to admins only.
- Update `TeamPage.tsx` and any other component that reads `team_members` to read from `team_members_public`.

### 2. Quizzes — hide correct answers from non-enrolled users

- Drop policy `Quizzes are viewable by everyone`.
- Create `public.safe_quizzes` view exposing `id, lesson_id, title_*, passing_score` and a sanitized `questions` JSONB (strip `correct`/`answer`/`is_correct` fields server-side via a SECURITY INVOKER SQL function).
- Add new policy on `quizzes`: SELECT allowed when user is enrolled in the parent course or is admin.
- Update quiz UI to read from `safe_quizzes` for previews and from `quizzes` only when enrolled.

### 3. Realtime channel leakage

- Remove tables that should not stream public/sensitive data from `supabase_realtime`: `site_visits`, `enrollments`, `announcements`, `courses`, `communities`.
- Keep Realtime only for opt-in collaborative features that already enforce per-user filtering.
- Document that any future Realtime use must include a server-side filter. (We cannot add RLS to `realtime.messages` directly — it lives in a Supabase-reserved schema.)
- Replace any client subscriptions to the removed tables with on-demand `select()` queries (TanStack Query refetch).

### 4. Communities — protect WhatsApp invite URL

- Drop column `whatsapp_invite_url` from public projection: create view `public.communities_public` excluding `whatsapp_invite_url`; switch public SELECT to that view.
- Restrict `communities` table SELECT to admins.
- Add edge function `get-community-invite` that validates JWT, checks community membership/approval (via `community_admins` or approved `community_applications`), and returns the invite URL only to authorized callers.
- Update community UI to call this edge function when the user clicks "Join WhatsApp".

### 5. Certificates — protect PDFs, expose only verification metadata

- Make `certificates` storage bucket **private** (was public).
- Drop the broad public SELECT policy on `cert_records` (no direct table reads from anon).
- Update `verify_certificate_by_hash` RPC: keep it the only public path; instead of returning raw `pdf_url`, generate a short-lived signed URL inside the RPC (or via a small `get-certificate-pdf` edge function called after verification).
- Frontend `VerifyCertificate` page: continue calling the RPC; render the (now signed) PDF link.
- Admin pages already authenticate, so they keep working through admin RLS.

### 6. SECURITY DEFINER functions — lock execution

For each function, REVOKE EXECUTE FROM PUBLIC, anon, authenticated, then GRANT only to the appropriate role:

- **Public-facing (keep callable by anon + authenticated):** `verify_certificate_by_hash`, `has_role`.
- **Service-only (revoke entirely from anon/authenticated):** `cleanup_*`, `enqueue_email`, `read_email_batch`, `delete_email`, `move_to_dlq`, `log_security_event`, `is_ip_blacklisted`, `get_security_metrics`, `provision_root_admin`, `ensure_admin_role`, `update_*`, `update_course_rating`, `update_enrollment_count`, `validate_application_status`, `update_subtitle_jobs_updated_at`, `update_updated_at_column`. Triggers continue to work because triggers run as table owner regardless of EXECUTE grants.

### 7. Storage — stop bucket listing

- `media` bucket: keep public read **via direct URL** but drop any broad `SELECT on storage.objects` policy that allows `list()`. Public buckets serve files by URL even with no SELECT policy, so removing the catch-all policy stops listing without breaking image rendering.
- `certificates` bucket: switched to private in step 5; rely on signed URLs only. Drop broad SELECT policies for that bucket.
- Keep admin-scoped INSERT/UPDATE/DELETE policies as-is.

### 8. Verification & rollout

- Single migration applies all DDL (drop policies, create views, alter functions, change bucket).
- After migration: refresh `cert_records` and `team_members` reads in UI to use the new views/RPC, swap PDF link wiring to signed URL.
- Re-run `supabase--linter` and `security--run_security_scan`; mark fixed findings in the security board.

### Out of scope

- No changes to Lovable Cloud auth providers.
- No new admin features — purely defensive.
- Existing admin RLS policies remain; we are only narrowing public access surface.
