

# Add Rate Limiting for OTP, Anti-bot to Register, OTP to Admin Sign-in

## 1. Add Rate Limit for OTP Verification

**`src/components/forms/EducationRegisterForm.tsx`**:
- In `handleVerifyOtp`, add a rate limit check before calling `verifyOtp` — use `checkRateLimit(otpEmail, 'otp_verify', 5)` (5 attempts per window)
- In `handleResendOtp`, add a rate limit check — use `checkRateLimit(otpEmail, 'otp_resend', 3)` (3 resends per window)

## 2. Add Anti-bot (UTAAB Captcha) to Education Register Form

**`src/components/forms/EducationRegisterForm.tsx`**:
- Add `UtaabCaptcha` component to step 3 (consent step) of the signup flow, before the submit button
- Add `utaabToken` state and `utaabRef` ref
- Require `utaabToken` to be present before allowing form submission (add to submit button `disabled` check and `handleSubmit` validation)
- Keep existing honeypot + timing checks alongside

## 3. Add OTP Verification to Admin Sign-in

**`src/pages/admin/AdminLogin.tsx`**:
- Add OTP state: `awaitingOtp`, `otpCode`, `otpEmail`, `isVerifyingOtp`, `resendCooldown`
- After successful `signInWithPassword`, if `Email not confirmed` error → show OTP input
- Add `handleVerifyOtp` function that calls `supabase.auth.verifyOtp()`, then checks admin role, creates session, and navigates
- Add `handleResendOtp` with cooldown
- Add rate limit checks for OTP verify/resend
- Render OTP UI (InputOTP with 6 slots) when `awaitingOtp` is true, replacing the login form
- Import `InputOTP`, `InputOTPGroup`, `InputOTPSlot` and `RefreshCw`

## Files Modified

| File | Change |
|------|--------|
| `src/components/forms/EducationRegisterForm.tsx` | Add UtaabCaptcha to step 3, rate limit OTP verify/resend |
| `src/pages/admin/AdminLogin.tsx` | Add OTP verification flow after sign-in, rate limit OTP |

