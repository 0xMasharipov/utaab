

# Refine Mobile/Tablet Navigation Dropdown Positioning

## Current State
The mega menu panel is already positioned as a full-width fixed element below the navbar with matching width (`w-[96%] sm:w-[95%] max-w-6xl`) and centering. However, it lacks a close (X) button inside the panel, the hamburger never toggles to X, and the 28px border-radius on all corners + 4px gap makes it feel disconnected from the navbar rather than an organic extension.

## Changes — Single File: `src/components/Navbar.tsx`

### 1. Add close (X) button inside the mega menu panel
- Place an `X` icon button in the top-right of the panel content area (absolute positioned)
- Glass-style circular button matching the existing nav button aesthetics
- Calls `closeMenu()`

### 2. Make panel feel connected to navbar
- Reduce top border-radius on the panel from `28px` to `16px` on top, keep `28px` on bottom — gives the "expanding downward" feel
- Reduce gap from 4px to 2px (`rect.bottom + 2`)
- Add a subtle top border highlight that visually connects to navbar's bottom edge

### 3. Toggle hamburger icon to X when open
- Switch `<Menu>` to `<X>` icon based on `isMenuOpen` state so the user sees a clear toggle in the navbar itself

### 4. Adjust mobile padding
- Tighten mobile padding from `p-8` to `p-6` for a cleaner mobile feel
- Add `pt-12` or similar to make room for the close button at top-right

| Area | Change |
|------|--------|
| Hamburger icon | Toggle between `Menu` / `X` based on `isMenuOpen` |
| Panel border-radius | `28px 28px 28px 28px` → `16px 16px 28px 28px` (top smaller) |
| Panel gap | `bottom + 4` → `bottom + 2` |
| Close button | Add glass-style X button, top-right inside panel |
| Mobile padding | Adjust to accommodate close button |

