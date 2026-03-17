

# Fix: Admin OTP Sends Login Link Instead of 6-Digit Code

## Root Cause

When `signInWithOtp({ email })` is called, Supabase triggers a `magiclink` auth event. The auth-email-hook renders the **MagicLinkEmail** template, which displays a clickable "Sign In" button/link — not the 6-digit OTP code. The OTP token IS included in the payload (`payload.data.token`) and is already passed to the template as `token`, but the template ignores it and only shows `confirmationUrl`.

## Changes

### 1. Update magic-link email template to show OTP code
**File:** `supabase/functions/_shared/email-templates/magic-link.tsx`

- Add `token` to the props interface
- Replace the "Sign In" button with a styled 6-digit code display (same style as the reauthentication template)
- Update heading from "Your Login Link" to "Your Verification Code"
- Update preview/body text to reference the code

### 2. Update email subject
**File:** `supabase/functions/auth-email-hook/index.ts`

- Change `magiclink` subject from `'Your login link'` to `'Your verification code'`

### 3. Redeploy auth-email-hook
Deploy the updated function so the new template takes effect.

## No client-side changes needed
The `AdminLogin.tsx` OTP input and `verifyOtp({ type: 'email' })` call already handle 6-digit codes correctly. The issue is purely in the email template rendering a link instead of the code.

