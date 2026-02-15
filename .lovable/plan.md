
# Refine Navbar Logo and Hero Background

## 1. Transparent Logo Background in Navbar

The logo image (`logo-small.webp`) may have a non-transparent background baked into the file itself. Since we cannot edit the image file directly, we will use CSS to ensure any visible background blends seamlessly with the navbar glass effect. We will also remove any unintentional background bleeding by adding `mix-blend-mode` and ensuring the `<img>` element has no background color applied.

**File: `src/components/Navbar.tsx`**
- Add `mix-blend-mode: lighten` or `screen` to the logo `<img>` tag to visually remove any dark background from the logo image
- Add `bg-transparent` explicitly and `object-contain` for clean rendering

## 2. Modernize Mobile Hero Background with Dynamic Blue Blobs

Replace the current static radial gradients + dot grid with animated floating blue blobs that move organically.

**File: `src/components/three/MobileHeroBackground.tsx`**
- Add 3-4 animated blob `<div>` elements with large border-radius, blur, and brand blue colors
- Each blob gets a different CSS animation (float, drift, morph) with staggered delays
- Remove the static dot grid overlay (or make it very subtle)

**File: `src/index.css`**
- Replace `.mobile-hero-gradient` with individual blob animations:
  - `@keyframes blob-float-1` -- slow vertical drift (20s cycle)
  - `@keyframes blob-float-2` -- diagonal drift (25s cycle)
  - `@keyframes blob-float-3` -- horizontal drift (18s cycle)
  - `@keyframes blob-morph` -- subtle scale/border-radius morphing (12s cycle)
- Each blob uses `filter: blur(80-120px)` for soft edges
- Colors: `hsl(var(--primary) / 0.3)`, `hsl(var(--accent) / 0.2)`, `hsl(217 91% 50% / 0.25)`
- Reduce `.mobile-hero-grid` opacity to 0.08 for a very subtle texture

## 3. Improve Desktop Hero Background Animations

**File: `src/components/three/HeroBackgroundScene.tsx`**
- Smooth out the ripple animation by adjusting the lerp factor from `0.05` to `0.03` for more fluid mouse tracking
- Slow down the ripple wave speed slightly (from `uTime * 4.0` to `uTime * 3.0`) for a more elegant feel
- Add a subtle ambient wave animation that runs even without mouse movement

## Summary

| File | Change |
|------|--------|
| `src/components/Navbar.tsx` | Add blend mode + transparent bg to logo image |
| `src/components/three/MobileHeroBackground.tsx` | Replace static gradients with animated floating blobs |
| `src/index.css` | Add blob keyframe animations, refine grid opacity |
| `src/components/three/HeroBackgroundScene.tsx` | Smoother lerp, slower ripple, ambient wave motion |
