

# Convert Full-Screen Overlay to Rounded Dropdown Panel

## Problem
The navigation menu currently opens as a full-screen overlay. User wants it as a compact, rounded, blurred panel that drops down directly below the navbar.

## Changes — `src/components/Navbar.tsx`

### 1. Replace full-screen overlay with a positioned dropdown panel
- Change from `fixed inset-0` to a panel positioned below the navbar: `fixed top-[70px] left-1/2 -translate-x-1/2 z-[80] w-[96%] sm:w-[95%] max-w-6xl`
- Add rounded corners: `rounded-3xl`
- Same glass blur style: `rgba(8, 16, 36, 0.82)` with `backdrop-filter: blur(24px) saturate(180%)`
- Border: `1px solid rgba(255,255,255,0.12)`
- Shadow for depth

### 2. Remove close button and center-stretch layout
- Remove the separate close (X) button row — clicking the hamburger again or clicking outside closes it
- Remove `flex-1 justify-center` vertical centering — content flows naturally with padding
- Add click-outside handler to close

### 3. Compact content layout
- Nav links: smaller text (`text-lg` instead of `text-2xl/3xl`), arranged in a grid or compact vertical list with less gap
- Action buttons: horizontal row instead of full-width stacked column
- Language switcher: compact row at bottom
- Auth links: always visible in the panel (remove `sm:hidden` restriction)
- Overall padding: `p-6 sm:p-8`

### 4. Animation
- Change from scale to `y: -10` slide-down entrance
- Keep opacity fade

### 5. Remove body scroll lock
- Since it's no longer full-screen, no need to lock body scroll — remove the scroll-lock `useEffect`

### 6. Add backdrop click-to-close
- Add a transparent backdrop div behind the panel that closes the menu on click

| File | Change |
|------|--------|
| `src/components/Navbar.tsx` | Convert overlay to rounded dropdown panel below navbar |

