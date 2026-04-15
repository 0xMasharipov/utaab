

# Replace Resources Section Icons with 3D White Assets

## Summary
Replace the three Iconoir SVG icons in the Resources section with the uploaded 3D white PNG images. Keep the card layout, text, and list items completely unchanged. Icons stay compact in the top-left, acting as visual accent — not dominating the card.

## Assets
Copy 3 uploaded images to `public/images/resources/`:
- `UTAAB_Documentation.png` → Documentation card
- `UTAAB_Dev_Tools.png` → Development Tools card
- `UTAAB_Research_Papers.png` → Research Papers card

## Changes

### `src/components/Resources.tsx`
1. Remove Iconoir imports (`Page`, `Code`, `BookmarkBook`)
2. Replace `icon` field in `resources` array with `image` path string:
   ```ts
   { image: '/images/resources/UTAAB_Documentation.png', title: ..., items: ... },
   { image: '/images/resources/UTAAB_Dev_Tools.png', ... },
   { image: '/images/resources/UTAAB_Research_Papers.png', ... },
   ```
3. Replace the `<resource.icon>` element with an `<img>` tag:
   - Size: `w-12 h-12 sm:w-14 sm:h-14` (slightly larger than current 10-12 SVG icons)
   - Classes: `object-contain mb-4 sm:mb-6 group-hover:scale-105 transition-transform duration-300`
   - Add `loading="lazy"`, `alt=""`, `aria-hidden="true"` (decorative)
4. Everything else stays identical: card classes, text, list, grid, section heading, animations

## What does NOT change
- Card layout, spacing, grid (`lg:grid-cols-3`)
- Text content, i18n keys, list items
- Section heading and subtitle
- Hover background effect on cards
- Other sections

## Files Modified
- `src/components/Resources.tsx` — icon → image swap
- `public/images/resources/` — 3 new image assets

