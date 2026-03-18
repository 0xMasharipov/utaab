

# Add Spacing Below HeroCarousel

## Problem
The HeroCarousel currently has `marginBottom: -60` which causes it to overlap with the Community section below. Need to add proper spacing similar to the gap between other sections like Learn & Grow.

## Change

**File:** `src/components/HeroCarousel.tsx`
- Change `marginBottom: -60` to `marginBottom: 0` (or remove it) to restore natural spacing between the carousel and the Community section below, matching the consistent section spacing used throughout the page.

