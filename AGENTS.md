# Architecture Rules

- Account and transactional emails must reuse the shared UTAAB React Email shell so branding and accessibility remain consistent across every sending path.
- CUTII chat uses xAI Grok through the server-side `GROK_API_KEY` and a curated public UTAAB knowledge block so credentials stay private and organization answers remain factual.
- CUTII owns a local copy of Thinking Orbs so its required desktop/iOS motion parity does not inherit the package's reduced-motion freeze.
- Email/password sign-in requires a fresh email OTP for both education users and administrators so a password alone never grants account access.
- Community applications accept omitted legacy motivation as an empty string server-side; frontend, server validation and storage constraints must agree so joining never requires an essay.
- Footer ASCII graphics and the clipped icon-only brand mark share a decorative layer beneath footer content; the local renderer opts into continuous gentle motion with an animated Canvas2D fallback, semantic palette tokens, near-view loading and off-screen/hidden-tab pausing so desktop/iOS motion parity never blocks navigation or wastes rendering work.

- Public page wrappers reuse the Navbar entry point for a local bottom floating menu with frame-batched scroll tracking and lazy-footer observation; education/admin retain independent navigation so public redesigns do not affect account flows.
- Public floating-menu motion uses a single timed shell with explicit dimensions and permanently mounted content measured at its expanded width; this prevents Safari reflow jumps, supports tap reversal, and keeps closed content inert with a gentle reduced-motion fade.
- TeamPage uses the local portrait roster over useTeamMembers with separate reveal and full-profile actions; CSS transform loops pause on selection, profile display, hidden tabs and off-screen state, while decorative duplicates stay outside keyboard navigation and an ordered directory keeps every member accessible.
