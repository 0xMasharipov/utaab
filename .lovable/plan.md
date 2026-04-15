

# Refine UTAAB Landing Page — Premium Visual Polish

## Summary
Update hero content, neutralize navbar tint, refine brand colors, improve image loading animations, and unify section styling across the landing page. No layout structure changes, no CMS/admin impact.

## Changes

### 1. Hero Content Updates (`src/i18n/locales/en.json`, `tr.json`, `ar.json`, `ru.json`)
- Change `hero.tagline` from `"LEARN · BUILD · IMPACT"` to `"CONNECT · LEARN · BUILD"`
- Change `hero.supportingLine` to `"Not just another community — a platform for real-world impact."`
- Apply equivalent translations to TR, AR, RU files

### 2. Hero Section (`src/components/Hero.tsx`)
- Remove `fontStyle: 'italic'` from the supporting line (line 183)
- Increase supporting line font weight from 500 to 600 for stronger presence
- Adjust supporting line color from `rgba(127,179,255,0.55)` to `rgba(200,220,255,0.65)` for better readability

### 3. HeroCarousel Update (`src/components/HeroCarousel.tsx`)
- Already shows "CONNECT. LEARN. BUILD." — no change needed (already correct)

### 4. Navbar Neutralization (`src/components/Navbar.tsx`)
- Change default (non-scrolled) background gradient from blue-tinted `rgba(20,40,80,0.3)` to neutral `rgba(10,15,25,0.35)` 
- Reduce border from `border-white/10` to `border-white/[0.06]`
- Soften shadow from `shadow-primary/5` to pure black shadow `rgba(0,0,0,0.15)`
- Keep `backdropFilter: blur(24px)` for glass effect
- Result: transparent/neutral floating pill with no visible blue fill

### 5. Brand Color Consistency (`src/index.css`)
- Reduce atmospheric glow intensity in hero from `0.15`/`0.2` to `0.08`/`0.12` (in Hero.tsx)
- Soften hero button primary gradient to slightly less saturated blue
- Ensure hero-btn-outline border matches `rgba(255,255,255,0.12)` (subtle, not blue)

### 6. Image Loading Animation (`src/components/common/AnimatedImage.tsx`)
- Verify existing shimmer + fade-in behavior; if missing motion (translateY), add a subtle `transform: translateY(8px) → 0` transition alongside opacity fade

### 7. Section Visual Consistency
- **Resources, Projects, Learn cards**: Already use 4-layer system from recent upgrades — verify overlay strengths are consistent:
  - Projects: overlay `0.80 → 0.25` (strong, immersive)
  - Resources: overlay `0.70 → 0.30` (subtle)
  - Learn: verify matches Projects pattern
- Unify any remaining inconsistencies in overlay gradient values across the three sections

### 8. Readability Safeguards
- All overlay changes maintain minimum 60% darkness at bottom where text lives
- Hero supporting line gets higher contrast color
- No bright image areas allowed under text (already enforced by overlay layers)

## Files Modified
- `src/components/Hero.tsx` — remove italic, adjust supporting line styling
- `src/components/Navbar.tsx` — neutralize background tint
- `src/index.css` — minor button/glow refinements
- `src/components/common/AnimatedImage.tsx` — add subtle translateY to fade-in
- `src/i18n/locales/en.json` — tagline + supporting line text
- `src/i18n/locales/tr.json` — translated tagline + supporting line
- `src/i18n/locales/ar.json` — translated tagline + supporting line
- `src/i18n/locales/ru.json` — translated tagline + supporting line

## What does NOT change
- Layout structure (grids, section order, spacing)
- CMS/admin functionality
- Card layer architecture (already upgraded)
- HeroCarousel (already correct)
- Footer, Join, Events, Blog sections

