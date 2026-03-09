

# Refine Navbar: Hamburger Menu with Full-Screen Blurred Navigation

## What changes

### 1. Hamburger icon — always visible on all screen sizes
Currently the three-line (hamburger) menu button only shows on mobile (`md:hidden`). Move it to be visible on **all breakpoints** as the primary way to access navigation. The existing inline desktop nav links in the center column will be removed — all navigation goes through the hamburger overlay.

### 2. Full-screen blurred transparent navigation overlay
When the hamburger is tapped/clicked, open a **full-screen overlay** instead of the current small floating panel. The overlay:
- Covers the entire viewport (`fixed inset-0`)
- Background: `rgba(8, 16, 36, 0.75)` with `backdrop-filter: blur(20px)`
- Smooth fade + scale animation via framer-motion
- Close button (X) in top-right corner
- Navigation links centered vertically, large text (text-2xl), stacked vertically with spacing
- Language switcher row at the bottom
- Education, Student Sign In, Admin Sign In, and Join buttons below nav links

### 3. Simplified navbar bar
With navigation moved to the overlay:
- Remove the center column desktop nav links entirely
- Keep: Logo (left), Language selector + Account dropdown + Hamburger (right)
- The "Join" button and "Education" button move into the overlay menu only
- Navbar becomes a minimal glass bar: Logo | spacer | Globe + User + ☰

### Files to modify

| File | Change |
|------|--------|
| `src/components/Navbar.tsx` | Remove inline desktop nav, make hamburger visible on all sizes, replace mobile panel with full-screen blurred overlay |

