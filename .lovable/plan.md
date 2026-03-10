

# Replace Hamburger with MENU Text Button

## Changes in `src/components/Navbar.tsx`

### 1. Replace hamburger icon button (lines 211-220)
- Remove `Menu` and `X` icon imports (keep `X` for the panel close button)
- Replace the hamburger `<button>` with a typography-based "MENU" / "CLOSE" text button
- Style: `font-semibold tracking-[0.06em] text-white text-sm bg-transparent hover:opacity-70 cursor-pointer` — no borders, no background, Montserrat inherited
- The button text toggles between "MENU" and "CLOSE" based on `isMenuOpen`

### 2. Reorder right-side control group (line 166)
- Remove the Account dropdown from between Language and Menu (it already exists inside the mega menu panel)
- Final order: `[ Language Selector ] [ MENU button ]`
- Increase gap from `gap-2` to `gap-3 sm:gap-4` for 12-16px spacing
- Both vertically centered via existing `items-center`

### 3. Dropdown positioning (already correct)
- The mega menu panel already positions below the navbar via `panelTop` (measured from `navRef.current.getBoundingClientRect().bottom + 2`) and uses the same width/centering as the navbar
- No structural change needed — the dropdown already opens under the full navbar, not under the button

## Summary of visual result
- Logo (left) — `[ 🌐 Lang ]` `[ MENU ]` (right)
- Clean, minimal, Web3-style text trigger
- Panel behavior unchanged (slides down from navbar edge)

