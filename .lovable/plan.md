

# Center Mega Menu Panel Under Navbar

## Problem
The mega menu panel appears visually offset/right-aligned despite having centering CSS. The panel uses `max-w-5xl` while the navbar uses `max-w-6xl`, creating a visual mismatch. The panel should match the navbar's width and centering exactly.

## Change — `src/components/Navbar.tsx`

**Line 224**: Update the mega menu panel className to match the navbar's width constraints:
- Change `max-w-5xl` → `max-w-6xl` to match the navbar container width
- Keep `left-1/2 -translate-x-1/2` centering
- Keep `w-[96%]` for mobile

This ensures the panel visually aligns directly under the navbar as an extension of it, centered on the same axis with the same max-width.

| File | Change |
|------|--------|
| `src/components/Navbar.tsx` | Change `max-w-5xl` to `max-w-6xl` on the mega menu panel |

