# Architecture Rules

- Account and transactional emails must reuse the shared UTAAB React Email shell so branding and accessibility remain consistent across every sending path.
- CUTII chat uses xAI Grok through the server-side `GROK_API_KEY` and a curated public UTAAB knowledge block so credentials stay private and organization answers remain factual.
- CUTII owns a local copy of Thinking Orbs so its required desktop/iOS motion parity does not inherit the package's reduced-motion freeze.
- Email/password sign-in requires a fresh email OTP for both education users and administrators so a password alone never grants account access.
- Visible product branding uses the shared BrandLogo component so the supplied logo stays consistent across public, education, and administration surfaces.