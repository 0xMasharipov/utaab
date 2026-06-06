Add a one-time intro splash on the UBpoint hero: scroll is locked until every coin/asset has erupted from behind the phone and faded into its final orbit position.

### Behavior
1. On page mount: lock `document.body.style.overflow = 'hidden'` and `document.documentElement.style.overflow = 'hidden'`. Stash previous value.
2. A full-viewport transparent overlay sits over the hero only (`fixed inset-0 z-[60]`) capturing pointer events (`pointer-events-auto`) and showing a soft "Loading the economy…" hint at the bottom. Cursor stays visible but page interaction is blocked.
3. Start a master splash timeline (~1.8s total) using a shared `isReady` flag in `UBpointPage`:
   - Each floating asset (`FloatingDevice` back-layer coins + UTAAB/TON/BTC + toasts) starts at `scale: 0.2`, `opacity: 0`, `x/y: 0` (centered behind the phone).
   - Stagger them out to their resting `cls` positions with `scale: 1`, `opacity: 1`, fading in and easing into their final spot. Use `motion` `initial` + `animate` with `transition={{ delay: i * 0.12, duration: 0.7, ease: [0.16,1,0.3,1] }}`.
   - Phone itself slides up + fades in slightly ahead of coins.
4. When the longest coin finishes (use a `setTimeout` matching the last delay+duration, ~2000ms), set `isReady=true`, restore `body/html overflow`, remove the overlay, and resume the existing infinite float loops.
5. Persist via `sessionStorage.setItem('ubpoint-splashed', '1')` so revisits in the same tab skip the splash (immediately mount in final positions, scroll unlocked).

### Implementation notes
- Add a `SplashContext` (simple React context) at the top of `UBpointPage` providing `{ ready, started }`.
- `FloatingDevice` reads context: when `!ready`, render each asset with `initial={{ opacity:0, scale:0.2, x:0, y:0 }}` and `animate={{ opacity:1, scale:1, x:0, y:0 }}` (target = the asset's actual offset; CSS `cls` positioning stays). After ready, the existing infinite `animate={{ y:[...] }}` floats take over (swap `animate` based on `ready`).
- Overlay component is rendered conditionally inside `UBpointPage` at the root. Includes a small centered "Initializing UBpoint" pill with a pulsing dot, plus a hint "scroll to continue" that appears the moment splash finishes.
- No new dependencies; pure framer-motion + a `useEffect` for scroll lock.

### Out of scope
- No real "mouse capture" via Pointer Lock API (would hide cursor and feel broken). The overlay blocks page scroll/click which matches the user's intent.
- Splash only on first visit per tab; doesn't fire on internal navigation back.