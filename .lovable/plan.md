

# Dark/Light Mode Email Templates — White Card Always

## Summary
Update all 6 email templates so the **outer background** adapts to the user's color scheme (light gray in light mode, dark navy in dark mode), while the **inner card always stays white** in both modes.

## Changes

**Files (6 templates in `supabase/functions/_shared/email-templates/`):**
- `signup.tsx`, `recovery.tsx`, `invite.tsx`, `email-change.tsx`, `magic-link.tsx`, `reauthentication.tsx`

**Per template:**
1. Change default `main.backgroundColor` from `#081020` to `#F4F7FB` (light mode default)
2. Add a `<style>` block in `<Head>` with `@media (prefers-color-scheme: dark)` targeting the body background back to `#081020`
3. Inner card container stays `#ffffff` — no change needed (already white)

**Post-edit:** Redeploy `auth-email-hook` edge function.

## Compatibility
- Apple Mail, Outlook.com, Yahoo: full dark/light support
- Gmail: ignores media query, shows light background (safe fallback)

