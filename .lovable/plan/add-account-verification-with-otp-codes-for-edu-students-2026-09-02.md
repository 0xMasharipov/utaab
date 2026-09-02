# Add account verification with OTP codes for EDU students

Today the education signup sends a click-a-link confirmation email, and if a student tries to sign in before confirming, they only see a "check your inbox" screen. Admins already get a 6-digit code flow. This brings the same experience to students, using the existing branded email templates.

## What changes for students

1. After completing registration, the student receives the branded confirmation email containing both the confirmation button and a 6-digit verification code.
2. The registration screen switches to the code entry screen (the same 6-slot OTP input already used for admins), so students can finish verifying without leaving the page.
3. Entering a valid code confirms the account, signs the student in, logs the login, and shows the welcome state.
4. "Resend code" is available with the existing 60-second cooldown and rate limiting.
5. Signing in with an unconfirmed account shows the same code entry screen instead of the passive "check your email" message, with a resend that delivers a fresh code.

Clicking the link in the email keeps working exactly as before — the code is an additional option, not a replacement.

## Email templates

No new templates. The signup email template gets a code block matching the look of the existing verification-code email (dark rounded box, large spaced digits, Montserrat, UTAAB logo and tagline), inserted under the confirm button, with short "or enter this code" wording. The code block only renders when a code is present, so other uses of the template are unaffected.

## Technical details

- `supabase/functions/education-signup/index.ts`: the admin `generateLink` response already returns `email_otp` alongside the action link — capture it and pass it into the rendered `SignupEmail` props. Also return `needs_email_confirmation` plus a `confirmation_mode: 'code'` flag so the client knows to show the OTP screen.
- `supabase/functions/_shared/email-templates/signup.tsx`: add an optional `token` prop and the code section, styled from `reauthentication.tsx`.
- New resend path: extend `education-signup` (or a thin `education-resend-otp` function) so a resend regenerates a signup link/OTP for an unconfirmed user and enqueues the same branded email. This avoids Supabase's built-in unbranded resend email currently used by `supabase.auth.resend`.
- `src/components/forms/EducationRegisterForm.tsx`: set `confirmationMode` to `'code'` after signup and after an "Email not confirmed" sign-in error; point `handleResendOtp` at the new resend endpoint. `handleVerifyOtp` already calls `supabase.auth.verifyOtp({ type: 'signup' })` and needs no change.
- Rate limiting stays as-is (`otp_verify` 5/window, `otp_resend` 3/window) via `useSecurity`.
- Redeploy `education-signup` (and the resend function) after the change.
