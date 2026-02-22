

# Premium Web3 Hero Section with 3D Logo and Orbiting Nodes

## Overview
Replace the current video-based hero with a premium Three.js scene featuring the UTAAB diamond-cross logo recreated in 3D, orbiting blockchain nodes, and a deep blue gradient background matching the reference images.

## New Files to Create

### 1. `src/components/three/Logo3D.tsx`
- Build the UTAAB logo as 4 rounded box geometries arranged in a diamond-cross pattern (top, right, bottom, left)
- Each block: `RoundedBox` from drei, rotated 45 degrees (PI/4 on Z axis), with slight extrusion depth (~0.15)
- Material: `meshPhysicalMaterial` -- white color, low metalness (0.1), medium-low roughness (0.25), clearcoat (0.8)
- Animation: subtle vertical float using `Float` from drei (speed=1.5, floatIntensity=0.3) and optional micro-tilt via useFrame (1-2 degree sine oscillation)

### 2. `src/components/three/OrbitNodes.tsx`
- 3 orbit ring layers with different radii (2.5, 3.5, 4.5) and speeds
- Each ring contains 4-6 small rounded cubes (blockchain blocks) orbiting the center
- Node material: frosted glass look -- white color, transmission=0.6, roughness=0.3, clearcoat=1
- Subtle edge glow via a slightly larger transparent emissive mesh behind each node
- Optional network lines: thin `Line` segments connecting nearby nodes with low opacity (0.15), fading in/out over time
- On mobile (detected via `useIsMobile`): reduce node count per ring to 2-3

### 3. `src/components/three/HeroScene.tsx`
- R3F `Canvas` wrapper with locked camera (no OrbitControls)
- Camera: position [0, 0, 6], fov 50, fixed -- optional slow cinematic push-in (6 to 5.8 over 30s)
- Lighting: soft ambient (0.4), one directional key light from upper-right, one cool-blue rim light from behind-left
- Contains `Logo3D` and `OrbitNodes`
- DPR capped at [1, 1.5] for performance
- `pointerEvents: 'none'` on container div so it doesn't block scrolling

### 4. `src/components/HeroSection.tsx` (new hero wrapper)
Not needed -- we will update the existing `Hero.tsx` directly.

## Files to Modify

### `src/components/Hero.tsx`
- Remove the `<video>` element and dark overlay
- Add a CSS gradient background layer matching the reference:
  - Base: deep navy (#0a1628)
  - Radial gradient glow on the right side (royal blue #1e3a8a at ~70% right, 50% top)
  - Subtle vignette via inset box-shadow or pseudo-element
  - Tiny noise overlay (CSS background-image with inline SVG noise at 2-3% opacity)
- Lazy-load `HeroScene` with `React.lazy` + `Suspense`
- Keep the text content (title, subtitle, description, CTA button) as a z-10 overlay below the 3D canvas center
- Adjust section height: `h-[100vh]` on desktop, `h-[70vh]` on mobile via responsive classes
- Add safe top padding for navbar (~pt-20)

## Technical Details

### Logo geometry (diamond-cross pattern)
```text
        [top]
   [left]   [right]
       [bottom]
```
Each block offset by ~0.75 units from center along its axis, rotated PI/4 on Z. Using `RoundedBox` from drei with args [0.6, 0.6, 0.15] and radius 0.08.

### Orbit rings layout
```text
Ring 1 (r=2.5): 5 nodes, speed=0.15 rad/s
Ring 2 (r=3.5): 6 nodes, speed=-0.10 rad/s (counter-rotate)
Ring 3 (r=4.5): 4 nodes, speed=0.08 rad/s, tilted 20deg on X
```

### CSS gradient background (matching reference)
```css
background: radial-gradient(ellipse at 75% 50%, #1e3a8a 0%, transparent 60%),
            radial-gradient(ellipse at 30% 30%, #0f2557 0%, transparent 50%),
            linear-gradient(135deg, #060e1f 0%, #0a1628 40%, #0d1f3c 100%);
```
Plus a subtle vignette via `box-shadow: inset 0 0 150px rgba(0,0,0,0.5)`.

### Performance considerations
- `useIsMobile()` hook to reduce node count on mobile (15 nodes desktop, 8 mobile)
- DPR capped at 1.5
- No heavy post-processing (no bloom, no SSAO)
- `RoundedBox` with low segment count (2 segments)
- Canvas `pointerEvents: 'none'` to prevent scroll blocking

### Network lines (optional effect)
- In `OrbitNodes`, every 3-4 seconds pick 2-3 random node pairs within distance threshold
- Draw `Line` from drei with opacity animating 0 to 0.2 to 0 over 2 seconds
- Maximum 3 active lines at once

### Files summary

| File | Action |
|------|--------|
| `src/components/three/Logo3D.tsx` | Create -- 3D diamond-cross logo |
| `src/components/three/OrbitNodes.tsx` | Create -- orbiting blockchain block nodes |
| `src/components/three/HeroScene.tsx` | Create -- R3F Canvas with scene composition |
| `src/components/Hero.tsx` | Modify -- replace video with gradient + 3D scene, keep text overlay |

