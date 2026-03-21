

# Premium Background Grid System — Below Hero

## Summary
Add a subtle, Ethena-inspired technical grid background that starts softly below the hero (from "Our Community") and continues through the footer. The grid uses UTAAB's deep navy/steel-blue tones at very low opacity, with fade masks at top and bottom, and rounded framing near the footer.

## Approach
Create a single wrapper component that encompasses all post-hero content (Community through Footer), with the grid rendered as a CSS pseudo-element / background layer behind the content.

## Changes

### New File: `src/components/BackgroundGrid.tsx`
A container component that wraps children with:
- A fixed-position-relative wrapper with `overflow: hidden` and large bottom `border-radius` (~24px)
- A CSS background grid using `background-image` with two sets of thin linear gradients (vertical + horizontal) at ~80px spacing
- Grid line color: `rgba(47, 128, 237, 0.07)` — a desaturated steel-blue derived from brand `#2F80ED`
- A top fade mask: linear-gradient overlay from `background` color to transparent over ~200px, so the grid emerges softly
- A bottom fade: similar treatment near footer for polished finish
- Subtle radial vignette from center-outward for depth
- `pointer-events: none` on the grid layer, content at `z-10`
- On mobile (`md:` breakpoint), reduce grid opacity to ~0.04 and increase cell size

### File: `src/pages/Index.tsx`
Wrap the sections from `<Community />` through `<Footer />` inside the new `<BackgroundGrid>` component. No changes to section content or layout.

### File: `src/index.css`
Add utility classes for the grid:
- `.bg-technical-grid` — the grid pattern via `background-image` using repeating linear gradients
- `.bg-grid-fade-top` — top fade mask
- `.bg-grid-fade-bottom` — bottom fade mask

## Visual Specifications
- Grid cell size: ~80px square
- Line thickness: 1px
- Line color: `rgba(47, 128, 237, 0.07)` (brand blue at 7% opacity — appears as ~15-20% visible against dark bg)
- Top fade: 200px gradient from `hsl(217 50% 6%)` (background) to transparent
- Bottom fade: 120px gradient near footer
- Container bottom border-radius: 24px with overflow hidden
- Subtle radial gradient overlay for depth: dark edges, slightly lighter center at 3% opacity difference
- Mobile: grid opacity reduced, cell size increased to 100px

## Technical Details
- Pure CSS implementation — no canvas, no JS animation, no heavy rendering
- Grid via `background-image: repeating-linear-gradient(...)` — extremely performant
- Fade masks via absolutely-positioned gradient overlays with `pointer-events: none`
- All content remains interactive above the grid layer via z-index stacking
- Responsive: `@media` query adjusts density on small screens

