

# Update Hero Video Background

## What
Replace the current desktop hero background video (`/videos/hero-cube.mp4`) with the newly uploaded video file.

## Changes

### 1. Copy uploaded video to `public/videos/hero-cube.mp4`
- Copy `user-uploads://hf_20260304_042253_561d7c06-70f9-414f-a887-2d38c562a010-2.mp4` to `public/videos/hero-cube.mp4`, overwriting the existing file
- No code changes needed — the `Hero.tsx` component already references `/videos/hero-cube.mp4`

### 2. Update preload hint in `index.html`
- Already has `<link rel="preload" as="video" href="/videos/hero-cube.mp4">` — no change needed

### 3. Poster image consideration
- The existing poster (`/videos/hero-cube-poster.jpg`) will no longer match the new video content
- Optionally generate/update the poster frame, or keep the current one as a temporary placeholder (the video fades in over it anyway with a 700ms transition)

| File | Change |
|------|--------|
| `public/videos/hero-cube.mp4` | Replace with uploaded video |

