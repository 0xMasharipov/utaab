## Problem

In `src/pages/projects/UBpointPage.tsx` → `Metrics` section ("A growing on-chain economy"), the decorative coin assets disappear on mobile and never animate. Two causes:

1. **Visibility classes hide them on mobile.** When `usePerfGuard` returns `'reduced'` (which it does on every coarse-pointer device ≤768 px wide), the section uses `allCoins.slice(0, 3)` — but those first 3 coins are all tagged `hidden md:block`, so on a phone (current viewport 692 px) **zero coins render**. The remaining `hidden sm:block` coins are also excluded by the slice.
2. **Animations are gated on `tier === 'full'`.** `loop` is `false` on mobile, so even if a coin rendered, the float/rotate animation would not run.

## Fix

Scope: visual-only change inside the `Metrics` component. No business logic, no asset re-uploads — all coin assets already exist and load fine in the hero on the same page.

1. **Re-pick a mobile-safe coin subset.** Replace the current `tier === 'reduced' ? allCoins.slice(0, 3)` with an explicit array of 3–4 coins that are visible on phones (use `sm:` or no breakpoint prefix, with smaller `w-` sizes and safer positions so they don't overlap the metric cards). Use the existing `btcCoinAsset`, `tonCoinAsset`, `goldCoinAsset`, `gamepadAsset` (all already imported, already light, already proven to render on mobile in other sections).
2. **Remove `hidden md:block` from the chosen mobile coins** and give them mobile-first positions (corners of the section, behind the cards) with `w-12`/`w-14` sizes plus `md:w-20`+ for desktop.
3. **Enable a lightweight loop on `reduced` tier** for this section only: keep the same `loop` flag for `full`, but on `reduced` add a slower (12–14 s), smaller-amplitude (`y: [0,-6,0]`) animation so mobile sees gentle motion without taxing the GPU. `minimal` tier (and `prefers-reduced-motion`) stays static — no change there.
4. **Keep the desktop layout untouched** — the `hidden md:block` coins continue to render as today on ≥768 px.

## Out of scope

- No changes to hero/FloatingDevice (already works on mobile).
- No new image assets; no edge-function or data changes.
- No changes to copy or i18n.
- No changes to perf-guard thresholds.

## Verify

- Resize preview to 375 px and 692 px: 3–4 coins visible around the metric grid, gently floating.
- Resize to ≥768 px: identical to today (full coin spread + full animation).
- With `prefers-reduced-motion: reduce`: coins visible but static.
