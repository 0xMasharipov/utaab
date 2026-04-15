

# Replace Rocket Icon on Workshops Page

## Summary
Replace the Lucide `Rocket` SVG icon with the uploaded `ROCKET.webp` image and remove the wiggling (bounce) animation.

## Changes

### `src/pages/learn/Workshops.tsx`
1. Remove `Rocket` import from `lucide-react`
2. Replace the `<motion.div animate={{ y: [0, -8, 0] }}>` wrapper (lines 23-29) with a static `<div>` containing an `<img>` tag pointing to `/images/rocket.webp`
3. Keep the container styling (`w-16 h-16 rounded-2xl bg-primary/20 mb-8`) but remove the infinite bounce animation
4. Image sized to fit within the container (~`w-10 h-10 object-contain`)

### Asset
- Copy `ROCKET.webp` to `public/images/rocket.webp`

### What does NOT change
- Page layout, text, translations, glass card, blob background
- Navbar, Footer

## Files Modified
- `src/pages/learn/Workshops.tsx` — icon swap + remove animation
- `public/images/rocket.webp` — new asset

