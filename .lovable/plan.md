

# Footer Redesign — Geometric Background Element

## Summary
Redesign the footer with a dark blue gradient background and place the two uploaded geometric images as low-opacity decorative background elements — desktop image for `md+` screens, mobile image for small screens. Center them in the lower portion of the footer.

## Changes

### 1. Copy uploaded images to project
- `user-uploads://UTAAB_Footer_2-2.png` → `src/assets/footer-geo-desktop.png`
- `user-uploads://UTAAB_Footer_mobile-2.png` → `src/assets/footer-geo-mobile.png`

### 2. Rewrite `src/components/Footer.tsx`
- Add `relative overflow-hidden` to the footer wrapper
- Apply a dark blue gradient background: `bg-gradient-to-b from-[#0a1628] to-[#060e1a]`
- Add an absolutely positioned decorative `<img>` layer behind all content:
  - Desktop (`hidden md:block`): `footer-geo-desktop.png`, centered horizontally, anchored to bottom, ~60-70% width, opacity 5-8%
  - Mobile (`block md:hidden`): `footer-geo-mobile.png`, centered, anchored to bottom, ~80% width, opacity 5-8%
  - Both use `pointer-events-none`, `z-0`, with content at `z-10` (relative)
- Keep all existing footer content, links, social icons, newsletter, and dynamic bindings untouched
- Improve border styling to match the dark blue aesthetic

### Files Modified
- `src/assets/footer-geo-desktop.png` — New asset
- `src/assets/footer-geo-mobile.png` — New asset
- `src/components/Footer.tsx` — Visual redesign (background + geometric overlay only)

### No changes to
- Any other component or page
- Footer link functionality, i18n keys, admin bindings
- Global styles, navigation, layout

