## Goal
On the UBpoint hero only (`src/pages/projects/UBpointPage.tsx` → `FloatingDevice` / `HeroBackground`), remove the gamepad asset, make the surrounding coin/bar images larger, and have all of them enter from behind the phone mockup and spread outward to their final positions. The phone mockup itself is untouched. Nothing outside the hero is affected (the lower `Sponsors`/`Metrics` coin clouds keep their current sizes).

## Changes

1. **Drop gamepad from the hero**
   - Remove the `gamepadAsset` import (line 55).
   - Remove its preload entry (line 74).
   - Remove the gamepad row from `allBackCoins` (line 271).
   - Leave the gamepad usage in the lower `Sponsors` section (line 1047) intact — user asked for hero only.

2. **Enlarge hero coins** (sizes only, no layout/anchor changes)
   - `allBackCoins` widths bumped roughly +40–60%:
     - usdt-angle / try-angle / steam: `w-16 sm:w-24 md:w-36`
     - eth / gold-coin: `w-14 sm:w-20 md:w-32`
     - silver-bar: `w-16 sm:w-24 md:w-32`
   - Front foreground coins:
     - utaab (left): `w-24 sm:w-36 md:w-48`
     - ton (top-right): `w-20 sm:w-28 md:w-40`
     - btc (bottom-right): `w-14 sm:w-20 md:w-28`
   - Phone container (`max-w-[280px] … md:max-w-[420px]`) and the `mockupAsset` `<img>` stay exactly as they are.

3. **All decorative coins appear from behind the phone and spread out**
   - Lower the z-index of every decorative coin so it sits beneath the phone:
     - The existing `backCoins` wrapper already has no z — keep it, but add `z-0`.
     - The three front coins (utaab/ton/btc, lines 368–412) currently render above the phone because they come later in the DOM. Add `z-0` (or wrap in a `z-0` div) so they end up behind the phone (phone wrapper is `z-10`).
   - Add a `from: { x, y }` offset per coin describing where it starts (roughly at the phone's center relative to its own anchor). For each coin we pick a translate that pushes it inward toward the device:
     - Left-anchored coins: positive `x` (e.g. `120`–`160`px), small `y` toward center.
     - Right-anchored coins: negative `x` of similar magnitude.
     - Top/bottom adjustments via `y` (positive for top coins, negative for bottom coins).
   - Update each motion node to:
     ```
     initial={{ opacity: 0, scale: 0.35, x: from.x, y: from.y }}
     animate={ready ? { opacity: 1, scale: 1, x: 0, y: 0 } : initial }
     transition={{ ...splashTransition(i+2), duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
     ```
   - The inner `motion.img` keeps its existing idle float loop (gated by `loop`), so once they finish spreading they continue the gentle hover motion in `full` tier. In `reduced`/`minimal` they just settle and stop, same policy as today.

4. **Performance tiers untouched**
   - `tier === 'minimal'` → no decorative coins (unchanged).
   - `tier === 'reduced'` → still first 3 backCoins; the spread animation is a one-shot transform (cheap), so it stays enabled. Loop float still disabled.
   - `tier === 'full'` → full set + spread + idle float.

5. **Verify**
   - Build clean.
   - Hero: phone size unchanged, gamepad gone, remaining coins visibly larger, on load they start hidden behind the phone and animate outward to their final spots, then idle-float (full tier).
   - Lower sections (`Sponsors`, `Metrics`) visually unchanged.

## Technical notes
- No new dependencies, no design tokens, no copy changes.
- Only `src/pages/projects/UBpointPage.tsx` is edited.
- Splash/perf-guard plumbing (`useSplash`, `usePerfGuard`, `splashTransition`) is reused as-is.
