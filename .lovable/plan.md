

# Update "Community Projects" Cards with 4-Layer 3D Visuals

## Summary
Replace icon-based project cards with immersive 4-layer cards featuring the uploaded 3D images, matching the "What We Build" and "Learn & Grow" visual system.

## Assets
Copy 6 uploaded images to `public/images/projects/`:
- `UTAAB_UBP.png` → UBP card
- `UTAAB_TonRa.png` → TonRa card
- `UTAAB_ASN.png` → ASN card
- `UTAAB_DVS.png` → DVS card
- `UTAAB_DID.png` → DID card
- `UTAAB_DAO.png` → DAO card

## Changes

### `src/components/Projects.tsx`

1. Remove iconoir imports (`Coins`, `Search`, `CreditCard`, `ShieldCheck`, `Fingerprint`, `Community`)
2. Remove `Button` import (unused)
3. Update `Project` interface: replace `icon: React.ElementType` with `image: string`
4. Update `projects` array with image paths instead of icon components
5. Rewrite each card to use the 4-layer structure inside `GlassCard`:

```text
GlassCard (relative overflow-hidden min-h-[260px] p-0)
  ├── Layer 1 (z-0):  Grid background — subtle CSS linear-gradient pattern, opacity 0.05
  ├── Layer 2 (z-10): 3D image — absolute bottom-0 right-0, w-[55%], opacity-85, hover:scale-105
  ├── Layer 3 (z-20): Dark gradient overlay — linear-gradient to top, 80% → 25% → transparent
  └── Layer 4 (z-30): Text content — status badge, title, description, tags with padding
```

6. Keep: status badge styling, tag pills, i18n keys, motion animations, grid `lg:grid-cols-3`, section heading/subtitle

### What does NOT change
- Section heading, subtitle, spacing
- Grid layout (`md:grid-cols-2 lg:grid-cols-3`)
- Text content / i18n keys
- Status badges and tag pills
- Motion animations
- Other sections

## Files Modified
- `src/components/Projects.tsx` — card structure rewrite
- `public/images/projects/` — 6 new image assets

