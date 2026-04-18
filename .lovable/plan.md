

## Fix Loading Bugs — Skeleton, Text Flash, Image Pop-In

### Bugs identified

| # | Bug | Cause |
|---|---|---|
| 1 | English hero text flashes briefly before the real hero loads (worst on TR/RU/AR users — they see EN first) | `index.html` hardcodes `<div class="lcp-placeholder"><h1>From Learning to Building in Web3</h1></div>` as a paint-stand-in. It gets removed only after React mounts. |
| 2 | Below-fold images "pop in" statically while scrolling | Images only start loading when their `IntersectionObserver` fires; nothing pre-warms them during the idle window after hero paints. |
| 3 | Brief flicker between solid navy bg → video fade-in on slower connections | Video fades via opacity but no proper crossfade with the placeholder layer. |
| 4 | No real visual loading skeleton — page just shows solid color, then full hero | Missing a branded shimmer/skeleton that matches the final layout (currently it's just a flat `#061224`). |

### Fix plan (4 targeted changes)

**Fix 1 — Replace the hardcoded English text placeholder with a language-neutral branded skeleton**

In `index.html`, swap the `<h1>From Learning to Building in Web3</h1>` for a pure-visual skeleton: a centered animated gradient shimmer block matching the hero text dimensions, plus a subtle UTAAB monogram. No translatable text → no flash, no language mismatch. Uses pure CSS `@keyframes` (already inline).

```text
[ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░ ]   <- shimmer bar (where headline goes)
[ ▓▓▓▓▓▓▓▓░░░░░░░░ ]   <- shimmer bar (where subtitle goes)
[  ●●  ●●  ]            <- 2 button-shaped shimmers
```

This is the modern pattern used by Linear, Vercel, GitHub: a *content-shaped* skeleton, not literal text.

**Fix 2 — Pre-warm below-fold images during the idle window**

After the hero paints, instead of waiting for the user to scroll, use the modern `<link rel="preload" as="image" fetchpriority="low">` API injected dynamically for the 5 highest-priority below-fold images (project covers, about images). They'll be sitting in browser cache by the time the IntersectionObserver triggers — no pop-in.

Implementation: add a small effect in `Index.tsx` that runs inside `requestIdleCallback` and creates `<link rel="preload">` tags for the project/about/learn webp images.

**Fix 3 — Smooth hero video crossfade with `poster`-equivalent CSS layer**

Add a CSS-only animated gradient layer behind the video that fades out *as* the video fades in (instead of before). Uses CSS `@starting-style` (modern, supported in Chrome 117+ / Safari 17.5+) with graceful fallback to current behavior. Result: zero perceptible transition.

**Fix 4 — Ensure skeleton stays visible until React's hero is *painted*, not just mounted**

The current `MutationObserver` removes the placeholder as soon as `#root` has *any* child, but React might mount the wrapper `<div>` before the Hero's video/text is laid out — causing a 1-frame flash of nothing. Switch to: wait until `#root` contains an element with `id="hero"` (so we know the actual hero section has rendered into the DOM), then fade out over 200ms.

### Files to modify

- `index.html` — replace English `<h1>` with language-neutral shimmer skeleton; update the MutationObserver to wait for `#hero` and fade out gracefully
- `src/pages/Index.tsx` — add idle-time `<link rel="preload">` injector for below-fold images
- `src/components/Hero.tsx` — add the crossfade base layer behind the video (pure CSS, no JS)

### What this does NOT change

- No design changes (colors, fonts, layout identical)
- No removed features
- No new dependencies
- No translation/i18n changes
- Hero video behavior identical, just smoother handoff
- All recently-optimized assets (videos, webps) preserved

### Modern but trusted methods used

| Technique | Browser support | Why it's safe |
|---|---|---|
| `<link rel="preload" as="image" fetchpriority="low">` | 95%+ | W3C standard since 2020, falls back to no-op |
| `@starting-style` CSS | 89%+ (Chrome 117+, Safari 17.5+, Firefox 129+) | Pure CSS, ignored by older browsers (graceful) |
| `MutationObserver` with attribute filter | 99%+ | Already used; just narrowing the trigger |
| `requestIdleCallback` for preload injection | 96%+ | Already used elsewhere in this codebase |

### Risk: very low
All changes are additive or replace inert visual placeholders. No component logic, no state machines, no API surfaces touched.

