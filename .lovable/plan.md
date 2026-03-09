

# Center & Refine Mega Menu Positioning

## Problem
The mega menu panel doesn't sit precisely under the navbar. Two mismatches:

1. **Top offset**: Panel uses `top-[60px] sm:top-[68px]` but the navbar's actual bottom edge is higher/lower depending on padding. Needs adjustment to sit snugly below.
2. **Width mismatch**: Navbar uses `w-[96%] sm:w-[95%]` but the panel uses `w-[96%]` on all sizes — causing slight misalignment on `sm+` screens.

## Change — `src/components/Navbar.tsx` (line 224)

Update the mega menu `motion.div` className:

- **Width**: Change from `w-[96%]` to `w-[96%] sm:w-[95%]` to match the navbar exactly
- **Top offset**: Change from `top-[60px] sm:top-[68px]` to `top-[56px] sm:top-[76px]` to account for navbar height + gap (navbar top offset + padding + content + small gap)

This ensures both elements share the same width, max-width, and centering on every breakpoint, with the panel appearing directly below the navbar with a small breathing gap.

| File | Change |
|------|--------|
| `src/components/Navbar.tsx` | Fix panel width to `sm:w-[95%]` and adjust top offset to properly sit under navbar |

