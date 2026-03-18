

# Improve Hero Video Loading Speed

## Problem
The hero background video (`/videos/hero-cube.mp4`) loads slowly on page refresh because the browser waits for enough data to buffer before displaying anything — no preloading hint, no poster image for instant visual feedback.

## Changes

### 1. Add `preload="auto"` to the video element (`Hero.tsx`)
Currently the video tag has no `preload` attribute, so the browser uses its default heuristic (often `metadata` only). Adding `preload="auto"` tells the browser to start fetching the full video immediately.

### 2. Add a poster frame for instant visual feedback (`Hero.tsx`)
Extract a still frame from the video (first frame of the cube) and use it as a `poster` attribute. This gives users an immediate visual while the video buffers. We can use a static image or a base64 placeholder. Simplest approach: add `poster="/videos/hero-cube-poster.jpg"` — we'll generate a lightweight JPEG poster.

### 3. Preload the video in `index.html`
Add a `<link rel="preload">` hint in the HTML head so the browser starts fetching the video before React even mounts:
```html
<link rel="preload" as="video" href="/videos/hero-cube.mp4" type="video/mp4">
```

### 4. Add loading state with fade-in transition (`Hero.tsx`)
Track `onCanPlay` or `onLoadedData` event on the video element. Start with `opacity: 0` and fade to `opacity: 1` when the video is ready. This prevents a jarring pop-in and gives a polished loading experience.

## Files to modify

| File | Change |
|------|--------|
| `index.html` | Add `<link rel="preload">` for the video |
| `src/components/Hero.tsx` | Add `preload="auto"`, `poster`, and fade-in on `onCanPlay` |

