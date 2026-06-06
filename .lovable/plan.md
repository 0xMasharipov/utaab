# UBpoint Page — Preload + Fade-In + Localization

Three coordinated changes to `src/pages/projects/UBpointPage.tsx` plus the four locale files.

## 1. Preload all image assets before reveal

Currently the splash overlay disappears on a fixed 2.4s timer regardless of whether the coin / mockup / logo images have actually decoded, so users see the phone and coins pop in statically.

Approach:
- Collect every asset URL used on the page into a const array: `logoAsset`, `mockupAsset`, `utaabCoinAsset`, `tonCoinAsset`, `ethCoinAsset`, `btcCoinAsset`, `goldCoinAsset`, `goldBarAsset`, `steamAsset`, `titaniumBarAsset`, `silverBarAsset`, `gamepadAsset`, `usdtAngleAsset`, `tryAngleAsset`.
- In the page-mount `useEffect`, inject `<link rel="preload" as="image" href=... fetchpriority="high">` tags into `<head>` for the hero-critical images (logo, mockup, utaab coin) and `fetchpriority="low"` for the rest. Clean up on unmount.
- In parallel, run `Promise.allSettled(urls.map(u => { const img = new Image(); img.src = u; return img.decode().catch(() => {}); }))`. Only flip `ready=true` once that resolves OR after a 3000 ms safety timeout — whichever happens first. This replaces the existing fixed 2400 ms timer.
- Splash overlay copy stays; just gated on real readiness now.

## 2. Graceful fade-in for assets (no static pop)

- Convert every `<img>` of the coin/mockup/logo binaries on the page to use a small inline pattern: `opacity-0` until its own `onLoad` flips a per-image state, then transition `opacity 600ms cubic-bezier(0.16,1,0.3,1)` to `1`. (We don't use `AnimatedImage` because the page uses absolute positioning + custom drop-shadows / float keyframes that conflict with its wrapper div.)
- Implement as a tiny local `<FadeImg>` component inside `UBpointPage.tsx` (same props as `img`, adds opacity transition on first load). Apply everywhere a raw `<img>` shows a coin/mockup/logo asset: light navbar logo, hero floating coins, hero phone mockup, in-app mockup back-coins, rewards screen item thumbnails, sponsors floating gold coin, final CTA logo, footer logo.
- This stacks with the existing splash blur/scale animation for the back-layer coins (they still animate in from behind the phone) but also fixes images that appear **after** the splash ends.

## 3. Localization

The page is currently 100% hard-coded English while the rest of the site uses `react-i18next` with `en/ru/tr/ar`.

- Add `useTranslation()` to `UBpointPage`, `LightNavbar`, `FeatureGrid`, `Sponsors`, `Rewards`, `Footer`, and the in-mockup screens.
- Introduce a single new namespace key `projects.ubpointPage` in each locale file with sub-sections:
  - `nav` — Features, Inside the app, Sponsors, Rewards, Open App
  - `hero` — kicker, title parts (`titleStart`, `titleAccent`), subtitle, launchApp, viewRewards, liveOnBase, onChainVerified
  - `inApp` — earned, onChain, verifiedBase, goodMorning, totalUBP, plus50, earn, redeem, send, recent, hackathon, workshop, reward, streak, keepGoing, rewardsTitle, items (steam, silver, partner, gold)
  - `features` — sectionEyebrow, sectionTitle, sectionDesc + 6 cards (title/desc)
  - `verification` — title, copyAddress, viewOnExplorer, etc.
  - `sponsors` — eyebrow, title, body, benefits list, ctaSponsor, tasksTitle, tasks (follow/discord/tryApp)
  - `rewards` — eyebrow, title, body, viewAll
  - `cta` — title, body, launchApp
  - `footer` — links, rights
- Translate to `ru`, `tr`, `ar` (Arabic gets RTL via existing site mechanism — no extra layout work needed since the page mostly uses centered/flex layouts; spot-check obvious issues only).
- Keep technical strings untouched: "UBP", "UBpoint", "Base", contract address, "UTAAB".
- Date/number formatting and pluralization are not used on this page, so no extra config needed.

## Out of scope
- No changes to other pages, the global navbar, or routing.
- No changes to icons, layout, colors, gradients, splash motion timing curve, or splash design.
- No new dependencies. No new image assets.

## Technical notes
- Preload links are injected client-side (page is SPA) so we don't bloat `index.html`. Critical hero assets get `fetchpriority="high"`, decorative back coins get `low`.
- `image.decode()` returns a promise once pixels are ready; this is what eliminates the visible decode flash on slower devices.
- The existing `splashTransition()` staggered blur-in for back-layer coins stays exactly as is — it now fires against pre-decoded images, which is the whole point.
- All four locale JSON files (`src/i18n/locales/{en,ru,tr,ar}.json`) get the same `projects.ubpointPage` block; existing keys untouched.
