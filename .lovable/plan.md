

# Update "What We Build" Cards with 3D Layered Visuals

## Summary
Replace the icon-based cards with immersive 4-layer cards featuring the uploaded 3D images, dark gradient overlays, grid backgrounds, and elevated text — creating a premium Web3 aesthetic.

## Assets
Copy the 4 uploaded images to `public/images/about/`:
- `UTAAB_Education.png` — chain ring (Education)
- `UTAAB_Projects_1.png` — cubes cluster (Projects)
- `UTAAB_Ecosystem.png` — wireframe sphere (Ecosystem)
- `UTAAB_Support.png` — pixel heart (Support)

## Changes

### `src/components/AboutBlurb.tsx` — Card rewrite

Replace the current `GlassCard` inner content with a 4-layer structure per card:

```text
┌──────────────────────────┐
│  TEXT (z-30)             │  Title + description, white, top-left or centered
│                          │
│  OVERLAY (z-20)          │  Linear gradient: transparent top → dark navy bottom (70% opacity)
│                          │
│  3D IMAGE (z-10)         │  Positioned bottom-right, ~70% card width, object-contain
│                          │
│  GRID BG (z-0)           │  Subtle dot/line grid pattern at ~5% opacity
└──────────────────────────┘
```

Each card becomes:
- `relative overflow-hidden` container with fixed min-height (~280px)
- **Layer 4 (base)**: CSS background grid pattern (repeating linear gradient, matching site style)
- **Layer 3**: `<img>` absolutely positioned bottom-right, `w-[65%] h-auto`, with slight translate for off-center feel
- **Layer 2**: Absolute div with `bg-gradient-to-t from-[hsl(217,50%,8%)/0.75] via-[hsl(217,50%,8%)/0.4] to-transparent`
- **Layer 1 (top)**: Text content with `relative z-30`, white color, positioned at top-left with padding

Card data array adds an `image` field:
```ts
const cards = [
  { image: '/images/about/UTAAB_Education.png', titleKey: '...', descriptionKey: '...' },
  { image: '/images/about/UTAAB_Projects_1.png', ... },
  { image: '/images/about/UTAAB_Ecosystem.png', ... },
  { image: '/images/about/UTAAB_Support.png', ... },
];
```

Icons removed from cards (no longer needed). Imports for `GraduationCap, Rocket, Globe, Heart` removed.

Keep: GlassCard wrapper (for border/backdrop-blur), motion animations, i18n keys, grid layout, Link button below.

### No other files modified
- Layout grid stays `lg:grid-cols-4`
- Section heading/blurb untouched
- "Learn More" link untouched
- No i18n changes, no admin changes

## Files Modified
- `src/components/AboutBlurb.tsx` — card inner structure rewrite
- `public/images/about/` — 4 new image assets copied

