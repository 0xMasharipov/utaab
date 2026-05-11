## Goal
Fully resolve the three security findings without ignoring them.

## Findings status

1. **`generate_subtitles_noauth` (error)** — Already fixed in code: `generate-subtitles/index.ts` validates the `Authorization` header, calls `auth.getUser()`, and checks `has_role('admin')` before doing any work. Action: re-mark fixed in scanner.

2. **`cutii_chat_context_injection` (warn)** — Already fixed in code: `cutii-chat/index.ts` `requestSchema` already enforces `.max()` on `courseContext.title/description/level/topics` and `lessonContext.title/description`, and the handler runs `dangerousPatterns` over every context string (lines 285–303) before interpolating into the system prompt. Action: re-mark fixed in scanner.

3. **`contributor_assessments_email_insert_public` (warn)** — Currently the table has a public `INSERT` policy. All real submissions go through the `contributor-match` edge function which uses the **service-role key** (bypasses RLS) and already enforces:
   - Zod validation
   - IP rate limit (5/hour)
   - Email rate limit (3/hour)
   
   The public INSERT policy is therefore unnecessary and lets anyone bypass the rate limits by calling PostgREST directly. **Fix: drop the public INSERT policy** so writes are only possible via the hardened edge function.

## Changes

### Migration
```sql
DROP POLICY IF EXISTS "Anyone can submit validated assessments"
  ON public.contributor_assessments;
```
No new policy needed — service role bypasses RLS, admins keep their existing SELECT/UPDATE policies, and the public form keeps working because it already calls `supabase.functions.invoke('contributor-match', …)` rather than inserting directly.

### Scanner bookkeeping
- Mark `generate_subtitles_noauth` as fixed (already enforced in code).
- Mark `cutii_chat_context_injection` as fixed (already enforced in code).
- Mark `contributor_assessments_email_insert_public` as fixed once the policy is dropped.

### Security memory
Update memory to reflect: contributor_assessments writes are edge-function-only; public INSERT removed; rate limits remain the abuse boundary.

## Verification
- Re-read `contributor-match/index.ts` to confirm it uses `SUPABASE_SERVICE_ROLE_KEY` (already verified).
- Run Supabase linter after migration.
- Confirm `ContributorMatch.tsx` only calls `supabase.functions.invoke('contributor-match', …)` (no direct table insert).
