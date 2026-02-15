

# Fix Hero Background on Mobile Devices

## Problem
The hero section's 3D ripple grid background is intentionally disabled on mobile (`&& !isMobile`), leaving only a plain black `<div>`. This creates a visually empty hero on phones/tablets.

## Solution
Replace the plain black fallback with a lightweight CSS-only animated gradient background that mirrors the brand aesthetic without loading Three.js on mobile.

## Changes

### File: `src/components/Hero.tsx`
- Keep the `!isMobile` guard for the heavy Three.js scene (preserving performance)
- When `!shouldLoadScene`, render a new `<MobileHeroBackground />` component instead of the plain black div

### File: `src/components/three/MobileHeroBackground.tsx` (new)
- A lightweight CSS-only component with:
  - Animated radial gradient using brand colors (primary blue `#1a56db`, accent blue `#60a5fa`, black)
  - Subtle floating dot grid using a CSS `radial-gradient` pattern to echo the desktop ripple grid
  - A slow CSS animation (`gradient-flow` or similar) for visual movement
  - No JavaScript animation libraries, no Three.js -- pure CSS for zero performance cost

### File: `src/index.css`
- Add a `@keyframes mobile-hero-pulse` animation for the subtle gradient shift
- Add `.mobile-hero-grid` utility class for the dot pattern overlay

## Visual Result
- **Desktop**: Full interactive Three.js ripple grid (unchanged)
- **Mobile**: Lightweight animated gradient with static dot pattern overlay, matching the blue/black brand palette

## Performance Impact
- Zero additional JS bundle size
- CSS-only animation runs on GPU compositor thread
- No impact on TTI or LCP metrics

## Technical Details

```
Desktop path:  shouldLoadScene=true  --> <HeroBackgroundScene /> (Three.js)
Mobile path:   shouldLoadScene=false --> <MobileHeroBackground /> (CSS-only)
```

| File | Change |
|------|--------|
| `src/components/Hero.tsx` | Import and render MobileHeroBackground when scene is skipped |
| `src/components/three/MobileHeroBackground.tsx` | New lightweight CSS animated background |
| `src/index.css` | Add mobile hero keyframes and dot grid utility |
