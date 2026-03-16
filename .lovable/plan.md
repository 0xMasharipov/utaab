

# Refine Hero Buttons + Infinite Carousel Transition Band

## Changes

### 1. Refine Hero Buttons
**`src/components/Hero.tsx`**:
- **"Join Us"** button: Upgrade to a premium glassmorphism style with a subtle blue glow border animation, slightly larger padding, and an arrow icon (`ArrowRight` from lucide)
- **"Explore Ecosystem"** button: Add `onClick` that scrolls to `#projects` section. Refine with a gradient border effect (blue → light blue) and subtle shimmer
- Both buttons get improved hover states with smooth glow transitions via CSS instead of inline `onMouseEnter/Leave` handlers

### 2. Create Infinite Carousel Transition Component
**New file: `src/components/HeroCarousel.tsx`**:
- Renders "CONNECT.  LEARN.  BUILD." repeated 4× in a single row, duplicated for seamless loop
- CSS keyframe animation: `scroll 25s linear infinite` translating -50% horizontally
- Montserrat 600 weight, uppercase, `letter-spacing: 0.25em`
- Text styled with `rgba(255,255,255,0.85)` and `text-shadow: 0 0 20px rgba(0,150,255,0.3)` glow
- Pauses on hover
- Positioned with `margin-top: -60px; margin-bottom: -60px; z-index: 5` to overlap hero bottom and Stats top
- Background: gradient blend from hero tone to dark section (`linear-gradient(to bottom, rgba(10,40,120,0.4), rgba(5,10,25,0.95))`) with `backdrop-filter: blur(12px)`

### 3. Eliminate Visible Line Between Hero and Stats
**`src/components/Hero.tsx`**:
- Remove the existing 120px bottom fade div (the hard gradient to `#081624` causes the visible line)

**`src/components/Stats.tsx`**:
- Remove top padding to close the gap — the carousel now bridges the sections

**`src/index.css`**:
- Add `@keyframes hero-carousel-scroll` animation
- Add `.hero-carousel-track` utility class

### 4. Wire Carousel into Index
**`src/pages/Index.tsx`**:
- Import and place `HeroCarousel` between `<Hero />` and `<Stats />`

## Files Modified

| File | Change |
|------|--------|
| `src/components/Hero.tsx` | Refine buttons, remove bottom fade div, add scroll-to-projects |
| `src/components/HeroCarousel.tsx` | New — infinite carousel transition band |
| `src/components/Stats.tsx` | Adjust top spacing for seamless blend |
| `src/pages/Index.tsx` | Add `HeroCarousel` between Hero and Stats |
| `src/index.css` | Add carousel keyframe animation |

