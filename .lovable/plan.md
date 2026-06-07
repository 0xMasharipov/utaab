# Staggered Coin Spread Animation — UBpoint Hero

## Goal
Make the decorative coins in the hero spread outward from behind the phone in a subtle, staggered sequence that feels organic and smooth, without adding new continuous animations or GPU load.

## Changes
1. **Increase stagger gaps** on `backCoins` from `i * 0.08` to `i * 0.14` so each coin enters noticeably after the previous one.
2. **Interleave front-coin delays** (utaab, ton, btc) between the back-coin wave so the sequence reads as one outward ripple rather than two separate layers.
3. **Add a subtle initial rotation** (`rotateZ: ~12°` toward the phone center) that settles to `0°`, reinforcing the "emerging from behind" illusion. Only applied to the initial entrance transition, not a continuous loop.
4. **Keep existing performance guardrails**: `reduced` shows first 3 backCoins, `minimal` shows none, `loop` still gates idle floating. No new `repeat: Infinity` animations are introduced.

## Performance
- All changes are one-shot `initial → animate` transitions already present in the DOM.
- No extra `requestAnimationFrame` loops or physics calculations.
- `usePerfGuard` tier logic remains untouched.

## Files to edit
- `src/pages/projects/UBpointPage.tsx` (hero `FloatingDevice` component only)