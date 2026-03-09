

# Update Hero Background Video

## What
Replace the current hero background video (`hero-cube.mp4`) with the new uploaded video (`BG_UTAAB.mp4`). The video will loop and autoplay as it does currently.

## Changes

### 1. Copy uploaded video to `public/videos/BG_UTAAB.mp4`

### 2. `src/components/Hero.tsx`
- Update the desktop video source from `/videos/hero-cube.mp4` to `/videos/BG_UTAAB.mp4`

### 3. `index.html`
- Update the `<link rel="preload">` hint from `hero-cube.mp4` to `BG_UTAAB.mp4`

No other changes needed — autoplay, loop, muted, and playsInline are already set.

| File | Change |
|------|--------|
| `public/videos/BG_UTAAB.mp4` | Copy uploaded video |
| `src/components/Hero.tsx` | Update video source path |
| `index.html` | Update preload link |

