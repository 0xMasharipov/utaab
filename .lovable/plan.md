# Add TonRa Project Page + Telegram Beta Link

## Goal
- Make the TonRa card on the home `Projects` section clickable, navigating to a new dedicated page `/projects/tonra`.
- The new page describes what TonRa does and provides a prominent CTA button linking to the Telegram bot: `https://t.me/TonRa_Robot` ("Try Early Beta") with a note that some features are still under development.

## Scope

### 1. New page: `src/pages/projects/TonRaPage.tsx`
- Reuses site shell: `Navbar`, `Footer`, `BackgroundGrid`, `BottomGradientOverlay` for visual consistency with the rest of the site.
- Sections (all i18n via `react-i18next`):
  1. **Hero**: Project name, "Under Development" badge, tagline ("Explore TON with more confidence."), short polished intro, two CTAs:
     - Primary: "Try Early Beta on Telegram" → opens `https://t.me/TonRa_Robot` in new tab (`rel="noopener noreferrer"`).
     - Secondary: "Back to Projects" → anchor to `/#projects`.
     - A small notice: "Some features are still under development."
  2. **What is TonRa?** — full descriptive copy from the user's brief.
  3. **What is TonRa used for?** — bullet list (wallet checks, token review, project risk, fake airdrop detection, quick risk overview, safer decisions). Render as a grid of glass cards with lucide icons (`Wallet`, `Coins`, `ShieldAlert`, `Gift`, `Activity`, `CheckCircle2`).
  4. **Why TonRa matters** — paragraph block in a `GlassCard`.
  5. **CTA footer**: large "Open TonRa on Telegram" button with the bot URL and the under-development note.
- Visual style: matches existing dark Web3 palette, Montserrat headings (already global), blue glow on the TonRa hero image (`/images/projects/UTAAB_TonRa.webp`) reusing the same `drop-shadow-[0_8px_24px_rgba(59,130,246,0.18)]` pattern from `Projects.tsx`.
- Use `framer-motion` entrance animations consistent with home sections.
- Set document title via a small `useEffect` to "TonRa — Telegram Security Bot for TON | UTAAB".

### 2. Routing — `src/App.tsx`
- Lazy-import the new page and add a route:
  ```tsx
  const TonRaPage = lazy(() => import("./pages/projects/TonRaPage"));
  // ...
  <Route path="/projects/tonra" element={<TonRaPage />} />
  ```

### 3. Make the TonRa card clickable — `src/components/Projects.tsx`
- Extend the `Project` interface with an optional `href?: string`.
- Add `href: '/projects/tonra'` to the TonRa entry.
- Wrap each `GlassCard` whose project has `href` with a React Router `<Link>` (the rest stay as-is). Add `cursor-pointer`, focus ring, and an "Open" hover affordance (small arrow icon top-right of the card) only when `href` is set.

### 4. i18n strings (EN, TR, RU, AR)
- Add a new namespace block under `projects.tonraPage`:
  - `hero.tagline`, `hero.intro`, `hero.tryBeta`, `hero.backToProjects`, `hero.devNote`
  - `whatIs.title`, `whatIs.body` (multi-paragraph; rendered by splitting on `\n\n`)
  - `usedFor.title`, `usedFor.items.wallet|token|project|airdrop|overview|decisions` (each: `title` + `desc`)
  - `why.title`, `why.body`
  - `cta.title`, `cta.button`, `cta.note`
- English copy comes verbatim from the user's brief; TR/RU/AR are translated equivalents.

## Technical notes
- External link uses `<a href="https://t.me/TonRa_Robot" target="_blank" rel="noopener noreferrer">` — no new dependencies.
- Telegram icon: use `MessageCircle` from `lucide-react` (already used in the project) to avoid adding the brand SVG. If a Telegram glyph is preferred, an inline `<svg>` can be added without a new package.
- All content is static — no backend, no Supabase changes, no edge functions.
- No security memory or RLS changes required.

## Files touched
- `src/App.tsx` (add lazy import + route)
- `src/components/Projects.tsx` (clickable card via `Link` when `href` is set)
- `src/pages/projects/TonRaPage.tsx` (new)
- `src/i18n/locales/{en,tr,ru,ar}.json` (new `projects.tonraPage` strings)

## Out of scope
- No changes to other project cards, Telegram connector setup, or actual bot integration — the page only links out to the existing `@TonRa_Robot` bot.