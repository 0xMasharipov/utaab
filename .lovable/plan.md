

# Improve About Page, Footer, and Team Page Aesthetics

## Summary
Three changes: (1) Remove team section from About page and polish its visual hierarchy, (2) Enhance Team page with richer hero and visual polish, (3) Refine footer aesthetics with better spacing, typography, and visual depth.

## 1. About Page (`src/pages/About.tsx`)

**Remove team section entirely** (lines 232-270) — all team imports, state, and the TeamOverlapCard/Modal/Drawer code.

**Visual improvements:**
- Hero: Add a subtle accent gradient line or decorative element below headline; increase bottom padding
- Why UTAAB: Add numbered accent indicators (01, 02, 03, 04) on each glass card for visual rhythm
- Mission & Vision: Add accent-colored top border or icon to differentiate the two cards
- What We Do: Add gradient accent backgrounds to icon containers (rounded circle with accent/10 bg)
- Impact: Use larger icon containers with gradient rings similar to team cards
- CTA: Add a subtle radial gradient glow behind the card for depth

## 2. Team Page (`src/pages/TeamPage.tsx`)

**Enhanced hero:**
- Add a subtle tagline/badge above the title (e.g., "The People Behind UTAAB")
- Add a decorative accent line below subtitle
- Increase vertical spacing for more breathing room

**Grid improvements:**
- Add a subtle section divider or decorative element between hero and grid
- Slightly larger gap on desktop for premium feel

## 3. Footer (`src/components/Footer.tsx`)

**Visual refinements:**
- Add a subtle top gradient border/glow line at the very top of the footer for visual separation
- Increase geometric background opacity slightly (0.06 -> 0.08 desktop, 0.07 -> 0.09 mobile) for stronger brand presence
- Add subtle radial gradient overlay in the center behind the geometric image for depth
- Refine bottom bar with slightly more padding and a softer separator

## Files Modified
- `src/pages/About.tsx` — Remove team section, add visual polish to remaining 6 sections
- `src/pages/TeamPage.tsx` — Enhanced hero section with badge and decorative elements
- `src/components/Footer.tsx` — Refined visual depth, top glow line, stronger geometric presence

## No changes to
- i18n files (reuse existing keys)
- TeamOverlapCard, TeamProfileModal, TeamProfileDrawer components
- GlassCard, GlassSectionWrapper components
- Any admin, database, or routing logic

