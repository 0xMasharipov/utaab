## Goal

Process the 4 uploaded silver coin images (background removal → transparent PNGs), upload them as Lovable assets, and weave them into the `/projects/ubpoint` page as premium decorative elements.

## Steps

### 1. Background removal + upload
For each of the 4 uploads, run `imagegen--edit_image` with `transparent_background: true` to produce a transparent PNG, then upload via `lovable-assets create` and write `.asset.json` pointers:
- `user-uploads://UB-Point_2.png` → `src/assets/ubpoint-coin-tilt.png.asset.json` (tilted single coin)
- `user-uploads://UB-Point_4.png` → `src/assets/ubpoint-coin-front.png.asset.json` (front-facing coin)
- `user-uploads://UB-Point_5.png` → `src/assets/ubpoint-coin-edge.png.asset.json` (edge / low-angle coin)
- `user-uploads://UTAAB_UBP_2.png` → `src/assets/ubpoint-coin-stack.png.asset.json` (coin cluster)

### 2. Placement on `src/pages/projects/UBpointPage.tsx`

- **Hero (right side, behind the iPhone)** — add the `coin-stack` cluster as a large decorative element drifting top-right behind the floating phone (`absolute -top-10 -right-10 w-[320px] md:w-[420px] opacity-90 mix-blend-luminosity`), with a slow float animation. Adds visual weight to the hero.
- **Hero floating accent** — replace the existing UBP `Sparkles` toast icon with the small `coin-tilt` thumbnail (32–40px) for an authentic brand touch.
- **Feature grid intro** — add a small `coin-front` (w-12) inline next to the "The platform" pill for brand presence.
- **Metrics section** — replace the two existing reused `coinAsset` floating decorations with the new transparent coins: `coin-tilt` on the left (w-56) and `coin-edge` on the right (w-40), keeping the existing float/rotate animations.
- **Final CTA** — add a subtle `coin-stack` cluster bottom-left at low opacity (`opacity-20 w-[280px]`) for depth on the blue gradient.

All new images use `pointer-events-none select-none`, `loading="lazy"` (except hero), and `aria-hidden` since they're decorative.

### 3. Verify
- Read the edited file back.
- Open `/projects/ubpoint` in the preview and confirm coins render with transparent backgrounds, no white halos, and don't break layout on mobile.

## Out of scope
- No changes to other pages or the global Navbar/Footer.
- No new routes or backend changes.
- The original `ubpoint-coin.png` asset stays in place (still used elsewhere) — new coins are additive.
