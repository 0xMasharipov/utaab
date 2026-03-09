

# Align Dropdown Menu Precisely Under Navbar

## Problem
The dropdown menu needs to appear directly below the navbar with a small consistent gap, perfectly centered and width-matched on all devices — exactly as shown in the reference image.

## Analysis
Both navbar and panel already share identical horizontal positioning:
- `w-[96%] sm:w-[95%] max-w-6xl left-1/2 -translate-x-1/2`

The only adjustment needed is the **vertical offset** (`top`) to ensure the panel sits snugly below the navbar with a small gap, accounting for:
- Navbar top: `top-2` (8px) on mobile, `top-4` (16px) on sm+
- Navbar inner padding: `py-3` (12px) on mobile, `py-4` (16px) on sm+
- Content height: ~32-40px (logo + buttons)
- Small gap between navbar bottom and panel top

## Change — `src/components/Navbar.tsx`

Update the mega menu `motion.div` top offset to use dynamic calculation that always follows the navbar's bottom edge:

- Use a `ref` on the navbar `<nav>` element to measure its actual bottom position
- Set the panel's `top` based on `navRef.current.getBoundingClientRect().bottom + gap`
- This ensures pixel-perfect alignment on mobile, tablet, and desktop regardless of padding/content changes

Alternatively (simpler, no ref needed): fine-tune the fixed `top` values:
- Mobile: navbar top (8px) + navbar height (~56px) + gap (4px) = `top-[68px]`  
- SM+: navbar top (16px) + navbar height (~64px) + gap (4px) = `top-[84px]`

**Recommended approach**: Use a ref-based measurement for robustness.

| File | Change |
|------|--------|
| `src/components/Navbar.tsx` | Add ref to `<nav>`, compute panel top from navbar bottom + 4px gap |

