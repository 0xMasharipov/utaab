

# Refine Hero Section Aesthetics

## What stays unchanged
- Background video and white gradient overlay — no changes
- Layout structure, text content, pill tags — no changes
- Video already has autoPlay, muted, loop, playsInline — confirmed working

## Changes

### 1. Fix "Next Generation" gradient text colors
Replace the current `#4A90E2 → #6C63FF` (blue-to-purple) gradient with UTAAB on-brand colors only:
- Use `linear-gradient(135deg, #0B3C6D, #4A90E2)` — deep UTAAB blue to gradient blue
- This keeps it within the established palette, no purple accent

### 2. Refine buttons to glassmorphism style
Replace solid gradient and outline buttons with frosted glass aesthetic:

**"Join Us" button:**
- Background: `rgba(11, 60, 109, 0.75)` (UTAAB primary blue, semi-transparent)
- `backdrop-filter: blur(12px)`
- Border: `1px solid rgba(255,255,255,0.2)`
- White text, rounded-full
- Hover: increase opacity to 0.9, subtle scale 1.05, glow shadow

**"Explore Ecosystem" button:**
- Background: `rgba(255, 255, 255, 0.15)`
- `backdrop-filter: blur(12px)`
- Border: `1px solid rgba(11, 60, 109, 0.3)`
- Text color: `#0B3C6D`
- Hover: background `rgba(11, 60, 109, 0.12)`, border brightens

### 3. Refine pill tags
- Add `backdrop-filter: blur(8px)` for subtle glass effect
- Slightly increase background opacity: `rgba(11,60,109,0.1)`
- Add thin border: `1px solid rgba(11,60,109,0.12)`

## File to modify

| File | Change |
|------|--------|
| `src/components/Hero.tsx` | Update gradient text colors, restyle buttons as glass, refine pills |

