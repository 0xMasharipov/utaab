# Fix Hero Carousel (Marquee) Not Scrolling

## Problem

The "CONNECT. LEARN. BUILD." marquee under the Hero section (`src/components/HeroCarousel.tsx`) is rendered but stays static. The track CSS in `src/index.css` (line 301) references:

```css
animation: hero-carousel-scroll 30s linear infinite;
```

…but the `@keyframes hero-carousel-scroll` rule is **not defined anywhere** in the codebase (verified across `src/index.css` and `src/styles/deferred.css`). With no keyframes, the browser ignores the animation and the strip doesn't move.

## Fix

Add the missing keyframes to `src/index.css`, right next to the existing `.hero-carousel-track` rule (~line 318). Because the track contains two duplicated `<span>`s side-by-side, scrolling the wrapper from `0` to `-50%` produces a seamless infinite loop.

```css
@keyframes hero-carousel-scroll {
  from { transform: translate3d(0, 0, 0); }
  to   { transform: translate3d(-50%, 0, 0); }
}
```

`translate3d` ensures GPU compositing for a smooth marquee, matching the existing performance posture of the file.

## Files changed

- `src/index.css` — add the `@keyframes hero-carousel-scroll` block.

No component or i18n changes required. The reduced-motion override already in place (`.hero-carousel-track { animation: none; }`) continues to honor accessibility preferences.
