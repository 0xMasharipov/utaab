
## Mobile Optimization — Apply Recent Improvements to Mobile

### Current state on mobile

Recent optimizations (skeleton fix, image preloading, video crossfade, content-visibility) were applied globally but **mobile has specific issues** not yet addressed:

| # | Mobile-specific issue | Cause |
|---|---|---|
| 1 | LCP skeleton sized for desktop hero — looks oversized/misaligned on 375px screens | `.lcp-skeleton` in `index.html` uses fixed widths (e.g. `max-width: 600px` bars) without mobile breakpoint |
| 2 | Hero video preload still triggers on mobile even though `MobileHeroBackground` is shown | `Hero.tsx` doesn't gate video `preload="auto"` by viewport — wastes bandwidth on cellular |
| 3 | Idle preload in `Index.tsx` preloads all 5 below-fold images on mobile too — wastes data on cellular connections | No `navigator.connection.saveData` / `effectiveType` check |
| 4 | `cv-auto` `contain-intrinsic-size: 1px 700px` is desktop-tuned — mobile sections are taller (~1100px), causing scroll-position jump when sections render | Same intrinsic size for all viewports |
| 5 | `AnimatedImage` `rootMargin: 300px` is too aggressive on mobile (preloads images user may never reach), wastes bandwidth | No mobile-aware margin |
| 6 | Mobile hero shows `MobileHeroBackground` (CSS gradients) but no crossfade — pops in instantly when React mounts | Crossfade layer added in last update only covers video path |

### Fix plan (6 mobile-targeted changes)

**Fix 1 — Responsive skeleton in `index.html`**
- Add mobile-specific media query: bars shrink to `max-width: 280px` and reduce height/spacing on screens `< 640px`. Same shimmer animation, scaled.

**Fix 2 — Mobile-aware video loading in `Hero.tsx`**
- Detect `window.innerWidth < 768` before setting `preload="auto"` — use `preload="none"` on mobile (mobile uses `MobileHeroBackground` anyway, never plays video). Saves ~200KB on every mobile visit.

**Fix 3 — Network-aware image preloading in `Index.tsx`**
- Inside the `requestIdleCallback`, check `navigator.connection?.saveData` and `navigator.connection?.effectiveType`. Skip preloading on `slow-2g`, `2g`, or when Data Saver is on. On `3g`, preload only the first 2 images instead of 5.

**Fix 4 — Viewport-aware `cv-auto` in `deferred.css`**
- Add a `cv-auto-mobile` variant with `contain-intrinsic-size: 1px 1100px` and use a media query to switch between desktop/mobile intrinsic sizes automatically. Prevents scroll jump.

**Fix 5 — Mobile-aware `rootMargin` in `AnimatedImage.tsx`**
- Use `rootMargin: window.innerWidth < 768 ? '150px' : '300px'`. Mobile gets less aggressive preloading (saves cellular data, still smooth since mobile scroll is slower per-pixel).

**Fix 6 — Crossfade for mobile hero in `Hero.tsx`**
- Apply the same fade-in opacity transition to the `MobileHeroBackground` wrapper (200ms fade-in on mount) so it matches the desktop video crossfade smoothness.

### Files to modify

- `index.html` — responsive skeleton CSS (media query)
- `src/components/Hero.tsx` — mobile-aware `preload` + mobile crossfade wrapper
- `src/pages/Index.tsx` — network-aware preload list
- `src/styles/deferred.css` — mobile `cv-auto` variant
- `src/components/common/AnimatedImage.tsx` — mobile-aware rootMargin

### Modern but trusted methods

| API | Support | Fallback |
|---|---|---|
| `navigator.connection.effectiveType` / `saveData` | 75% (Chromium-based; Safari ignores) | Falls back to "preload everything" — same as today |
| CSS media queries | 100% | n/a |
| `window.innerWidth` check | 100% | n/a |

### Expected outcome

- Mobile data usage drops ~300-500 KB per visit (no video preload + smarter image preload)
- Skeleton looks correctly sized on phones (no oversized bars)
- Smooth crossfade on mobile matches desktop
- No scroll jump when below-fold sections render
- Save-Data users get minimal asset loading

### Does NOT change

- Visual design, layout, animations on any viewport
- Component behavior, state, props
- Desktop experience (all changes are additive mobile branches)
- Translations / i18n

### Risk: very low
All changes are guarded by viewport/network checks with safe fallbacks to current behavior.
