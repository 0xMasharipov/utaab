
# Redesign Team Page with Overlapping Card Layout

## Overview
Complete redesign of the `/team` page using a modern overlapping card system where each team member has a large portrait image card with a frosted glass info card overlapping the bottom-right corner. Includes desktop profile modal and mobile bottom drawer.

## New Components

### 1. `src/components/team/TeamOverlapCard.tsx`
The core card component with two layers:

**Image Card (main layer)**
- 4:5 aspect ratio, `border-radius: 28px`
- Subtle border: `1px solid rgba(255,255,255,0.08)`
- Dark gradient overlay: `linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.45))`
- Uses `AnimatedImage` for lazy loading with shimmer
- Gradient fallback avatar for members without photos (UTAAB brand gradient)

**Glass Info Card (overlapping layer)**
- Absolutely positioned at bottom-right, overlapping outside by ~24px (desktop), ~16px (tablet), ~12px (mobile)
- ~55% width, ~30-35% height of image card
- `border-radius: 24px`, `backdrop-blur: 14px`
- Background: `rgba(255,255,255,0.08)`, border: `1px solid rgba(148,163,184,0.18)`
- Content: tag label (e.g. "Leadership"), name (Montserrat 700), role, 2-line bio with `line-clamp-2`, optional LinkedIn icon button

**Hover interaction**
- Card lifts `translateY(-4px)` on hover with 240ms ease-out
- Border brightens subtly
- Respects `prefers-reduced-motion`
- onClick opens modal (desktop) or drawer (mobile)

### 2. `src/components/team/TeamProfileModal.tsx`
Desktop profile modal using Radix Dialog:
- Glass-styled content panel
- Larger photo, full name, role, complete bio
- Social links (LinkedIn)
- Smooth fade-in/scale animation

### 3. `src/components/team/TeamProfileDrawer.tsx`
Mobile bottom drawer using vaul `Drawer`:
- Same content as modal but in bottom sheet format
- Pull-to-dismiss handle
- Glass background styling

## Updated Files

### `src/pages/TeamPage.tsx` (full rewrite)
- Replace current layout with new overlapping card grid
- Hero section: title + subtitle (kept from current)
- All 5 members rendered in unified grid (no separate founder section -- founder gets a "Founder" tag on their card)
- Grid: 3 columns (desktop >= 1200px), 2 columns (tablet 768-1199px), 1 column (mobile)
- Gap: 28px desktop, adapts down
- Staggered Framer Motion entrance animations
- State management for selected member + modal/drawer open

### Data Structure
```text
teamMembers = [
  { key: 'zinurbek', image: zinurbekImg, tag: 'Founder' },
  { key: 'yunus', image: yunusImg, tag: 'Leadership' },
  { key: 'abdulla', image: abdullaImg, tag: 'Engineering' },
  { key: 'abdulbaki', tag: 'Operations' },
  { key: 'umut', image: umutImg, tag: 'Operations' },
]
```
Name, role, and bio pulled from i18n `team.members.[key].*`.

### `src/i18n/locales/en.json` (and tr, ar, ru)
Add `teamPage.founderTag`, `teamPage.viewProfile` keys. Keep existing `team.members.*` data unchanged.

## Responsive Behavior

| Breakpoint | Columns | Gap | Info Overlap | Name Size |
|------------|---------|-----|-------------|-----------|
| >= 1200px  | 3       | 28px | 24-30px    | 20px      |
| 768-1199px | 2       | 20px | 18-22px    | 18px      |
| < 768px    | 1       | 16px | 12-16px    | 16-18px   |

Mobile: image card slightly shorter aspect ratio to avoid long scroll. Bio clamped to 2 lines.

## Performance
- All images use `AnimatedImage` (lazy load + shimmer + fade-in)
- `loading="lazy"` on image tags
- Blur effects kept minimal (14-16px only on info card, not full screen)
- `prefers-reduced-motion` media query disables hover transforms

## Technical Notes

### Files Created
| File | Purpose |
|------|---------|
| `src/components/team/TeamOverlapCard.tsx` | Overlapping image + glass info card |
| `src/components/team/TeamProfileModal.tsx` | Desktop profile detail modal |
| `src/components/team/TeamProfileDrawer.tsx` | Mobile bottom drawer for profile |

### Files Modified
| File | Change |
|------|--------|
| `src/pages/TeamPage.tsx` | Full rewrite with new card grid + modal/drawer |
| `src/i18n/locales/en.json` | Add `teamPage.viewProfile` key |
| `src/i18n/locales/tr.json` | Add `teamPage.viewProfile` key |
| `src/i18n/locales/ar.json` | Add `teamPage.viewProfile` key |
| `src/i18n/locales/ru.json` | Add `teamPage.viewProfile` key |

### Dependencies Used (already installed)
- `framer-motion` -- entrance animations
- `vaul` -- mobile drawer
- `@radix-ui/react-dialog` -- desktop modal
- `lucide-react` -- icons (User, Linkedin, X)
- Existing `AnimatedImage`, `AnimatedBlobBackground`, `useIsMobile`
