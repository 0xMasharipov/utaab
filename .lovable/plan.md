

# Add Tablet Video to Hero Section

## What
Add a third breakpoint for tablets (768px–1023px) using the uploaded video, so the hero shows:
- **Mobile** (≤767px): `hero-mobile.mp4`
- **Tablet** (768–1023px): uploaded video (`hero-tablet.mp4`)
- **Desktop** (≥1024px): `hero-cube.mp4`

## Changes

### 1. Copy uploaded video to public folder
Copy `user-uploads://UTAAB_HERO_600x839.mp4` → `public/videos/hero-tablet.mp4`

### 2. Update `src/components/Hero.tsx`
- Replace `isMobile` boolean with a `deviceType` state: `'mobile' | 'tablet' | 'desktop'`
- Use two `matchMedia` queries:
  - `(max-width: 767px)` → mobile
  - `(min-width: 768px) and (max-width: 1023px)` → tablet
  - else → desktop
- Map `deviceType` to video source:
  - `mobile` → `/videos/hero-mobile.mp4`
  - `tablet` → `/videos/hero-tablet.mp4`
  - `desktop` → `/videos/hero-cube.mp4`
- Use `deviceType` as the `<video>` `key` prop
- Keep the gradient overlay logic: mobile/tablet use the vertical gradient, desktop uses the horizontal gradient
- Reset `videoReady` when `deviceType` changes

## Files Modified

| File | Change |
|------|--------|
| `public/videos/hero-tablet.mp4` | New — copied from upload |
| `src/components/Hero.tsx` | Add tablet breakpoint and video source |

