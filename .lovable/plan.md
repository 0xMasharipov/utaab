## Problem

Auth confirmation emails contain the line:

> Or paste this link into your browser:
> https://utaab.lovable.app

It should point to the primary domain `https://utaab.org`.

## Root cause

`supabase/functions/auth-email-hook/index.ts` defines:

```ts
const SAMPLE_PROJECT_URL = "https://utaab.lovable.app"
```

This constant is used as the `siteUrl` / `confirmationUrl` placeholder injected into all six email templates (signup, magiclink, recovery, invite, email_change, reauthentication). It serves both as the preview-mode sample and as the fallback URL baked into the rendered template that the Supabase Auth backend find-and-replaces with the real recipient URL at send time. When the find-and-replace doesn't substitute (e.g. plain-text fallback rendering, or templates rendered before substitution), users see the `lovable.app` URL.

## Fix

Update the constant to use the primary custom domain so every fallback/preview link resolves to the canonical site.

### Change (1 line, 1 file)

`supabase/functions/auth-email-hook/index.ts` line 49:

```diff
- const SAMPLE_PROJECT_URL = "https://utaab.lovable.app"
+ const SAMPLE_PROJECT_URL = "https://utaab.org"
```

No template changes are needed — all six templates already render whatever `siteUrl` / `confirmationUrl` is passed in.

## Deployment

Redeploy the `auth-email-hook` edge function so the new constant takes effect for all subsequent auth emails (signup confirmation, magic link, password reset, invite, email change, reauthentication).

## Verification

After deploy, trigger a fresh signup and confirm the "Or paste this link into your browser" line shows `https://utaab.org/...` instead of `https://utaab.lovable.app/...`.