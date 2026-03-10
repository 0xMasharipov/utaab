

# Reposition Dropdown Panel to Match Navbar Pill

## Problem
The dropdown panel is currently anchored to the MENU button's center and uses its own width (`w-[96%] max-w-6xl`), which can differ from the navbar pill. It needs to be exactly aligned with and contained within the navbar pill boundaries.

## Approach
Instead of calculating the MENU button center, track the navbar pill's exact bounding rect (left, width) and use those for the dropdown panel positioning. The panel will inherit the pill's horizontal position and width exactly.

## Changes in `src/components/Navbar.tsx`

### 1. Replace `menuButtonCenter` state with `navPillRect` state
Track `left` and `width` of the navbar pill (`navRef`'s inner `<div>` — the rounded-full container). Add a new ref for the pill div itself.

### 2. Update the measurement `useEffect`
Instead of measuring the hamburger button center, measure the pill container's `getBoundingClientRect()` to get its exact `left` and `width`.

### 3. Update dropdown panel positioning (line 228-239)
- Remove `w-[96%] sm:w-[95%] max-w-6xl` classes
- Remove the `menuButtonCenter`-based `left` calculation
- Set inline styles:
  - `left: pillRect.left + 'px'`
  - `width: pillRect.width + 'px'`
  - `top: panelTop` (unchanged)
  - Remove `transform: translateX(-50%)`
- Update `borderRadius` to match the pill style (use `24px` or similar rounded corners, not asymmetric)

This guarantees the dropdown is always exactly the same width as the navbar pill, perfectly aligned beneath it, and never crosses its borders.

