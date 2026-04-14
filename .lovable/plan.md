

# Phase 1: Homepage Redesign

## Summary
Redesign the UTAAB homepage into a streamlined, high-conversion landing page. Remove text-heavy mission/vision content from the homepage (will become a separate About page in Phase 2). Keep the sections essential for conversion and trust.

## New Homepage Section Order

```text
1. Navbar (unchanged)
2. Hero (keep existing video hero - minor copy tweaks only)
3. HeroCarousel (keep "CONNECT. LEARN. BUILD." band)
4. About Blurb (NEW - replaces Community section)
5. Ecosystem / Projects (redesigned Projects section)
6. Events (keep, modernize layout)
7. Blog (keep as-is)
8. Team (NEW on homepage - pulled from TeamPage)
9. Join / CTA (keep)
10. Footer (keep)
```

## Detailed Changes

### 1. New "About Blurb" Section (`src/components/AboutBlurb.tsx`)
- Replace the current `Community` section (which has long mission/vision text)
- Short 1-2 sentence description of UTAAB
- Three icon-based value cards (Collaborative, Goal-Oriented, Innovative) - reuse existing i18n keys
- "Learn More" button linking to `/about` (page built in Phase 2)
- Clean, minimal glass card layout

### 2. Redesign Projects/Ecosystem Section (`src/components/Projects.tsx`)
- Reduce text per card - shorter descriptions, more visual
- Add subtle icon or illustration to each project card
- Keep existing data structure and i18n keys
- More compact grid with better visual hierarchy

### 3. Add Team Section to Homepage (`src/pages/Index.tsx`)
- Import the existing `Team` component (already exists at `src/components/Team.tsx`)
- Place it between Blog and Join sections
- Team is already dynamic, pulling from the `team_members` database table

### 4. Remove Sections from Homepage
- **Remove**: `Resources` component (accessible via nav only)
- **Remove**: `Learn` component (accessible via nav only)
- **Replace**: `Community` with new `AboutBlurb`

### 5. Update `src/pages/Index.tsx`
- Remove `Community`, `Learn`, `Resources` imports
- Add `AboutBlurb` and `Team` imports
- New section order: Hero -> Carousel -> AboutBlurb -> Projects -> Events -> Blog -> Team -> Join -> Footer

### 6. Translation Keys
- Add new keys under `about` namespace in all 4 locale files (en, tr, ru, ar):
  - `about.blurb` - short homepage description
  - `about.learnMore` - "Learn More" button text

## Files Modified
- `src/components/AboutBlurb.tsx` - **New file**
- `src/pages/Index.tsx` - Restructure section order
- `src/components/Projects.tsx` - Visual refresh (less text, more compact)
- `src/i18n/locales/en.json` - Add `about.blurb`, `about.learnMore`
- `src/i18n/locales/tr.json` - Same keys
- `src/i18n/locales/ru.json` - Same keys
- `src/i18n/locales/ar.json` - Same keys

## What Stays Untouched
- All admin panel functionality
- Hero section (already modernized with video background)
- HeroCarousel
- Events, Blog, Join, Footer components
- Database tables, edge functions, RLS policies
- Navigation/routing structure

## Phase 2 (Future)
- Create `/about` page with full mission, vision, philosophy
- Add route in App.tsx
- Add navigation link

