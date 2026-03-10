

# Center Dropdown Panel Under MENU Button

## Current State
The mega menu panel is positioned as a full-width element (`w-[96%] max-w-6xl left-1/2 -translate-x-1/2`), centered relative to the viewport.

## Change

Track the MENU button's horizontal center position using a ref, then position the dropdown panel centered under the MENU button instead of centered on the page.

### `src/components/Navbar.tsx`

1. **Add state to track MENU button center position** — use `hamburgerRef` to calculate the button's horizontal center on mount/resize, store in state (e.g. `menuButtonCenter`).

2. **Update the `useEffect` that measures navbar** (lines 67-73) — also measure `hamburgerRef.current.getBoundingClientRect()` to get the button's center X coordinate.

3. **Update mega menu panel positioning** (line 223):
   - Remove `left-1/2 -translate-x-1/2` (viewport centering)
   - Instead, use inline `left` style set to `menuButtonCenter` and `transform: translateX(-50%)` to center the panel under the MENU button
   - Keep `max-w-6xl` width but add a clamp so the panel doesn't overflow the viewport edges

4. **Add viewport edge clamping** — ensure the panel's left edge never goes below ~2% from viewport edge and right edge doesn't overflow, using `Math.min/Math.max` on the calculated position.

This makes the dropdown appear anchored to the MENU button while retaining its full-width content layout.

