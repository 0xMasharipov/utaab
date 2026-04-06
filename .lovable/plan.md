

# Premium Fixed Bottom Gradient Overlay

## Summary
Add a fixed-position bottom gradient overlay component that creates a deep ocean fade effect, reinforcing UTAAB's Web3 premium aesthetic. Always visible, non-interactive, optimized for mobile.

## Implementation

### New File: `src/components/BottomGradientOverlay.tsx`
A lightweight component rendering a fixed `div` at the bottom of the viewport:
- `position: fixed`, `bottom: 0`, `width: 100%`, `pointer-events: none`
- `z-index: 40` (below modals/nav overlays at 50)
- Height: `140px` on mobile, `160px` on `md+`, `180px` on `lg+`
- Multi-stop CSS gradient: `#02050A` (85% opacity) → `#0A1F3A` (50%) → `#0D2847` (20%) → `transparent`
- `backdrop-filter: blur(8px)` for atmospheric depth
- Subtle grain noise overlay using the existing `.bg-grain` utility class at ~3% opacity

### Modified File: `src/pages/Index.tsx`
Import and render `<BottomGradientOverlay />` as the last child inside the root `div`, so it sits fixed at the bottom across all scroll positions.

### No CSS changes needed
Uses existing Tailwind utilities and the `.bg-grain` class already defined in `index.css`.

