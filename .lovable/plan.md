# Fix Certificate Page + UBpoint Graphical Bugs

## What's actually wrong

**Verify Certificate page (`/verify-certificate`)**
- The page itself loads, but the right-side 3D certificate area renders as a flat dark rectangle (no image, no card). The R3F `Canvas` mounts, but the texture path resolves to a Lovable CDN URL that doesn't always load inside the WebGL context in time, and the dark `meshPhysicalMaterial` makes the whole face look like a black box while we wait. End result: the hero looks broken / "crashed."
- The Suspense fallback never re-shows after the canvas mounts, so users see an empty dark slab indefinitely.

**UBpoint page (`/projects/ubpoint`)**
- Several sections (Features grid, Verified On-Chain, Showcase, Sponsors) render only their outer padding — their inner content stays at `opacity: 0`. This is the framer-motion `whileInView` with `viewport={{ margin: '-100px' }}` combined with the splash overlay locking `body.overflow = hidden` and scrolling to top. The IntersectionObserver evaluates before the splash releases scroll, marks elements as "not in view," and with `once: true` never re-triggers. You see huge white gaps between the hero, the "pocket-sized student economy" title, and "growing on-chain economy."

## Fix plan

### 1. Make `Certificate3D` reliable and aesthetic
- Replace the heavy `RoundedBox` + per-face material array with a single textured plane (mesh + planeGeometry sized to A4 portrait ratio) backed by a subtle frame mesh. Avoids the "all-dark faces" problem when the texture is still loading.
- Wrap the texture load in `<Suspense fallback={...}/>` that shows a soft glowing skeleton card (matching the design) so users never see an empty black canvas.
- Add a graceful fallback: if WebGL is unavailable or the texture fails, render a plain `<img>` of the certificate with a CSS tilt/parallax (mouse-follow `transform: perspective(...) rotateX/Y`). Same aesthetic, zero risk of a blank canvas.
- Lower the camera distance / fov so the certificate fills the frame nicely.
- Keep the soft blue radial glow and the floating motion.

### 2. Polish the Verify hero around it
- Add a thin gradient ring + soft drop shadow around the certificate stage so it reads as a "stage," not an empty void.
- Add a tiny "Live on Base" pill above the 3D stage for visual interest.
- No layout changes beyond the right column.

### 3. Fix UBpoint section visibility
- Replace the brittle `whileInView` + negative-margin pattern across `FeatureGrid`, `VerifiedOnChain`, `Showcase`, `Sponsors`, `Metrics`, `FinalCTA` with one of:
  - `whileInView` using `viewport={{ once: true, amount: 0.15 }}` (no negative margin), OR
  - a small reusable `<Reveal>` wrapper that uses `useInView` + a fallback `setTimeout` so content always becomes visible even if the observer never fires.
- Guarantee: after the splash dismisses (or after 1.5s as a safety net), every section's content is at `opacity: 1`.
- Remove the `cursor-wait` splash overlay's `pointer-events` capture from blocking child observers (or render the splash as a sibling of `<main>` outside its stacking context, which it already is — just ensure it doesn't keep `body.overflow` locked longer than 3s, which it already caps).

### 4. Verification
- Reload `/verify-certificate` in the browser, screenshot, confirm the certificate is clearly visible with the template image and subtle tilt.
- Reload `/projects/ubpoint`, scroll the full page, screenshot full-page, confirm Features, Verified On-Chain, Showcase, Sponsors, Metrics, FinalCTA all render their text and cards (no white gaps).

## Files touched
- `src/components/cert/Certificate3D.tsx` — simplify to textured plane + WebGL/texture fallback to `<img>`.
- `src/pages/VerifyCertificate.tsx` — small wrapper polish around the 3D stage and a non-WebGL fallback path.
- `src/pages/projects/UBpointPage.tsx` — swap `whileInView` patterns for a safe `<Reveal>` (or adjust viewport options) so sections always appear.

No backend, schema, or route changes.
