## Goal
Fix the UBpoint page so it no longer flashes a dark background and no longer crashes during render on mid/low-end devices. Keep the existing light, premium look — only remove the parts that are causing instability.

## 1. Wrap the page in an error boundary
- Add a small local error boundary inside `src/pages/projects/UBpointPage.tsx` that, on any render error, swaps the page out for a clean light-themed fallback (logo + short message + "Reload" + "Back to UTAAB").
- This guarantees a single broken component (motion, image decode, intersection observer) can never collapse the whole route to a blank/dark screen.

## 2. Lock the page background so dark UI cannot bleed through
- Force the page wrapper to paint an opaque white background on `<html>` and `<body>` for the lifetime of the route (set in a `useEffect`, restored on unmount).
- Hide the global `BottomGradientOverlay` while the UBpoint page is mounted (it's a fixed, dark, site-wide element that shows through the page's translucent sections and behind the splash fade-out).
- Remove the `backdrop-blur-[2px]` layer from the splash overlay's exit animation — that blur layer is what causes the visible dark frame as it fades, because the page underneath hasn't fully painted yet.

## 3. Reduce the motion stack that causes the crashes
Keep the visual identity but cut the GPU cost that is causing tab crashes:
- Remove the 18 animated particles in `HeroBackground` (purely decorative, highest cost per frame).
- Drop the three large blurred blobs from 3 to 1, and remove their `animate` loops (keep them static — the blur is the expensive part, not the motion).
- Remove `filter: blur(8px) → blur(0px)` transitions from the coin / device intros — animate `opacity` + `scale` only. Filter animations on 10+ layered images are the single biggest crash trigger here.
- Replace the parallax `useScroll` / `useTransform` band with a static layout (or gate it behind `prefers-reduced-motion` and a desktop-only check).
- Respect `prefers-reduced-motion`: when set, render the page with no looped `animate` props at all (coins, device float, blobs all static).

## 4. Make the splash bullet-proof
- Hard-cap the splash at 1500ms (currently 3000ms) and always release `body/html overflow` in a `finally`-style cleanup, even if the component throws.
- Run the splash overlay only on the first visit per tab (already gated by `sessionStorage`) — keep that, but also skip the splash entirely if `prefers-reduced-motion` is set or if the device reports `navigator.deviceMemory <= 4`.
- Make the splash overlay itself opaque white (not a translucent gradient) so there is zero chance of the dark app background showing through during the fade.

## 5. Verify
- Open `/projects/ubpoint` in the preview and confirm:
  - No dark flash on first load, on refresh, or on navigating back to the page.
  - The page renders fully on a throttled mobile profile without the tab crashing.
  - Reduced-motion users get a fully static, still-pretty page.
  - If any internal component throws, the error boundary shows a light fallback instead of a blank/dark screen.

## Technical notes (for the implementer)
- All changes are confined to `src/pages/projects/UBpointPage.tsx` plus a one-line conditional hide of `BottomGradientOverlay` where it is rendered globally (likely `src/App.tsx`) — gated on `location.pathname.startsWith('/projects/ubpoint')`.
- No backend, no schema, no design-token, no translation changes.
- Keep all current copy, layout, colors, and section order. This is purely a stability + paint-correctness pass.
