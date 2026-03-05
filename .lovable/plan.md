

# Add Grid Background & Bottom Fade to GlassCard and `.glass` Cards

## Approach

The grid and bottom-fade effects need to apply to two card systems used across the site:
1. **`GlassCard` component** (`src/components/glass/GlassCard.tsx`) — used by Blog, Team, PDFs
2. **`.glass` CSS class** (`src/index.css`) — used by Community, Events, Stats, Learn, Forms, etc.

Both will get `::before` (grid) and `::after` (bottom fade) pseudo-elements via CSS. The `GlassCard` component needs `relative overflow-hidden` and children need `relative z-[2]`. For the `.glass` utility, same pseudo-element approach in CSS.

## Changes

### 1. `src/index.css` — Add grid + fade to `.glass` class
Add `position: relative; overflow: hidden;` to `.glass` base. Add `::before` pseudo for subtle grid (56px spacing, `rgba(255,255,255,0.04)` lines, `opacity: 0.55`). Add `::after` pseudo for bottom fade gradient. Add `> *` rule for `position: relative; z-index: 2`. Mobile media query reduces grid opacity to `0.3`.

### 2. `src/components/glass/GlassCard.tsx` — Add grid + fade via internal pseudo-elements
Add two internal `<div>` pseudo-layers (grid + fade) inside the component before `{children}`. Wrap children in a `relative z-[2]` container. Add `relative overflow-hidden` to the outer div. Use `isMobile` check or just use Tailwind responsive classes for reduced mobile opacity.

Using internal divs is cleaner for a React component than trying to use CSS pseudo-elements with Tailwind. This keeps it self-contained.

## Files

| File | Change |
|------|--------|
| `src/index.css` | Add `::before` grid + `::after` fade + `> *` z-index to `.glass` and `.glass-strong` |
| `src/components/glass/GlassCard.tsx` | Add grid overlay div + bottom fade div inside component, ensure children have relative z-index |

