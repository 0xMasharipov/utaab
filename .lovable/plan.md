I found the current failures are not the same CORS issue as before.

Current evidence:
- Recent education signup emails are being sent successfully.
- The affected new users exist in authentication, but their emails are still unconfirmed.
- No education profile rows were created for those users.
- The app tries to create the education profile immediately after signup from the browser, but the profile table only allows authenticated users to insert their own profile. A newly signed-up but unconfirmed user has no usable session yet, so profile creation can fail after the auth user is already created.
- Repeating signup/resend/login then causes the auth provider’s email safety limits (429), and clicking old/resent links or entering codes from an old flow can produce 401 token errors.
- Admin 2FA still uses `signInWithOtp`, but the custom magic-link email template is link-first, not code-first. That can also create confusion and 401 errors if a code field is shown while the email contains a login link.

Plan:

1. Make education signup atomic and reliable
   - Add a backend function for education signup.
   - It will validate the registration payload, create the auth user, and create the education profile server-side in one controlled flow.
   - If profile creation fails, it will return a safe generic error instead of leaving the frontend in a half-created state.
   - It will preserve email verification: users still must confirm their email before signing in.

2. Stop frontend profile insertion after signup
   - Update `EducationRegisterForm.tsx` so signup calls the new backend function instead of calling auth signup and then inserting into `education_profiles` from the browser.
   - Keep the “Check your email” confirmation screen.
   - Keep the 60-second resend cooldown and friendly 429/401 messages.

3. Repair the existing affected users automatically
   - Add a small recovery path in the new signup flow: if an auth user already exists but has no education profile, the app will not keep retrying signup and causing 429s.
   - It will show a clear “account already created, confirm your email / resend confirmation” state.
   - If safe user metadata is available, the backend can create the missing profile for existing partially-created accounts.

4. Align admin 2FA with the email being sent
   - Either make admin 2FA email code-based by updating the magic-link auth email template to show the 6-digit token, or change the admin 2FA UI to a link-based verification screen.
   - I will choose the least disruptive path: keep the admin UI’s 6-digit code flow and update the magic-link template so OTP emails clearly show the code.
   - Add `shouldCreateUser: false` to admin `signInWithOtp` calls so a typo in an admin email cannot create a new account.

5. Harden rate-limit behavior
   - Make the local `check-rate-limit` function return 200 with `{ allowed: false }` instead of HTTP 429 for expected client-side throttling, so the SDK does not treat planned throttling as function failure.
   - Keep `Retry-After` data in the JSON response for UI countdowns.
   - Preserve real abuse protection and security event logging.

6. Verification after implementation
   - Test the new signup path on the deployed backend function.
   - Verify recent email log entries still show `sent` for signup/magic-link emails.
   - Verify the frontend no longer attempts browser-side profile insertion for unconfirmed users.
   - Verify admin OTP emails display a code and admin resend cannot be spammed.

Files expected to change:
- `src/components/forms/EducationRegisterForm.tsx`
- `src/pages/admin/AdminLogin.tsx`
- `supabase/functions/check-rate-limit/index.ts`
- `supabase/functions/auth-email-hook/index.ts`
- `supabase/functions/_shared/email-templates/magic-link.tsx`
- New backend function under `supabase/functions/education-signup/`
- Possibly `supabase/config.toml` only for function-specific config if needed

Security notes:
- No client-side admin APIs will be added.
- Email verification remains required.
- Roles remain in `user_roles`, not profiles.
- Backend errors will be sanitized and not leaked to the browser.