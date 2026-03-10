

# Move Menu & Language Buttons to Right End of Navbar

## Change

The current layout is: `Logo (flex-1 left)` | `Globe + MENU (center)` | `empty spacer (flex-1 right)`.

Move the Globe + MENU group from center to right by swapping it with the empty spacer div.

### `src/components/Navbar.tsx` (lines 174-212)

1. **Remove the center group** (lines 174-209) containing Globe + MENU
2. **Replace the right spacer** (lines 211-212) with the Globe + MENU group, wrapped in `flex-1 flex justify-end`
3. Add an empty center spacer `<div className="flex-1" />` where the buttons used to be

Result layout: `Logo (flex-1 left)` | `spacer (flex-1 center)` | `Globe + MENU (flex-1 right, justify-end)`

