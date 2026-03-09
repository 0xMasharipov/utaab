

# Mega Menu: Wide 3-Column Glass Panel

## Problem
The current dropdown is a narrow right-aligned panel. The user wants a wide, centered mega menu with 3 columns of navigation links and a bottom CTA row, using frosted glass styling.

## Changes — `src/components/Navbar.tsx`

### 1. Panel positioning & size
- Change from narrow right-aligned (`sm:max-w-md sm:right-[2.5%]`) to wide centered panel
- Width: `w-[96%] max-w-5xl left-1/2 -translate-x-1/2` on all breakpoints
- Top position: `top-[60px] sm:top-[68px]` (stays snug under navbar)
- Same glass styling: `rgba(255,255,255,0.08)`, `blur(20px)`, `border-radius: 28px`
- Stronger shadow: `0 30px 80px rgba(0,0,0,0.25)`

### 2. Three-column navigation layout
Replace the single vertical list with a 3-column grid on desktop (`grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-16`).

**Column 1 — Ecosystem** (scroll-to-section links):
- Community
- Learn
- Events
- Projects

**Column 2 — Explore** (mix of scroll + page links):
- Resources
- Blog
- Education (links to `/education`)

**Column 3 — Organization** (page links):
- Team
- About / Contact (can point to join section for now)

Each column gets a small header label (`text-xs uppercase tracking-widest text-white/40 mb-4`). Links are `text-lg font-semibold` with the same rounded hover pill (`hover:bg-white/[0.08] rounded-xl px-4 py-2.5`).

On mobile (`< sm`), columns stack vertically with dividers between them.

### 3. Bottom CTA row
Below the columns, separated by a divider, a horizontal row with:
- Left: Education Platform + Join UTAAB buttons (pill style)
- Center: Student Sign In link
- Right: Language selector pills

Layout: `flex items-center justify-between` on desktop, stacked on mobile.

### 4. Increased padding
- Panel padding: `p-8 sm:p-10 md:p-12` for generous breathing room

### 5. Animation
- Keep existing: fade + slide down (`y: -8`), 250ms ease-out
- Stagger links per column

### 6. Mobile behavior
- On mobile, the panel becomes full-width single-column with the same glass effect
- Columns stack vertically with section headers
- CTA row stacks vertically

| File | Change |
|------|--------|
| `src/components/Navbar.tsx` | Convert narrow dropdown to wide centered 3-column mega menu panel |

