

# Fix Sharp Line Between Hero and Stats Section

## Problem
The hero bottom fade overlay ends at `rgba(8,22,36,0.72)` (dark navy at 72% opacity), but the global background gradient at that scroll position is still in the light-to-mid blue range. This mismatch creates a visible hard edge at the hero's bottom boundary.

## Fix

### `src/components/Hero.tsx` — Update bottom fade gradient
Change the bottom fade to transition from transparent white into the mid-blue tones that match the global gradient at that point, rather than jumping to dark navy:

```css
background: linear-gradient(
  to bottom,
  rgba(255,255,255,0) 0%,
  rgba(235,242,249,0.6) 30%,
  rgba(189,213,239,0.8) 60%,
  rgba(127,178,232,0.9) 85%,
  rgba(127,178,232,1) 100%
);
```

This matches the global gradient's `#ebf2f9` → `#bdd5ef` → `#7fb2e8` range at the hero/stats boundary, eliminating the sharp contrast jump.

### Files to modify

| File | Change |
|------|--------|
| `src/components/Hero.tsx` | Update bottom fade gradient stops to match global background colors at that scroll position |

