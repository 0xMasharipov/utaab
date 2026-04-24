## Fix the hero marquee ("CONNECT. LEARN. BUILD." strip) not animating

### What's broken
The scrolling text strip directly under the hero (`HeroCarousel`) is rendered immediately on the homepage, but the CSS that makes it work — `.hero-carousel-track` and `.hero-carousel-item` — lives in `src/styles/deferred.css`, which is only imported lazily inside a `useEffect` in `Index.tsx`.

Result: on initial paint the track has no `display: flex`, no `width: max-content`, and no `animation`. Depending on timing (and on routes that don't import `deferred.css` at all), the marquee renders as static stacked text and never scrolls.

### Fix
Promote the small set of marquee styles into the always-loaded global stylesheet so the strip works on first paint, every time.

**1. `src/index.css`** — add a "Hero carousel (above-fold, critical)" block with:
- `.hero-carousel-track` → `display: flex; width: max-content; animation: hero-carousel-scroll 30s linear infinite;`
- `.hero-carousel-track:hover` → `animation-play-state: paused;`
- `.hero-carousel-item` → existing typography (Montserrat, uppercase, letter-spacing, clamp font-size, white 80%, blue text-shadow, `white-space: nowrap`)
- `@media (prefers-reduced-motion: reduce)` → `.hero-carousel-track { animation: none; }` for accessibility parity with the other above-fold animations

**2. `src/styles/deferred.css`** — remove the now-duplicated `.hero-carousel-track` / `.hero-carousel-item` rules and update the header comment so it no longer claims the carousel lives there.

The keyframe `hero-carousel-scroll` is already declared in `tailwind.config.ts` and emitted globally, so no keyframe move is needed.

### Files
- **Modified:** `src/index.css`
- **Modified:** `src/styles/deferred.css`

### Risk: trivial
Pure CSS relocation. Same selectors, same declarations, just loaded earlier and unconditionally.
