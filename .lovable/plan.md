

# Use Uploaded Video for Mobile Hero Background

## What
Replace the desktop cube video (`hero-cube.mp4`) with the uploaded mobile-specific video (`UTAAB_Mobile.mp4`) when viewed on mobile devices. The Hero component already detects `isMobile` — we just need to serve a different video source.

## Changes

### 1. Copy video to `public/videos/`
Copy `user-uploads://UTAAB_Mobile.mp4` → `public/videos/hero-mobile.mp4`

### 2. `src/components/Hero.tsx`
- Change the `<video>` source to be conditional: use `/videos/hero-mobile.mp4` on mobile, `/videos/hero-cube.mp4` on desktop
- Use the existing `isMobile` state to switch sources
- Add a `key={isMobile ? 'mobile' : 'desktop'}` on the `<video>` element to force re-mount when switching (ensures the correct video loads)

```tsx
<video
  key={isMobile ? 'mobile' : 'desktop'}
  ...
>
  <source
    src={isMobile ? '/videos/hero-mobile.mp4' : '/videos/hero-cube.mp4'}
    type="video/mp4"
  />
</video>
```

Two files touched, minimal change.

