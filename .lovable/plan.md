# Password + email OTP for returning users

## Goal
Require every student/user email sign-in to complete two steps:

1. Verify the account password.
2. Enter a fresh 6-digit code sent to the account email.

Registration remains unchanged, and administrator sign-in keeps its existing password-plus-OTP protection.

## Current state confirmed
- The student/user sign-in screen currently grants access immediately after a successful password check.
- The same screen already contains a 6-digit code entry, verification, resend cooldown, and successful post-verification navigation.
- Administrator sign-in already requires password followed by email OTP.
- `notify.utaab.org` is verified, custom authentication emails are enabled, and the existing auth email handler maps OTP sign-ins to the branded UTAAB verification-code template.

## Implementation
1. Update the student/user sign-in submission so a valid password does not finish login immediately.
2. After password verification, end that temporary session and request a fresh OTP with account creation disabled.
3. Show the existing six-digit code screen and start the 60-second resend cooldown.
4. Complete sign-in, security logging, login history, and navigation only after the OTP is verified.
5. Align “Resend code” with the same returning-user OTP flow and preserve anti-abuse limits and account-enumeration protection.
6. Keep registration confirmation behavior separate so new-account activation continues to work as it does today.

## Validation
- Confirm wrong passwords never trigger an OTP or create a session.
- Confirm valid returning users reach the code screen and an email send is recorded.
- Confirm wrong/expired codes are rejected.
- Confirm a valid code signs the user in and opens the education area.
- Confirm resend cooldown and rate-limit feedback still work.
- Check desktop and mobile layouts, TypeScript, preview build status, and authentication delivery logs.

## Technical details
- Reuse the existing password authentication, `signInWithOtp({ shouldCreateUser: false })`, and `verifyOtp({ type: 'email' })` paths.
- Reuse the current branded UTAAB authentication template; no new email provider or secret is needed.
- Keep role/profile storage unchanged; this change affects sign-in verification only.
