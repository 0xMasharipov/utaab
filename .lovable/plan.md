

# Update "Learn & Grow" Cards with 4-Layer 3D Visuals

## Summary
Apply the same layered visual system from "What We Build" (AboutBlurb) to the Learn section's 3 cards, replacing icon-based cards with immersive 3D image cards using the uploaded assets.

## Assets
Copy 3 uploaded images to `public/images/learn/`:
- `UTAAB_Edu_Guides.png` → Educational Guides
- `UTAAB_Video_Tutorials.png` → Video Tutorials
- `UTAAB_Workshops_Bootcamps.png` → Workshops & Bootcamps

## Changes

### `src/components/Learn.tsx` — Card rewrite

Replace current flat glass cards with the exact 4-layer structure from AboutBlurb:

1. Update `resources` array to include `image` field instead of `icon`
2. Remove iconoir imports (`Book`, `MediaVideoList`, `GraduationCap`)
3. Import `GlassCard` from `@/components/glass/GlassCard`
4. Each card becomes a `GlassCard` with `relative overflow-hidden min-h-[280px] p-0`:
   - **Layer 1 (z-0)**: Grid background pattern (identical CSS to AboutBlurb)
   - **Layer 2 (z-10)**: `<img>` positioned `absolute bottom-0 right-0 w-[65%]` with hover scale
   - **Layer 3 (z-20)**: Dark gradient overlay (`linear-gradient to top`, 80% → 50% → transparent)
   - **Layer 4 (z-30)**: Text content (title + description) with padding
5. Keep: `onClick` navigation, motion animations, i18n keys, `cursor-pointer`, section heading/subtitle unchanged
6. Grid stays `md:grid-cols-3`

### What does NOT change
- Section heading, subtitle, spacing
- Text content / i18n keys
- Navigation behavior (click → route)
- Other sections

## Files Modified
- `src/components/Learn.tsx` — card inner structure rewrite
- `public/images/learn/` — 3 new image assets

