# Architecture Rules

- Account and transactional emails must reuse the shared UTAAB React Email shell so branding and accessibility remain consistent across every sending path.
- CUTII chat uses xAI Grok through the server-side `GROK_API_KEY` so provider credentials never reach the browser.
- Email/password sign-in requires a fresh email OTP for both education users and administrators so a password alone never grants account access.