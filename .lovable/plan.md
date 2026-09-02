# Finish education signup verification

## Current state

All three pieces you asked for already exist in the code:

- `education-signup` captures `email_otp` from the generated confirmation link, passes it into the branded signup email, and returns `confirmation_mode: 'code' | 'link'`.
- `education-resend-otp` exists, logs a security event, regenerates a magic link, and re-sends the code.
- `EducationRegisterForm` has the verification screen: 6-digit OTP input, verify, resend with 60s cooldown, plus the "email not confirmed" path on sign-in that auto-sends a fresh code.

What has not been confirmed is that the two functions are actually deployed and that the flow works end to end against a real inbox-less test.

## What to do

1. Deploy `education-signup` and `education-resend-otp` so the running backend matches the code in the repo.
2. Run a live check with a throwaway email address:
   - call `education-signup` and confirm the response is `success: true`, `needs_email_confirmation: true`, `confirmation_mode: 'code'`, `email_sent: true`;
   - confirm an `education_profiles` row was created for the new user;
   - confirm the queued email row exists in `email_send_log` with template `signup`;
   - call `education-resend-otp` for the same address and confirm it also returns `confirmation_mode: 'code'`.
3. Walk the UI once in the browser: fill the 3-step signup form, confirm the verification screen shows the 6-digit code input (not the link-only screen) and that Resend switches to the cooldown state.
4. Clean up the test auth user and profile row created in step 2.
5. Fix anything the checks surface — most likely candidates are a missing OTP on the generated link (would fall back to link mode) or the queue worker not picking up the enqueued email.

## Technical notes

- No schema changes planned.
- Files touched only if a check fails: `supabase/functions/education-signup/index.ts`, `supabase/functions/education-resend-otp/index.ts`, `supabase/functions/_shared/signup-email.ts`, `src/components/forms/EducationRegisterForm.tsx`.
- `verify_jwt = false` is already set for both functions in `supabase/config.toml`.
