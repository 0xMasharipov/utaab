

# Keep Navbar Style Consistent on Scroll

## Problem
When the user scrolls, the navbar switches to a darker, more opaque background. The user wants it to stay the same as the initial (non-scrolled) transparent state.

## Change — `src/components/Navbar.tsx`

Remove the `isScrolled` conditional styling so the navbar always uses the initial transparent glass appearance:

- **Background**: Always use `linear-gradient(135deg, rgba(10, 20, 50, 0.25) 0%, rgba(20, 40, 80, 0.2) 50%, rgba(10, 20, 50, 0.25) 100%)`
- **Border**: Always `border-white/10`
- **Shadow**: Always `shadow-lg shadow-primary/5`
- **Box shadow**: Always the lighter variant (`0 4px 24px ...`)

Optionally remove the `isScrolled` state and scroll listener entirely if no other part of the component uses it.

| File | Change |
|------|--------|
| `src/components/Navbar.tsx` | Remove scroll-dependent styling, keep initial transparent appearance |

