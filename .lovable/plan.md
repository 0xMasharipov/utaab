# UBpoint mobile & tablet refinement

Scope: presentation-only polish on `src/pages/projects/UBpointPage.tsx`. No new sections, no color/style changes, no business logic. Keep the existing palette, gradients, typography, splash, and animations.

## Issues observed

1. **Hero (mobile/tablet)**
   - `pt-28 md:pt-36 pb-20 md:pb-32` plus the device's `-m-16 md:-m-24` decorative coin halo causes horizontal overflow on 360–414px viewports.
   - `px-6` is tight against the device's left/right floating coins (`-left-10`, `-right-12`).
   - Logo + tagline + H1 + subtitle stack feels heavy on small screens; H1 `text-4xl` is fine but vertical rhythm needs tightening.
   - On tablet (768–1023px) the grid is still single-column (`md:grid-cols-2` starts at 768 — OK) but the device column is full-width and oversized.

2. **FloatingDevice**
   - `max-w-[360px] md:max-w-[420px]` + outer `-m-16` halo + back coins positioned with `-left-10 / -right-20` push beyond viewport on mobile.
   - Floating chip badges (`-left-4`, `-right-2`) clip on 360px screens.

3. **Showcase horizontal-scroll**
   - `useTransform(scrollYProgress, [0,1], ['5%','-30%'])` produces awkward drift on short mobile viewports where the section barely scrolls; cards barely move.
   - Card width `w-[260px]` + `gap-12` = wide track; mobile gets too much empty pull.

4. **Metrics**
   - Many `absolute` coins with `left-2 / right-2` overlap the 2-col metric grid on small screens.
   - Section padding `py-24 md:py-32` is heavy on mobile.

5. **Sponsors / Verified / Features**
   - Inconsistent horizontal padding: navbar uses `px-5 md:px-6`, others use `px-6`. Switch all to `px-5 sm:px-6` so 360px screens get 20px gutters instead of 24px.
   - Sponsor task rows: icon + title + reward cramped at <380px; allow tighter padding and smaller icon on mobile.

6. **Footer**
   - `grid md:grid-cols-4` plus `py-14` is fine, but social row + columns wrap with awkward spacing on tablet portrait.

## Changes

### `src/pages/projects/UBpointPage.tsx`

**Hero**
- Section: `pt-24 sm:pt-28 md:pt-36 pb-16 md:pb-32`.
- Container: `px-5 sm:px-6` and `gap-16 md:gap-8` so the device gets breathing room below text on mobile.
- Logo: `h-12 sm:h-16 md:h-20 mb-5 sm:mb-6`.
- H1: keep sizes; add `text-balance` for nicer wrapping on mobile.
- Subtitle: `text-base sm:text-lg md:text-xl` (already); reduce `mt-6` → `mt-5 sm:mt-6`.
- Button row: `mt-6 sm:mt-8` and wrap buttons to full-width on <380px with `w-full sm:w-auto` on both `<Button>`s for a cleaner stacked CTA.

**FloatingDevice**
- Wrapper: `max-w-[280px] sm:max-w-[340px] md:max-w-[420px]` and add `px-4 sm:px-0` to keep the halo inside the viewport.
- Outer halo: `-m-6 sm:-m-10` (was `-m-10`).
- Back-coin container: `-m-8 sm:-m-12 md:-m-24` (was `-m-16 md:-m-24`) and clamp each coin's offset on mobile: replace `-left-10 / -right-20` with `-left-4 sm:-left-10 md:-left-20` patterns across all 7 back coins so nothing exits the viewport at 360px.
- Floating chip badges: change `-left-4 / -right-2` to `left-0 sm:-left-4` and `right-0 sm:-right-2`; reduce padding `px-3 py-2 sm:px-3.5 sm:py-2.5` on mobile.
- Front-corner coins (`utaab`, `ton`, `btc`): clamp `w-16 sm:w-24 md:w-32` and tighter offsets on mobile.

**FeatureGrid**
- Container `px-5 sm:px-6`. Section `py-16 sm:py-24 md:py-32`. Title block `mb-10 sm:mb-16`. Cards `p-5 sm:p-6`.

**VerifiedOnChain**
- Container `px-5 sm:px-6`. Section `py-16 sm:py-24`. Wallet card: keep `break-all`; reduce font on mobile to `text-sm sm:text-base md:text-lg` so the truncated `0x4fF7…43A9` and badges sit on one row.

**Showcase**
- Section `py-16 sm:py-24 md:py-32`.
- Replace the parallax x-transform on mobile: keep horizontal-drift on `md:` only. On mobile, render a normal horizontal scroll with `overflow-x-auto snap-x snap-mandatory` so the user can swipe through phones — the parallax barely fires on a short mobile scroll. Implementation: detect via Tailwind classes — wrap the inner `motion.div` so `style={{ x }}` only applies at `md`+ by using `useTransform` plus a `matchMedia('(min-width: 768px)')` guard inside `Showcase` (state-based, computed once on mount + on resize). On mobile, the same flex row gets `overflow-x-auto snap-x snap-mandatory px-5 gap-8 pb-8` with `snap-center` on each card.
- Card width: `w-[240px] sm:w-[260px] md:w-[300px]`.

**Sponsors**
- Container `px-5 sm:px-6`. Section `py-16 sm:py-24 md:py-32`.
- Task row: `p-4 sm:p-5`, icon `w-10 h-10 sm:w-12 sm:h-12`, reward `text-base sm:text-lg`.

**Metrics**
- Section `py-16 sm:py-24 md:py-32`.
- Hide the four mobile-visible decorative coins (`btc top`, `ton top`, `goldCoin`, `gamepad`) behind a `hidden sm:block` toggle when their `cls` includes `left-2`/`right-2`/`-top-2` positions — they overlap the 2-col stat grid on 360px. Keep `md:block` coins as-is.
- Grid: `gap-3 sm:gap-4 md:gap-6`. Stat card `p-5 sm:p-6 md:p-8`; value `text-3xl sm:text-4xl md:text-5xl`.

**Footer**
- `px-5 sm:px-6 py-10 sm:py-14`. Grid `gap-8 sm:gap-10`. Social icons row: `gap-2`, allow wrap.

**Global**
- Wherever `max-w-7xl mx-auto px-6` appears in this file, normalize to `px-5 sm:px-6` (≈12 occurrences). No other styling changes.

## Out of scope
- No color, gradient, font, or icon changes.
- No new sections, no copy edits, no i18n key changes.
- No edits to other pages, navbar, or global CSS.
- No splash / framer animation timing changes beyond what's needed for the mobile showcase swap.

## Verification
- Re-screenshot at 360×800, 390×844, 768×1024 (portrait), 1024×768 (landscape) and confirm: no horizontal scroll, device + coins contained, chips inside viewport, showcase swipable on mobile with snap, metrics grid free of overlapping coins, consistent 20/24px gutters.
