## Goal
Make `/verify` (VerifyCertificate page) feel premium and on-brand, with a hero 3D certificate that uses the uploaded template image as the card face.

## 1. Asset
- Upload `UTAAB_Certificate(2).png` as a Lovable asset (`src/assets/utaab-certificate-template.png.asset.json`). Used as the texture/face of the 3D card.

## 2. New component: `src/components/cert/Certificate3D.tsx`
- React Three Fiber scene (already in project — `@react-three/fiber` + `@react-three/drei`).
- A single A4-ratio `RoundedBox` (≈ 0.7 × 1.0 × 0.02) with:
  - Front face = `meshPhysicalMaterial` with the template image as `map` (via `useTexture`).
  - Edges/back = dark navy with subtle metalness + clearcoat for a "card" feel.
  - Soft floating rotation (Float from drei: tiny rotationIntensity, slow speed).
  - Pointer-driven tilt: rotate ±10° on mouse X/Y over the canvas (no drag controls).
- Lighting: ambient + 2 directional lights tuned to make the blue gradient pop; environment preset `"city"` for reflections.
- `<Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 2.2], fov: 35 }}>` — capped DPR for perf.
- Loading fallback: `<Skeleton>` matching aspect ratio. Lazy-load via `React.lazy` so Three doesn't bloat the verify page's initial bundle.

## 3. Refine `src/pages/VerifyCertificate.tsx`
Keep all logic (`runVerify`, state, edge fn calls) intact. Only restructure presentation:

- Wrap page in `BackgroundGrid` (used across other polished pages like TonRaPage) for consistent web3 backdrop.
- New hero layout (two-column on `lg`, stacked on mobile):
  - **Left:** existing pill badge → larger gradient H1 "Verify on Base" → subtitle mentioning Base network + soulbound NFT → the search `Card` (restyled: thinner border, `backdrop-blur`, focus ring on input, primary gradient button with shadow glow like TonRa CTA).
  - **Right:** `Certificate3D` inside an aspect-[1/1.414] container with soft radial glow behind it (same pattern as TonRa logo glow).
- Below hero: small trust strip — 3 `GlassCard` tiles ("On-chain on Base", "Tamper-proof", "Public RPC verification") with lucide icons.
- `VerificationResultCard` stays where it is, but its container gets `motion.div` fade-in.
- Footer "Back to home" link styled as ghost button.

## 4. SEO / a11y
- Update `document.title` via existing pattern.
- Canvas wrapper has `role="img"` + `aria-label="Interactive 3D UTAAB certificate preview"`.
- `prefers-reduced-motion`: disable Float + tilt, show static tilted card.

## Out of scope
- No changes to verify logic, edge functions, contract, or DB.
- No new routes.
- Not touching admin cert pages.

## Files
**Create**
- `src/assets/utaab-certificate-template.png.asset.json`
- `src/components/cert/Certificate3D.tsx`

**Edit**
- `src/pages/VerifyCertificate.tsx` (presentation only)
