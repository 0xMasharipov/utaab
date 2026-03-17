

# Add Mandatory 2-Step Authentication (Email OTP) to Admin Login

## Problem
Currently, OTP verification only triggers when email is "not confirmed." Admin login should **always** require a second verification step after password/OAuth authentication to prevent fraud.

## Flow
1. Admin enters credentials → password verified + admin role confirmed
2. **Immediately sign out** (prevent session access before 2FA)
3. Send OTP via `supabase.auth.signInWithOtp({ email })` 
4. Show existing OTP verification screen
5. Admin enters 6-digit code → verified → admin session created → navigate to dashboard

## Changes — `src/pages/admin/AdminLogin.tsx`

### `handleLogin` (after successful password + role check)
- Instead of creating admin session and navigating, **sign out immediately**
- Call `supabase.auth.signInWithOtp({ email })` to send verification code
- Set `awaitingOtp = true`, `otpEmail`, `resendCooldown = 60`
- Show toast informing admin that a code was sent

### `handleResendAdminOtp`
- Change from `supabase.auth.resend({ type: 'email_change' })` to `supabase.auth.signInWithOtp({ email: otpEmail })` — current resend type is incorrect for this flow

### OAuth callback
- After Google OAuth + admin role verification, also trigger OTP:
  - Sign out, send OTP to user's email, show OTP screen

### Existing OTP verification (`handleVerifyAdminOtp`)
- Already works correctly — creates admin session on success. No changes needed.

## Files Modified

| File | Change |
|------|--------|
| `src/pages/admin/AdminLogin.tsx` | Mandatory OTP after auth, fix resend method |

