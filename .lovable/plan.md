# Fix 429 "email rate limit exceeded" on Sign Up / Sign In

## The Problem

Auth logs show every signup attempt failing with:
```
429: email rate limit exceeded
error_code: over_email_send_rate_limit
path: /signup
```

This is **Supabase's default email rate limit** (only 2–4 confirmation emails per hour, shared globally across the project). Once it's hit, **no user can sign up or recover their password** until the cooldown expires.

Login is also blocked indirectly, because new users can never confirm their email.

## Root Cause

The project already has a custom branded auth email handler at `supabase/functions/auth-email-hook` wired to Resend via `notify.utaab.org`, **but the Auth Email Hook is not currently registered with Lovable Cloud Auth**. So all confirmation/recovery emails fall back to the built-in default SMTP, which is rate limited.

## Fix

Two complementary changes:

### 1. Register the Auth Email Hook (primary fix)

Use `configure_auth` to point Lovable Cloud Auth at the existing `auth-email-hook` edge function. Once registered, all signup / magic-link / recovery / email-change emails will be sent through our own Resend infrastructure on `notify.utaab.org`, which has production-grade limits — eliminating the 429.

### 2. Resilient signup UX (secondary)

Update `EducationRegisterForm` (and any other signup entry points) so that if a 429 / `over_email_send_rate_limit` is ever returned again, the user sees a clear, branded message in their language ("Too many requests right now, please try again in a minute") instead of the raw Supabase error. Today the generic error mapper does not catch this specific code, so users just see a confusing message and retry-spam, which makes it worse.

### 3. Verify after deploy

- Trigger a real signup with a fresh email
- Check `auth_logs` for `status: 200` on `/signup`
- Confirm the branded email arrives from `notify.utaab.org`

## Files Touched

- **Auth config** (via `configure_auth` tool) — register email hook URL
- `src/components/forms/EducationRegisterForm.tsx` — friendlier 429 handling
- `src/lib/errorUtils.ts` — add `over_email_send_rate_limit` mapping

## What Stays the Same

- All existing branded templates in `supabase/functions/_shared/email-templates/`
- `notify.utaab.org` BIMI / DNS setup
- OTP flow, 2FA, UTAAB captcha — untouched

## Out of Scope

- No new SMTP provider
- No changes to admin login flow
- No backend rate limiting added to our own functions
