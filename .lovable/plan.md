

# Add 4-Layer Visual System to Resources Section Cards

## Summary
Wrap the existing Resources cards in the same layered structure used in "What We Build" and "Community Projects", but at much lower visual intensity. Existing 3D icons stay in their current position as primary content indicators. Background visuals reuse the same images at very low opacity as subtle ambient decoration.

## Changes

### `src/components/Resources.tsx`

1. Import `GlassCard` from `@/components/glass/GlassCard`
2. Replace the current `<motion.div className="glass ...">` card wrapper with a `GlassCard` inside the `motion.div`, using `relative overflow-hidden p-0 group` (same pattern as Projects)
3. Add 4-layer structure inside each card:

```text
GlassCard (relative overflow-hidden min-h-[240px] p-0 group)
  ├── Layer 1 (z-0):  Grid background — same CSS linear-gradient pattern, opacity 0.05
  ├── Layer 2 (z-5):  Subtle background visual — same card image, absolute bottom-0 right-0,
  │                    w-[40%], opacity-[0.12], blur-[1px], pointer-events-none
  ├── Layer 3 (z-10): Dark gradient overlay — linear-gradient to top,
  │                    rgba(0,0,0,0.70) bottom → rgba(0,0,0,0.30) top → transparent
  └── Layer 4 (z-20): Content — existing icon (img), title, bullet list with padding p-6 sm:p-8
```

4. Key differences from Projects section:
   - Background image opacity is **0.12** (vs 0.85 in Projects) — very subtle
   - Image width is **40%** (vs 55%) — smaller footprint
   - Optional slight blur on background image
   - Icons remain as explicit `<img>` elements in the content layer (not replaced)
   - Overlay is lighter at top (0.30 vs 0.25) since icons need clear space

5. Keep: all i18n keys, icon hover scale, bullet list, section heading, grid `lg:grid-cols-3`, animations

### What does NOT change
- Section heading, subtitle, spacing
- Icons (stay as-is, same size and position)
- Text content, bullet lists, i18n keys
- Grid layout
- Motion animations
- Other sections

## Files Modified
- `src/components/Resources.tsx` — card structure upgrade with 4-layer system

