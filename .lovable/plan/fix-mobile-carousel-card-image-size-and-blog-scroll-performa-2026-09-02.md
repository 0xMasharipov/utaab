# Fix mobile carousel, card image size, and blog scroll performance

## 1. "Mobile still shows the old cards"

Verified: at a 393px viewport the preview does render the new 3D coverflow carousel (drag track, dot indicators, no old grid). So the code is correct — a phone showing the old grid is loading the **published** build, which still has the previous version, or a cached bundle.

Actions:
- Republish the site so utaab.org serves the new carousel.
- Two robustness fixes that also affect real phones:
  - The section wrapper uses `content-visibility: auto` with a fixed `contain-intrinsic-size` (700px mobile / 1100px desktop). The carousel is taller than that placeholder, so on a phone the section can render collapsed/blank until it is scrolled into view. Remove `cv-auto` from the Projects section (or give it a correct intrinsic height).
  - The carousel currently falls back to a plain horizontal strip only for `prefers-reduced-motion`. Phones with "Reduce Motion" enabled (common on iOS) therefore see a flat strip that looks like the old layout. Keep the fallback but style it as the same card design with snap + dots so it reads as the new component.

## 2. Resize the images on the project cards

Currently each card's artwork is fixed at 55% card width, bottom-right, `object-contain`. Change to a responsive size so the render is larger and better balanced on small cards: ~72% width on mobile, ~58% on desktop, with a slight bottom/right inset so it does not touch the card edge, and `sizes` on the image so the browser downloads an appropriately sized file.

## 3. Blog section loads slowly, and scrolling back up makes things disappear / lag

Causes found in the code:
- `content-visibility: auto` on About / Projects / Learn / Events / Resources. Scrolling up re-enters those sections, the browser re-renders them from the intrinsic-size placeholder, and content visibly pops in and shifts — this is the "everything disappears" symptom.
- The carousel's requestAnimationFrame loop runs continuously, even when the carousel is far off-screen, so it keeps burning frames while the user is reading the blog section — this is the lag.
- The blog query only starts once the below-fold wave mounts, and blog cover images use lazy loading with no priority, so the first blog images decode late.

Fixes:
- Remove `cv-auto` from the sections above (keep the lazy mounting already in place), so scrolled-past content stays painted.
- Pause the carousel rAF loop when the carousel is out of the viewport (IntersectionObserver) and resume on re-entry; also stop the loop when idle (no velocity, no target) and restart on interaction.
- Prefetch the homepage blog query earlier and eager-load the first row of blog cover images (`loading="eager"` + `fetchPriority="high"` for the first 3, lazy for the rest) so the blog grid does not appear empty on arrival.
- Reserve height for blog cards (fixed image aspect ratio) so the grid does not shift as images arrive.

## Technical notes

Files touched: `src/styles/deferred.css` or the individual sections for `cv-auto` removal (`Projects.tsx`, `AboutBlurb.tsx`, `Learn.tsx`, `Events.tsx`, `Resources.tsx`), `src/components/carousel/CoverflowCarousel.tsx` (visibility-gated rAF, reduced-motion card styling), `src/components/Projects.tsx` (image sizing), `src/components/BlogSection.tsx` and `src/components/blog/BlogCard.tsx` (priority loading, aspect-ratio reservation). No backend or data changes.
