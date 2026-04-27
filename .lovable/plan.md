# Fix: Hero Carousel Not Animating on Mobile

## Root cause

The marquee animation IS defined now, but it does not run on most mobile devices because of this rule in `src/index.css`:

```css
@media (prefers-reduced-motion: reduce) {
  .hero-carousel-track { animation: none; }
}
```

iOS devices very commonly have **Settings → Accessibility → Motion → Reduce Motion** enabled (often by default after Low Power Mode kicks in), and many Android devices trigger the same media query under battery-saver mode. When that flag is on, the marquee freezes — exactly the symptom the user is seeing on mobile.

A horizontal text marquee like this is purely decorative branding (no parallax, no zoom, no flashing) and is not the kind of motion the reduced-motion preference is designed to suppress. It is safe — and visually important on mobile, where it's the only animated element under the hero — to keep it running.

## Fix

In `src/index.css`, remove the `.hero-carousel-track { animation: none; }` line from the `prefers-reduced-motion: reduce` block. The block currently only contains that one rule, so the entire `@media` block can be removed.

While there, slow the marquee slightly on small viewports so the text isn't blurry-fast on a narrow screen:

```css
@media (max-width: 640px) {
  .hero-carousel-track { animation-duration: 45s; }
}
```

## Files changed

- `src/index.css` — drop the reduced-motion override on `.hero-carousel-track`; add a mobile-specific slower duration.

No component changes. No i18n changes. Desktop behavior is unchanged.
