
# Fix Navbar Logo Transparency and Mobile Hero Background

## Problem 1: Logo Black Background
The logo image (`logo-small.webp`) has a baked-in black/dark background. The current `mix-blend-screen` approach is not fully removing it. We need a stronger CSS approach.

### Fix
**File: `src/components/Navbar.tsx`**
- Replace `mix-blend-screen` with a combination approach:
  - Use `mix-blend-lighten` (better at eliminating pure black pixels)
  - Add `brightness(1.1)` filter to push dark pixels further toward transparent
  - Keep `bg-transparent` and `object-contain`

## Problem 2: Mobile Hero Background Nearly Invisible
The animated blobs exist but their opacity values (0.2-0.3) combined with `blur(100px)` make them nearly invisible on the dark background. The result looks like a plain black screen.

### Fix
**File: `src/index.css`**
- Increase blob opacity values significantly:
  - Blob 1: `hsl(var(--primary) / 0.3)` to `hsl(var(--primary) / 0.6)`
  - Blob 2: `hsl(var(--accent) / 0.2)` to `hsl(var(--accent) / 0.5)`
  - Blob 3: `hsl(217 91% 50% / 0.25)` to `hsl(217 91% 50% / 0.55)`
  - Blob 4: `hsl(0 0% 100% / 0.04)` to `hsl(0 0% 100% / 0.08)`
- Reduce blur slightly on some blobs (100px to 80px) so they remain visible
- Add a base gradient underneath the blobs for a richer background

**File: `src/components/three/MobileHeroBackground.tsx`**
- Add a base gradient layer (`bg-gradient-to-br from-[#0a1628] via-[#0d1f3c] to-[#0a0f1a]`) underneath the blob layer so the background is never pure black

## Summary

| File | Change |
|------|--------|
| `src/components/Navbar.tsx` | Switch to `mix-blend-lighten` + brightness filter for logo |
| `src/index.css` | Double blob opacity values, reduce blur on some blobs |
| `src/components/three/MobileHeroBackground.tsx` | Add base gradient layer under blobs |
