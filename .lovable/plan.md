

# Enable Mobile Scrolling on Dropdown Menu

## Problem
The mega menu panel has `overflow-hidden` on the outer container, so on mobile (single-column layout) the content overflows and users cannot scroll to see all items.

## Change in `src/components/Navbar.tsx`

**Line 230**: Change `overflow-hidden` to `overflow-y-auto` and cap the panel's max height to the available viewport space below the navbar.

Update the `className` and add `maxHeight` to the inline `style`:
- `className`: `"fixed z-[80] overflow-y-auto"` 
- Add `maxHeight: \`calc(100vh - ${panelTop + 8}px)\`` to the style object

This allows the panel content to scroll vertically on mobile while staying within the viewport.

