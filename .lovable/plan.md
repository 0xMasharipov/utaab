

# Seamless Hero-to-Stats Gradient Transition

## Problem
The hero section has a white background (`#fff`) that abruptly meets the dark navy blob background of the stats section, creating a harsh visual break.

## Solution
Create a smooth white → blue → dark gradient flow by modifying three files:

### 1. `src/components/Hero.tsx`
- Remove the hard `background: '#fff'` on the section
- Replace with a multi-stop vertical gradient: `linear-gradient(180deg, #ffffff 0%, #f3f7fb 15%, #e6eef7 30%, #cddff1 45%, #9ec2e6 60%, #4a90d9 75%, #0b2a45 100%)`
- Add a bottom fade overlay (`::after` equivalent) — a 180px tall absolutely-positioned div at the bottom that blends from transparent to `rgba(12,24,44,0.85)`, bridging into the dark stats section
- Keep the existing left-to-right gradient overlay for video visibility on desktop, but layer it on top of the new vertical gradient
- On mobile, merge the two overlays into one that handles both readability and the white-to-blue transition

### 2. `src/components/Stats.tsx`
- Replace the default transparent background with a radial gradient: `radial-gradient(circle at center, rgba(40,80,140,0.25), #081624)`
- Add glowing text-shadow to stat numbers: `0 0 15px rgba(100,160,255,0.5), 0 0 30px rgba(100,160,255,0.3)`
- Remove the `glass` class from the card wrapper and replace with a subtler dark glass style to match the new dark context

### 3. `src/index.css`
- Add a `.hero-bottom-fade` utility class for the bottom gradient overlay
- Add `.stat-glow` class for the number glow effect

### Files to modify

| File | Change |
|------|--------|
| `src/components/Hero.tsx` | Multi-stop gradient background, bottom fade overlay div |
| `src/components/Stats.tsx` | Dark radial gradient background, glowing numbers, updated card style |
| `src/index.css` | Add helper classes for hero fade and stat glow |

