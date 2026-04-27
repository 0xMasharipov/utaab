I found two separate issues in the auth flow:

1. The email queue is working: recent signup emails were enqueued and sent successfully.
2. The remaining 429 is from the authentication service’s built-in safety cooldown when the same user/email requests signup/verification too quickly.
3. The likely 401 is from the app showing a 6-digit OTP screen even though the current signup email template is a link-based confirmation email. Users then try to enter/verify a code that was never sent for that signup path.

Plan to fix:

1. Update education signup UX
   - After signup, do not immediately show the 6-digit OTP input.
   - Show a clear “check your email” confirmation screen with a button/link-style instruction matching the actual verification email.
   - Keep the WhatsApp/community next step after successful verification/access.

2. Make resend safe and prevent 429 loops
   - Keep the cooldown, but make it stricter and aligned with the backend safety window.
   - Disable repeated signup/resend attempts while a request is pending.
   - Improve the 429 message to say exactly what to do: wait a few seconds/minute before trying again.
   - Avoid calling resend automatically or repeatedly from unconfirmed-login handling.

3. Fix OTP verification type handling
   - For education login, only show OTP input for real email OTP login flows.
   - For signup confirmation, use link/email confirmation messaging instead of `verifyOtp(type: signup)` unless the system is explicitly sending OTP codes.
   - Keep admin 2FA OTP flow intact because admin login intentionally uses email OTP.

4. Improve error handling for 401 and 429
   - Map auth 401/invalid-token verification failures to a friendly “verification expired or invalid, request a new email” message.
   - Preserve secure generic backend errors and avoid leaking raw technical details.

5. Verify after implementation
   - Test normal signup path: submit once, email sent, no OTP mismatch screen.
   - Test repeated signup/resend: UI blocks rapid repeats and shows friendly cooldown text.
   - Test existing admin 2FA: OTP still works and remains protected.
   - Check recent auth logs and email queue logs to confirm emails continue sending.

Technical notes:

- The email queue (`auth-email-hook` → `auth_emails` → `process-email-queue`) is already active and recent logs show `pending` then `sent` rows.
- No database schema change is needed.
- The main code changes will be in the education auth form and shared error mapping; backend deployment is only needed if we adjust auth email templates or any backend function code.