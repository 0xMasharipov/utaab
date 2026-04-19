
## Add Loading Fade-In Animation to Landing Page Images

### Current state

The `AnimatedImage` component (`src/components/common/AnimatedImage.tsx`) already has a fade-in system:
- Skeleton shimmer placeholder while loading
- `opacity-0 → opacity-100` + `scale-[0.99] → scale-100` + slight `translate-y` on load
- 250ms ease-out duration

But the user perceives images as still "popping in" rather than smoothly fading. The likely reasons:

1. **Duration too short** (250ms) — feels snappy, not smooth
2. **No blur-up** — modern sites (Unsplash, Vercel, Linear) use a subtle blur fade for premium feel
3. **Some landing page images may not use `AnimatedImage`** — need to audit the homepage components for raw `<img>` tags
4. **Skeleton disappears too abruptly** — current 300ms opacity transition could be smoother

### What to change

**1. Enhance `AnimatedImage` fade-in animation**
- Increase fade duration from 250ms → 600ms for a smoother, more premium feel
- Add a subtle `blur(8px) → blur(0)` transition (the "blur-up" technique used by Next.js Image, Cloudinary)
- Smoother easing: `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo) for a graceful settle
- Slightly more pronounced scale: `0.97 → 1` for visible "settling in" effect
- Skeleton fades out in 400ms (was 300ms) for smoother handoff

**2. Audit landing page for raw `<img>` tags**
Check these components for `<img>` that should use `AnimatedImage`:
- `Hero.tsx`, `HeroCarousel.tsx`
- `AboutBlurb.tsx` (already uses it ✓)
- `Community.tsx`, `Learn.tsx`, `Resources.tsx`, `Projects.tsx`, `Events.tsx`, `BlogSection.tsx`, `Join.tsx`
- `Footer.tsx`, `Navbar.tsx` (logo)

Replace any raw `<img>` with `AnimatedImage` so the new fade applies consistently across the entire landing page.

**3. Respect `prefers-reduced-motion`**
Add a media query check — users with reduced motion preference get instant opacity fade only (no blur, no scale, no translate).

### Files to modify

- `src/components/common/AnimatedImage.tsx` — enhanced animation (blur-up, longer duration, premium easing)
- Any landing page component using raw `<img>` for content images (will be identified during implementation; logos/icons stay as `<img>`)

### Visual outcome

```text
Before:  [skeleton] → 250ms snap → [image]
After:   [skeleton] → 400ms fade out
                   ↘ 600ms blur+fade+scale → [image settled]
```

Result: images "develop" into view like a Polaroid — same loading mechanism, but smoother and more premium.

### Does NOT change

- Image sources, paths, dimensions, layout
- Loading strategy (still `loading="lazy"`, `decoding="async"`)
- `IntersectionObserver` preload margins (already mobile-tuned)
- Component logic, props, or any data flow
- Skeleton appearance (just smoother fade-out)

### Risk: very low
Pure CSS animation tweak inside an existing component. All changes respect `prefers-reduced-motion`. Fallback: if animation looks off, revert to current values in one edit.
