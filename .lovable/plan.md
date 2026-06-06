# Stronger WebGL Detection + Robust Certificate Fallback

## Goal
Guarantee that the Verify Certificate page always shows a clean, branded certificate visual — never a blank canvas, never a thrown error, never an infinite spinner — regardless of the user's GPU, driver, browser flags, or network.

## What's missing today
`Certificate3D.tsx` only checks `getContext('webgl')` exists and listens for `webglcontextlost`. It does not catch:
- WebGL contexts that exist but are software-rendered (SwiftShader, llvmpipe) — slow and visually buggy.
- Contexts blocked by browser flags (`webgl.disabled`, hardware-accel off) that still return a stub.
- R3F / three.js initialization errors thrown synchronously inside `<Canvas>` (no React error boundary today).
- Texture load failures (CDN 404, CORS, image decode error).
- The case where `<Canvas>` mounts but never paints (driver hang) — Suspense stays forever.

## Implementation

### 1. Centralize WebGL detection — `src/lib/web3/webglSupport.ts`
A single `detectWebGL()` that returns one of: `'ok' | 'software' | 'unavailable'`.
- Try `webgl2` first, fall back to `webgl`, fall back to `experimental-webgl`.
- Read `WEBGL_debug_renderer_info` → if renderer string matches `swiftshader | llvmpipe | software | basic render` → `'software'`.
- Verify `MAX_TEXTURE_SIZE >= 2048` (our cert PNG is ~1.4K wide).
- Wrap in try/catch; any throw → `'unavailable'`.
- Memoize the result (run once per session).

### 2. `<Certificate3D>` rewrite
- Run `detectWebGL()` on mount. If `'unavailable'` or `'software'`, render the CSS-tilt `<img>` fallback immediately (no Canvas mount).
- Add a **React error boundary** wrapping `<Canvas>`. Any throw inside Canvas / R3F / three setup → switch to fallback.
- Add a **render watchdog**: start a 2.5 s timer when Canvas mounts. Clear it inside `onCreated` (gl is live) AND when the texture's `image` reports `complete`. If the timer fires first → fallback.
- Add a **texture error handler**: `useTexture(url, undefined, (err) => setFailed(true))` (drei's onError callback). Also pre-validate the image with `new Image()` + `.decode()` before mounting Canvas, so a broken CDN never gets near three.js.
- Keep `webglcontextlost` listener; also listen for `webglcontextcreationerror`.

### 3. Fallback polish
The existing CSS-tilt `<img>` fallback already looks good. Tiny touches:
- Add a thin "Static preview" affordance only in dev (no user-facing label) so we can spot fallback activations during QA.
- Ensure the fallback respects `prefers-reduced-motion` (skip the mouse parallax).

### 4. Telemetry hook (optional, lightweight)
Console-info once per session which mode was chosen (`[cert3d] mode=webgl|software|unavailable|texture-failed|watchdog-timeout`) so future regressions are easy to diagnose without adding any external service.

## Files touched
- `src/lib/web3/webglSupport.ts` — new (detectWebGL helper).
- `src/components/cert/Certificate3D.tsx` — error boundary + watchdog + detection wiring + texture pre-decode.

No backend, route, schema, or design-system changes. Fallback visual is unchanged from current implementation.

## Verification
- Load `/verify-certificate` in normal browser — expect 3D canvas.
- Simulate failure paths (temporary code toggle): force `detectWebGL` → `'unavailable'`, throw inside `<CertificatePlane>`, point texture URL at `/nope.png`, set watchdog to 50 ms. Each must land on the `<img>` tilt fallback without console errors.
- Browser screenshot in both modes to confirm visual parity.
