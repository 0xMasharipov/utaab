# UBpoint Coin Animation — Robustness, Debug Panel, Load Sync

## 1. Finish reliably across scroll / re-renders
- In `FloatingDevice`, memoize the `allBackCoins`/`backCoins` arrays with `useMemo` keyed on `tier` so re-renders don't recreate object identities.
- Drive the spread with `useAnimationControls`:
  - One controls instance for back coins (variant-style targets keyed by index), one each for utaab/ton/btc.
  - In a `useEffect` triggered when `heroReady` flips true, call `controls.start(...)` once. Guard with a `startedRef` so it never restarts on subsequent renders / tier override toggles.
  - `onAnimationComplete` sets `doneRef`, after which the idle float (gated by `loop`) is enabled.
- Result: even if the user scrolls immediately, hides the tab, or React re-renders the tree, the spread animation runs to completion exactly once.

## 2. Sync coin entrance with hero image + fonts
- Extend `SplashContext` value to `{ ready, heroReady, tier, tierOverride, setTierOverride }`.
- In `UBpointPageInner`, add a `heroReady` state. It flips `true` only when ALL of these are satisfied:
  - `ready === true` (existing splash done)
  - `mockupAsset` image fully decoded (already part of `HERO_CRITICAL_ASSETS`, but we add an explicit `Image().decode()` await that sets `mockupDecoded`)
  - `document.fonts.ready` resolved (with 1.2s fallback)
- All coin `animate` triggers switch from `ready` → `heroReady`. The phone mockup keeps using `ready` so the device itself can settle while coins wait for fonts/images.

## 3. No-console debug panel for tier preview
- New tiny component `PerfDebugPanel` rendered inside `SplashContext.Provider`, visible only when `location.search` contains `perf-debug=1` OR `localStorage.getItem('ubpoint-perf-debug') === '1'`. Toggle shortcut: `Shift+P` (no console needed).
- Fixed bottom-right card with three buttons: `full / reduced / minimal` plus `Reset (auto)` and `Replay spread`. Updates a `tierOverride` state in `UBpointPageInner`.
- Effective tier provided through context is `tierOverride ?? tier`.
- `Replay spread`: clears `sessionStorage['ubpoint-splashed']`, resets `heroReady` to false, then re-runs the load-sync effect so the spread plays again without a page reload.
- Panel uses existing Tailwind tokens (white/blue palette), no new deps.

## Performance & scope
- All new logic lives in `src/pages/projects/UBpointPage.tsx` (plus the panel as a local component in the same file). No new files, no new packages.
- `useAnimationControls` is already part of framer-motion; no bundle impact.
- Idle-float `repeat: Infinity` loops still gated by `loop = effectiveTier === 'full'`, preserving the existing perf guardrails.
- Debug panel is excluded from production paint unless the query/localStorage flag is set.

## Files
- `src/pages/projects/UBpointPage.tsx` (only)