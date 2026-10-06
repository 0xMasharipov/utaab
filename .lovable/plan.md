# Apply UTAAB templates to authentication emails

## What will change
- Restyle all six account emails with the existing UTAAB email design: navy background, centered white card, UTAAB logo, “CONNECT · LEARN · BUILD”, Montserrat typography, divider, and `© Powered by UTAAB` footer.
- Use the branded dark code box for verification codes and the branded dark button for confirmation links.
- Make the signup template support both flows already in use:
  - a six-digit code for student registration and resend-code emails,
  - a confirmation button when a confirmation link is supplied.
- Keep the wording specific to each email: signup, invitation, sign-in, password recovery, email change, and identity verification.

## Release and checks
- Publish the updated authentication email sender and the two student code services so they all receive the same templates.
- Render previews to check the logo, spacing, code, buttons, and footer.
- Send an admin sign-in code and a student registration/resend code, then confirm both are accepted by the mail service.

## Technical details
- Update the shared React Email templates under `supabase/functions/_shared/email-templates/` rather than creating a second design system.
- Preserve all six required authentication email types in the existing sender map.
- Redeploy `auth-email-hook`, `education-signup`, and `education-resend-otp`; the shared template code is bundled when each service is deployed.
