

# Synchronized Image Fade-In Across Landing Page

## Summary
Update `AnimatedImage` to support viewport-triggered reveal, and replace all raw `<img>` tags in landing page sections with `AnimatedImage` for a cohesive, synchronized fade-in effect when sections scroll into view.

## Approach

### 1. Enhance `AnimatedImage` component (`src/components/common/AnimatedImage.tsx`)
- Add an Intersection Observer hook so the fade-in triggers when the image's section enters the viewport (not on page load)
- The animation: opacity 0→1, scale 0.98→1, translateY 4px→0, duration 400ms, ease-out
- Keep existing `onLoad` gating — image must be both loaded AND in viewport to reveal
- No staggered delays; all images in a section reveal simultaneously when the section is visible

### 2. Replace raw `<img>` in landing page sections

**`src/components/AboutBlurb.tsx`** (line 75–81)
- Replace the Layer 2 decorative `<img>` with `AnimatedImage`, preserving all existing classes (absolute positioning, hover scale, lazy loading)

**`src/components/Learn.tsx`** (line 75–81)
- Same pattern — Layer 2 decorative `<img>` → `AnimatedImage`

**`src/components/Projects.tsx`** (line 104–110)
- Layer 2 decorative `<img>` → `AnimatedImage`

**`src/components/Resources.tsx`** (lines 82–88 and 101–107)
- Both Layer 2 background image and Layer 4 icon `<img>` → `AnimatedImage`

**`src/components/Events.tsx`** (lines 84–88)
- Event cover image `<img>` → `AnimatedImage`

### 3. What does NOT change
- Layout, grid, spacing, card structure
- Existing framer-motion section animations
- Hover effects on cards
- CMS/admin functionality
- Footer geometric backgrounds and Navbar logo (already have their own loading logic)

## Files Modified
- `src/components/common/AnimatedImage.tsx` — add Intersection Observer for viewport-triggered reveal
- `src/components/AboutBlurb.tsx` — swap `<img>` → `AnimatedImage`
- `src/components/Learn.tsx` — swap `<img>` → `AnimatedImage`
- `src/components/Projects.tsx` — swap `<img>` → `AnimatedImage`
- `src/components/Resources.tsx` — swap 2× `<img>` → `AnimatedImage`
- `src/components/Events.tsx` — swap `<img>` → `AnimatedImage`

