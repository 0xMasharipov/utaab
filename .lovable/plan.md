
# Replace 3D Hero Background with Looping Video

## Summary
Replace the current Three.js 3D background (and CSS mobile fallback) with the uploaded video as a full-screen looping background. The video will cover all devices — mobile, tablet, and desktop — eliminating the need for the separate 3D scene and mobile fallback components.

## Changes

### 1. Copy video to public folder
Copy `user-uploads://Add_little_nodes_1080p_202602201534.mp4` to `public/videos/hero-bg.mp4`. Using `public/` because video files referenced via HTML `<video>` tags should not go through the Vite bundler.

### 2. Update `src/components/Hero.tsx`
- Remove all Three.js lazy loading logic (`HeroBackgroundScene`, `MobileHeroBackground`, `useDeferredLoad`, `useIsMobile`)
- Replace the conditional 3D/mobile background with a single `<video>` element:
  - `autoPlay`, `loop`, `muted`, `playsInline` (required for mobile autoplay)
  - `object-fit: cover` to fill the section on all screen sizes
  - Positioned absolutely behind the content overlay
  - Dark overlay on top of the video for text readability
  - Fade-in transition on load

### 3. Cleanup (optional, can be done later)
The following files become unused and can be removed in a future cleanup:
- `src/components/three/HeroBackgroundScene.tsx`
- `src/components/three/MobileHeroBackground.tsx`

## Technical Details

### Video element structure
```html
<video
  autoPlay
  loop
  muted
  playsInline
  className="absolute inset-0 w-full h-full object-cover"
  src="/videos/hero-bg.mp4"
/>
<!-- Semi-transparent overlay for text contrast -->
<div className="absolute inset-0 bg-black/50" />
```

### Key decisions
- **`muted` + `playsInline`**: Required for autoplay on iOS/Android — browsers block autoplay of unmuted videos
- **`object-cover`**: Ensures the video fills the entire hero section without letterboxing on any aspect ratio
- **Dark overlay (`bg-black/50`)**: Maintains text readability over the video
- **No device branching**: A single `<video>` element works on all screen sizes; the browser handles resolution/performance natively
- **`public/` folder**: Video files should not be bundled by Vite — they're served as static assets

### Files modified

| File | Change |
|------|--------|
| `public/videos/hero-bg.mp4` | New — copied from upload |
| `src/components/Hero.tsx` | Replace 3D/mobile background with looping `<video>` element |
