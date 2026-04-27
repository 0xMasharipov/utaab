# Fix CORS Blocking on utaab.org (Signup/Login Failure)

## Problem

The signup/login error you're seeing is **not** a 429 rate limit anymore — it's a browser **CORS block**. The console shows:

> Access to fetch at `.../check-rate-limit` from origin `https://utaab.org` has been blocked by CORS policy: Response to preflight request ... `Access-Control-Allow-Origin` header has a value `https://nxbjgqdehvxszqjoxumx.lovableproject.com` that is not equal to the supplied origin.

The `check-rate-limit` edge function's allowed-origins list never included `https://utaab.org`. When a request arrives from the production domain, the function falls back to returning the Lovable preview origin, which the browser rejects. The frontend then can't even reach the backend, so signup and login both fail.

The earlier `utaab-verify` function (which works correctly) already has the right allowlist. We just need to apply that same pattern everywhere a browser calls an edge function.

## What Will Change

### 1. Create one shared CORS helper

New file `supabase/functions/_shared/cors.ts` exporting a single `getCorsHeaders(req)` function that:
- Allows `https://utaab.org`, `https://www.utaab.org`
- Allows all `*.lovableproject.com`, `*.preview.lovableproject.com`, `id-*.lovable.app` previews
- Allows `http://localhost:*` for dev
- Echoes back the actual matching origin (required when credentials are used)
- Includes the full `Access-Control-Allow-Headers` list already used today
- Adds `Vary: Origin` so caches don't poison responses

This replaces 12 different copy-pasted CORS blocks with one canonical implementation.

### 2. Update browser-callable edge functions to use the shared helper

Functions to update (all are missing `utaab.org` today):

- `check-rate-limit` ← directly causing the current failure
- `verify-turnstile`
- `cutii-chat`
- `generate-subtitles`
- `submit-community-application`
- `submit-kvkk-request`
- `lookup-user-by-email`
- `sanitize-content`
- `handle-email-unsubscribe`
- `terminate-admin-session`
- `preview-transactional-email`
- `get-admin-users`

For each, swap the local `getCorsHeaders` / `corsHeaders` definition for an import from `_shared/cors.ts`. No business logic changes.

### 3. Re-deploy the updated functions

After editing, deploy all changed functions so the new CORS headers go live. No SQL or auth-config changes needed.

## What Will NOT Change

- No frontend changes. The signup form, captcha, and rate-limit hook keep working as-is.
- No changes to the auth-email-hook fix from the previous step (that stays in place).
- Functions that are only called server-to-server (like `process-email-queue`) are not touched.

## Verification

After deploy, from `https://utaab.org`:
1. Open the signup page, fill in details, submit.
2. Confirm `check-rate-limit` returns 200 with `Access-Control-Allow-Origin: https://utaab.org`.
3. Confirm signup proceeds and the branded confirmation email arrives.
4. Repeat for login.

## Files Touched

- **New:** `supabase/functions/_shared/cors.ts`
- **Edited:** the 12 edge functions listed above (CORS block only)
