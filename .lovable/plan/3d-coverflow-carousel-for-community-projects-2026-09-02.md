# 3D Coverflow Carousel for Community Projects

Replace the static 3-column grid in the Projects section on the home page with an interactive 3D coverflow carousel, where each of the six projects (UBpoint, TonRa, ASN, DVS, DID, DAO) lives inside a rotating card, exactly like the reference screenshot.

## What it will look and feel like

- Cards sit in a horizontal 3D row: the centered card faces the viewer, neighbours rotate away, shrink, and recede into depth.
- Behind the cards, a soft blurred gradient glow is derived from the dominant colours of the currently visible project images, so the backdrop shifts colour as you scroll — kept inside the site's blue/navy Web3 palette (no purple/red tints introduced by accident: colours come from our own project artwork).
- Drag with the mouse/finger, scroll with the wheel, or use the left/right arrow keys to move between projects. Momentum decays with friction so it glides to a stop.
- The centered card shows the full project content already used today: status badge (Beta / Planning), title, description, tags, and the 3D artwork. Cards with a `href` (UBpoint, TonRa) stay clickable and open their project page; a click only navigates when it isn't part of a drag.
- Below the carousel: small dot indicators for the six projects, clickable to jump.

## Behaviour details

- Mobile: the same carousel, one card visible at a time with neighbours peeking, drag-driven. Reduced blur and depth for performance.
- `prefers-reduced-motion`: rotation/depth are flattened to a plain snap-scroll strip, no momentum glide.
- Accessibility: the carousel is a labelled region, arrow-key navigation on focus, each card keeps its link semantics and aria-label.

## Technical section

New component `src/components/carousel/CoverflowCarousel.tsx`, generic and prop-driven per the spec:

`items` (render-prop or children array), `className`, `maxRotationDegrees` (28), `maxDepthPx` (140), `minScale` (0.92), `cardGap` (28), `frictionFactor` (0.9), `wheelSensitivity` (0.6), `dragSensitivity` (1.0), `backgroundBlur` (24), `gradientSize` (0.65), `gradientIntensity` (0.7), `enableKeyboard` (true), `onCardChange`, `cardAspectRatio` (4/5), `initialIndex` (0).

Implementation notes:
- Single `requestAnimationFrame` loop driving a scroll offset with velocity + friction; per-card transform computed from distance-to-centre: `rotateY`, `translateZ`, `scale`, opacity fade. Container uses `perspective` and `transform-style: preserve-3d`.
- Wheel handled by a native non-passive listener attached in an effect (React's `onWheel` is passive so `preventDefault` is ignored); `deltaMode` normalised to pixels; handler read through a ref to avoid stale state. Pointer Events for drag with capture; `touch-action: pan-y` so vertical page scroll still works.
- Dominant colour extraction: draw each project image to a small offscreen canvas once on load, average/quantise to one colour, cache it. Feed the two nearest cards' colours into a blurred radial-gradient backdrop layer sized by `gradientSize` and alpha by `gradientIntensity`. Images are same-origin (`/images/projects/*.webp`) so canvas reads are not tainted.
- Cleanup on unmount: cancel rAF, remove listeners.

`src/components/Projects.tsx` keeps its data array, heading, i18n keys and framer-motion reveal; the grid is swapped for `<CoverflowCarousel>` and the existing card body is extracted into a `ProjectCard` sub-component reused as the carousel item, so `GlassCard`, `AnimatedImage`, the grid/gradient overlays and status colours are unchanged.

No backend, data, or translation changes.
