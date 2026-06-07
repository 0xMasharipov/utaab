## Scope
`src/pages/projects/UBpointPage.tsx` only.

## Audit
All 12 coin asset pointers in the Metrics section already exist (`utaab-coin`, `gold-bar`, `titanium-bar`, `silver-bar`, `eth`, `btc`, `ton`, `ubp-usdt-angle`, `ubp-try-angle`, `gold-coin`, `steam`, `gamepad`). No new `.asset.json` files needed — the prior "missing" behaviour was caused by `hidden md:block` classes hiding everything on phones, not by 404s.

## Changes

1. **New helper `SafeCoinImg`** (inside `UBpointPage.tsx`):
   - Tracks `loaded` / `errored` state.
   - Only starts animating once the image has loaded (or once the fallback has mounted) — guarantees we never animate a zero-size `<img>`.
   - On `error`, renders a same-sized blue-gradient placeholder div with the same position classes and glow shadow, so the floating layout slot is preserved.
   - Adds `fetchpriority="low"` to keep decorative coins from competing with the hero on mobile.
   - Accepts a `sizes` prop.

2. **Responsive `sizes` (proper-srcSet equivalent):**
   The Lovable CDN at `/__l5e/assets-v1/...` does not transform images, so width-descriptor `srcSet` URLs would 404. Instead, set explicit `sizes` matching the Tailwind width classes so the browser picks the right intrinsic resolution. Desktop-only coins get `(min-width: 768px) Npx, 0px` so mobile browsers don't reserve bandwidth. Mobile coins get the full 3-step cascade.
   Leave a TODO comment that, if multi-resolution variants are later uploaded via `lovable-assets`, they should be wired into a real `srcSet`.

3. **Gated animations:**
   - `tier === 'full'` → full y + rotateZ keyframes (unchanged).
   - `tier === 'reduced'` (mobile) → small-amplitude y only, slower (unchanged from previous turn).
   - `tier === 'minimal'` or `prefers-reduced-motion` → no animation, static placeholder.
   - In all tiers, animation only starts once the asset is present.

4. **Mobile coin set & positions** stay as set in the previous turn (4 coins around the metric grid).

## Out of scope
- No new physical image variants uploaded to the CDN (would require per-file `lovable-assets` runs; defer until requested).
- No edge-function or data changes.
- No copy / i18n changes.
- No hero/FloatingDevice changes.

## Verify
- 375 px & 692 px: 4 coins (or fallback discs) render around the metric grid with a gentle float; cards never reflow.
- ≥768 px: full coin spread + full animation (unchanged).
- Force a coin URL to 404 in DevTools → blue gradient disc appears in the same slot, still floats.
- `prefers-reduced-motion: reduce` → coins/placeholders visible but static.
