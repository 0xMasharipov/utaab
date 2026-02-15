

# Update Navbar Logo

## What Changes
Replace the current `logo-small.webp` in the navbar with the new UTAAB logo (blue diamond cross pattern).

## Steps

1. **Copy the uploaded image** to `src/assets/logo-new.png`
2. **Update `src/components/Navbar.tsx`**:
   - Change the import from `logo-small.webp` to the new logo file
   - Remove any CSS filter workarounds (mix-blend-lighten, brightness) since the new logo has a clean transparent-friendly design on white background
   - Keep the same sizing (`h-8 sm:h-10`)
3. **Update `src/components/Footer.tsx`** (if it also uses the old logo) to use the new image for brand consistency
4. **Keep the `BrandText` component** ("UTAAB") displayed alongside the new logo as before

## Technical Details

| File | Change |
|------|--------|
| `src/assets/logo-new.png` | New file - copied from upload |
| `src/components/Navbar.tsx` | Update logo import path |
| `src/components/Footer.tsx` | Update logo import if applicable |

The logo has a white background in the source file, so we may need `mix-blend-lighten` or similar treatment to make it blend with the dark navbar, similar to the existing approach documented in the design memory.

