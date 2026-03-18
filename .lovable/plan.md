

# Learn & Grow Education Ecosystem

## Overview
Create a structured learning ecosystem with two new pages, a navbar dropdown sub-menu for "Learn & Grow", and updated navigation throughout.

## Changes

### 1. Navbar — Add "Learn & Grow" Sub-Menu in Mega Menu
**File:** `src/components/Navbar.tsx`

Replace the current "Learn" item in Column 1 (Ecosystem) with a expandable "Learn & Grow" group that shows 3 sub-items inline (no separate dropdown — fits the existing mega menu pattern):

- **Educational Guides** — navigates to `/learn/guides`
- **Video Tutorials** — navigates to `/learn/guides?tab=videos`
- **Workshops & Bootcamps** — navigates to `/learn/workshops`

Each sub-item gets a small description text and an icon. Styled with the existing glass hover effects and staggered animation.

### 2. Educational Guides Page (`/learn/guides`)
**File:** `src/pages/learn/LearnGuides.tsx` (new)

Structure:
- **Hero**: Dark gradient background, "Learn & Grow" title, subtitle
- **Tab System** using existing `Tabs` component with two tabs:
  - **Educational Guides** tab: Grid of guide cards (3→2→1 responsive) with title, description, difficulty badge, estimated time, "Start Learning" CTA. Static data for now with 5-6 topics (What is Blockchain, Create a Wallet, Intro to Web3, Smart Contracts, DAOs)
  - **Video Tutorials** tab: Grid of video cards with thumbnail placeholders, duration, title. Category filter buttons optional
- URL query param `?tab=videos` auto-activates the Video Tutorials tab on load
- Cards: rounded-2xl, glass-section style, hover:scale-[1.02], UTAAB blue accent gradients

### 3. Workshops Page (`/learn/workshops`)
**File:** `src/pages/learn/LearnWorkshops.tsx` (new)

Minimal "coming soon" page:
- Hero with gradient background
- Centered content: Rocket/GraduationCap icon, "Coming Soon" messaging
- CTA linking to social media / community section
- Subtle floating animation on the icon

### 4. Update Landing Page Learn Section
**File:** `src/components/Learn.tsx`

Make the 3 existing cards clickable — navigate to the respective routes (`/learn/guides`, `/learn/guides?tab=videos`, `/learn/workshops`).

### 5. Routing
**File:** `src/App.tsx`

Add two new lazy-loaded routes:
- `/learn/guides` → `LearnGuides`
- `/learn/workshops` → `LearnWorkshops`

### 6. i18n Keys
**File:** `src/i18n/locales/en.json` (and tr, ru, ar)

Add keys for:
- Nav sub-item descriptions
- Guide card content (titles, descriptions, difficulty levels)
- Workshop coming soon text
- Page titles and subtitles

### 7. Shared Components
- Reuse `Navbar` + `Footer` on both new pages with `AnimatedBlobBackground`
- Reuse existing `Tabs`, `Badge`, `Button`, `Card` UI components
- Guide data stored in `src/data/learnGuides.ts` (new static data file)

## Files Summary

| File | Action |
|------|--------|
| `src/pages/learn/LearnGuides.tsx` | Create — main guides + videos page |
| `src/pages/learn/LearnWorkshops.tsx` | Create — coming soon page |
| `src/data/learnGuides.ts` | Create — static guide/video data |
| `src/components/Navbar.tsx` | Edit — add Learn & Grow sub-items in mega menu |
| `src/components/Learn.tsx` | Edit — make cards navigate to routes |
| `src/App.tsx` | Edit — add 2 new routes |
| `src/i18n/locales/en.json` | Edit — add new i18n keys |
| `src/i18n/locales/tr.json` | Edit — add Turkish translations |
| `src/i18n/locales/ru.json` | Edit — add Russian translations |
| `src/i18n/locales/ar.json` | Edit — add Arabic translations |

