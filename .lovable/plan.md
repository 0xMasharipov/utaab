
# Unify Education Navbar with Main Navbar + Fix Logo Navigation

## Problem 1: Education Navbar looks different
The EducationNavbar uses a completely different visual style from the main Navbar:
- Different layout (flexbox vs CSS grid)
- Different glassmorphism (simple `glass-strong` class vs the premium gradient backgrounds with blur/saturate/brightness)
- Different logo image (`logo.png` vs `logo-new.png`)
- Different mobile menu background (`rgba(15, 23, 42, 0.75)` with 32px blur vs `rgba(10, 15, 30, 0.92)` with 40px blur)
- Missing scroll-based visual state transitions (hero state vs scrolled state)
- No language transition classes

## Problem 2: Logo doesn't navigate home from other pages
The main Navbar logo calls `scrollToSection('hero')` which only works on the Index page. On pages like /team, clicking the logo does nothing because there's no `#hero` element on that page.

## Plan

### A) Fix main Navbar logo navigation (all pages)
In `src/components/Navbar.tsx`, update the logo click handler:
- Check if the user is on the home page (`/`)
- If yes: scroll to hero section (current behavior)
- If no: navigate to `/` first

### B) Unify EducationNavbar appearance with main Navbar
Rewrite `src/components/education/EducationNavbar.tsx` to match the main Navbar's visual style while keeping its own navigation items and auth logic:

**Structural changes:**
- Switch from flexbox to CSS grid layout (`grid-cols-[auto_1fr_auto]`)
- Use the same logo image (`logo-new.png` with `mix-blend-lighten brightness-110`)
- Logo click navigates to `/` (main site home) instead of `/education`

**Glassmorphism matching:**
- Apply the same two-state background system:
  - Hero state: `linear-gradient(135deg, rgba(10, 20, 50, 0.25) ...)` with 24px blur
  - Scrolled state: `linear-gradient(135deg, rgba(10, 10, 20, 0.9) ...)` with shadow-xl
- Same border, box-shadow, and inset highlight transitions

**Mobile menu matching:**
- Background: `rgba(10, 15, 30, 0.92)` with 40px blur (matching main)
- Same close button, rounded-3xl panel, border-white/30
- Same menu item styling and spacing
- Add language grid selector at bottom (matching main menu)
- Add Education Platform button (blue gradient), Student Sign In button, Admin Sign In link (matching main menu structure)

**Desktop nav:**
- Show education-specific links (Categories, All Courses, Admin) in the center column with the same scroll-based show/hide behavior
- Keep the user auth dropdown and language selector in the right column

### Files to modify

| File | Change |
|------|--------|
| `src/components/Navbar.tsx` | Fix logo click: navigate to `/` when not on home page |
| `src/components/education/EducationNavbar.tsx` | Rewrite visual style to match main Navbar exactly |

### Technical details

**Logo navigation fix (Navbar.tsx):**
```typescript
const handleLogoClick = () => {
  if (window.location.pathname === '/') {
    scrollToSection('hero');
  } else {
    navigate('/');
  }
};
```

**EducationNavbar key style changes:**
- Outer nav: `w-[96%] sm:w-[95%] max-w-6xl` (fixed width, no dynamic sizing)
- Inner div: same gradient backgrounds with `backdropFilter: 'blur(24px) saturate(200%) brightness(0.95)'`
- Grid layout: `grid grid-cols-[auto_1fr_auto] items-center gap-4`
- Logo: import `logo-new.png`, add `mix-blend-lighten brightness-110`
- Mobile panel: `background: 'rgba(10, 15, 30, 0.92)'`, `backdropFilter: 'blur(40px) saturate(200%) brightness(0.95)'`
