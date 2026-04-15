

# Fix OTP Not Working for New Registered Users

## Root Cause

Auto-confirm email signups is currently **enabled** in the authentication settings. This means:
- When a user signs up, their account is immediately confirmed — no verification email is sent
- The auth logs confirm this: `immediate_login_after_signup: true`
- But the registration form still shows an OTP verification screen after signup, asking users to enter a 6-digit code from an email that was never sent
- The `email_send_log` has zero `signup` entries — confirming no signup emails are being dispatched

## Solution

**Disable auto-confirm** so that signup emails (with OTP codes) are actually sent to new users. The auth-email-hook and email infrastructure are already properly configured — the `magiclink` template (which handles OTP codes) works correctly (confirmed by successful sends to admin). The only issue is that auto-confirm bypasses the email sending entirely.

### Step 1: Disable auto-confirm email signups
Use the `configure_auth` tool to set `auto_confirm_email` to `false`. This will make the auth system send confirmation emails (routed through `auth-email-hook`) with OTP codes when users register.

### Step 2: Redeploy auth-email-hook (safety check)
Redeploy `auth-email-hook` to ensure the latest version is active and handling signup events correctly.

### No code changes needed
The registration form (`EducationRegisterForm.tsx`) already has the correct OTP flow:
- After signup → shows OTP input screen
- Calls `supabase.auth.verifyOtp()` with type `signup`
- Has resend functionality via `supabase.auth.resend({ type: 'signup' })`

The email templates (`signup.tsx`, `magic-link.tsx`) are already configured and working. The only fix is turning off auto-confirm so the system actually sends the emails.

## Files Modified
- None — this is a configuration change only (auth settings)

