# Plan: Branded Animated 404 + lovable.app Link Audit

## 1. Audit: lovable.app references

Searched the entire codebase. Findings:

**User-facing links/buttons:** None. No button, anchor, or navigation in the app routes users to `lovable.app`.

**Remaining references (server-side only, must stay):**
- `supabase/functions/_shared/cors.ts` — CORS allowlist
- `supabase/functions/track-visit/index.ts` — CORS allowlist
- `supabase/functions/contributor-match/index.ts` — CORS allowlist

These are required so the Lovable preview environment (`*.lovable.app`) can still call edge functions during development. They are not links the user sees or clicks. **No change needed.**

**Internal note:** `.lovable/plan.md` mentions the old URL as historical context; it's not shipped.

Conclusion: no user-facing `lovable.app` link exists. All navigation already targets `utaab.org` or relative routes.

## 2. New branded animated 404 page

Replace the current minimal `src/pages/NotFound.tsx` (gray background, plain text) with a fully branded UTAAB experience.

### Design

- **Background:** Dark navy (`#061224` / `bg-background`) matching the site's Web3 atmosphere, with the existing `BackgroundGrid` overlay and a soft animated radial glow.
- **Centerpiece:**
  - UTAAB logo (`@/assets/logo-new.webp`) with a slow floating animation (`animate-pulse` + custom float keyframe).
  - Large "404" headline using Montserrat 800, gradient text (white → accent blue), with a subtle glitch/shimmer animation.
  - Localized tagline: "This page drifted off the chain." (i18n keys for EN/TR/RU/AR).
  - Short descriptive line explaining the page wasn't found.
- **Actions (two buttons, brand-styled):**
  - Primary: "Return Home" → `/`
  - Secondary (ghost): "Explore Education" → `/education`
- **Footer micro-line:** small "UTAAB · CONNECT · LEARN · BUILD" tagline at the bottom.
- **Animations:**
  - Fade-in + scale-in entrance for the card.
  - Floating logo (3s ease-in-out infinite).
  - Animated gradient sweep across the "404" text.
  - Soft pulsing radial glow behind the logo.
  - Reduced-motion respected via `motion-reduce:` Tailwind variants.

### Technical changes

1. **`src/pages/NotFound.tsx`** — full rewrite:
   - Use `BackgroundGrid`, `BottomGradientOverlay` for visual continuity.
   - Import logo from `@/assets/logo-new.webp`.
   - Use `useTranslation` with new keys under `notFound.*`.
   - Use shadcn `Button` components with `Link` from `react-router-dom` (no `lovable.app`, no external URLs).
   - Add `<Helmet>`-free `document.title` update in `useEffect` for "404 — UTAAB".
2. **`src/index.css`** — add two small keyframes if not already present:
   - `@keyframes float-slow` (translateY 0 → -8px → 0)
   - `@keyframes gradient-sweep` (background-position shift)
   - Plus utility classes `.animate-float-slow` and `.animate-gradient-sweep`.
3. **`src/i18n/locales/{en,tr,ru,ar}.json`** — add:
   - `notFound.title` ("404")
   - `notFound.heading` ("Lost in the chain")
   - `notFound.message` ("The page you're looking for doesn't exist or has been moved.")
   - `notFound.backHome` ("Return Home")
   - `notFound.exploreEducation` ("Explore Education")
   - `notFound.tagline` ("CONNECT · LEARN · BUILD")

### Files touched
- `src/pages/NotFound.tsx` (rewrite)
- `src/index.css` (append keyframes/utilities)
- `src/i18n/locales/en.json`, `tr.json`, `ru.json`, `ar.json` (add keys)

### Out of scope
- No edge function changes (CORS allowlists stay).
- No router changes (`*` route already maps to `NotFound`).
- No new dependencies.
