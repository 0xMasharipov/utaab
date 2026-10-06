# Join our community — heading + premium glass form redesign

## Goal
Add a "Join our community" heading block above the community application form and restyle the 4-step wizard to the selected **Premium glass tech** direction. No functional changes.

## Scope (home page `/#join`)
1. **Heading block above the form** (`src/components/Join.tsx`)
   - Title: "Join our **community**" (accent-colored word, Montserrat 800), centered.
   - Subtitle: "Apply to become a part of the UTAAB ecosystem."
   - New i18n keys (en, tr, ru, ar) so the heading is localized like the rest of the form.

2. **Form card restyle** (`src/components/forms/CommunityJoinForm.tsx` + `src/index.css` join-* tokens)
   - Step indicator: labeled steps (Profile / Experience / Portfolio / Final) under numbered circles; active step gets the accent glow ring + soft glow shadow; connectors update as steps complete.
   - Inputs: small uppercase letter-spaced labels; darker field background, `white/10` borders, rounded-xl, accent focus ring/glow (existing `join-input` token upgraded).
   - Select, interest/track chips, textarea counter, and consent checkboxes restyled to match (chips become selectable tiles with accent border + glow when active).
   - Buttons: primary action becomes a blue gradient with glow shadow, hover arrow nudge; Back becomes a quiet glass button.
   - Success card gets the same heading, glass and button treatment.
   - All styling via existing semantic tokens / `index.css` utilities — no hardcoded colors in components; no purple; dark Web3 navy glass language.

3. **Omitted on purpose**
   - The prototype's "Join 2.5k+ contributors" counter — that number is invented, so it will not be shown.

## Untouched
Field set and order, Zod validation, captcha, rate limiting, honeypot, `submit-community-application` call, security logging, and the WhatsApp redirect after submission all stay exactly as they are.

## Verification
- TypeScript check and preview build pass.
- Playwright: heading renders above the form; step 1–4 navigation and styles intact; success card renders after a (local) submit path check where feasible.
