
## Site Loading Optimization Plan

### Current state assessment

After 6 prior optimization rounds (async CSS, deferred below-fold, lazy privacy widgets, rAF Navbar, network chain shortening), the homepage is at **performance score 92/100**. The remaining "static / laggy" feel is driven by **assets, not code**:

| Issue | Impact | Cause |
|---|---|---|
| `hero-cube.mp4` = 15.3 MB, refetched 3-4× | ~12s load delay, biggest single drag | No HTTP caching + oversized encoding |
| 5 Project PNGs at 980×595 (displayed 215×130) | ~1.4 MB wasted bytes | Wrong format (PNG vs WebP) + wrong dimensions |
| Images appear "static" / pop in suddenly | Perceived lag | `AnimatedImage` waits for full decode before fade-in; no `loading="lazy"` / `decoding="async"` on many `<img>` tags; no LQIP/blur placeholder |
| Hero video competes with LCP text | Render delay | Video starts loading immediately, blocking main thread for decode |
| Below-fold images load all at once when scrolled | Scroll jank | No native lazy-loading hints; IntersectionObserver fires too late |

### What this plan does (3 layers)

**Layer 1 — Re-encode the hero video (biggest single win, ~12s saved)**
- Re-encode `public/videos/hero-cube.mp4` from 15.3 MB to ~2 MB using ffmpeg (H.264 CRF 30, 1280×720 max, 24fps, no audio track since it's muted anyway).
- Re-encode `public/videos/hero-mobile.mp4` similarly to ~800 KB.
- Visually identical at typical viewing distance — same content, lower bitrate.

**Layer 2 — Re-encode project images (~1.3 MB saved, sharper at display size)**
- Convert these 5 PNGs to WebP at 430×260 (2× display size for retina):
  - `UTAAB_UBP.png` (549 KB → ~25 KB)
  - `UTAAB_DVS.png` (289 KB → ~20 KB)
  - `UTAAB_ASN.png` (229 KB → ~18 KB)
  - `UTAAB_DAO.png` (181 KB → ~15 KB)
  - `UTAAB_DID.png` (140 KB → ~14 KB)
- Update `Projects.tsx` import paths to `.webp`.

**Layer 3 — Smooth the perceived loading (eliminate "static" feel)**
- Add `loading="lazy"` and `decoding="async"` to all below-fold `<img>` tags (Resources, Learn, About, Events, Blog cards, Projects).
- Add `fetchpriority="high"` to the hero video `<source>` so it starts decoding immediately while still being smaller.
- In `AnimatedImage.tsx`: reduce IntersectionObserver `rootMargin` from `50px` to `200px` so images start loading earlier as the user scrolls (no more pop-in).
- Shorten the fade-in duration from 400ms to 250ms for snappier feel.
- Add CSS `content-visibility: auto` to below-fold sections so the browser skips rendering work for off-screen content (massive scroll perf win).

### Files to modify

- `public/videos/hero-cube.mp4` — re-encode (binary)
- `public/videos/hero-mobile.mp4` — re-encode (binary)
- `public/images/projects/*.png` → `*.webp` — convert (binary)
- `src/components/Projects.tsx` — update image paths
- `src/components/common/AnimatedImage.tsx` — earlier observer, snappier fade
- `src/components/Resources.tsx`, `src/components/Learn.tsx`, `src/components/AboutBlurb.tsx`, `src/components/Events.tsx`, `src/components/blog/BlogCard.tsx` — add `loading="lazy" decoding="async"` to `<img>` tags
- `src/components/Hero.tsx` — add `fetchpriority` hint to video
- `src/styles/deferred.css` — add `content-visibility: auto` utility for below-fold sections

### Expected outcome

- Initial page weight drops from ~16 MB → ~3 MB (5× faster on slow connections)
- Hero video loads in ~1s instead of 8-12s
- Images fade in smoothly as user scrolls (no static pop-in)
- Scroll feels buttery (content-visibility skips off-screen layout work)
- Lighthouse Performance: ~92 → ~98+

### What this plan does NOT change

- Visual design, colors, layout, animations — all preserved exactly
- No removed features, no changed components
- Hero video still plays, looks identical
- Project images sharper (since 430×260 > displayed 215×130)

### Risks & mitigations

- **Video re-encoding**: I'll keep originals as `hero-cube-original.mp4` backup before overwriting, in case visual quality regresses
- **WebP**: Universally supported (96%+ browsers); fallback not needed
- **content-visibility**: Safari 18+ supports it; older Safari just ignores it (graceful)
