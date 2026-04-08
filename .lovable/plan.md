

# Fix Bottom Gradient Overlay Z-Index

## Problem
The `BottomGradientOverlay` is currently at `z-index: 40`, placing it **on top of** text and content sections. It should sit **behind** content so text and UI elements remain fully visible and unobstructed.

## Change

### File: `src/components/BottomGradientOverlay.tsx`
- Change `z-40` to `z-0` so the gradient renders behind all content
- This keeps the atmospheric depth effect visible in gaps between content but never obscures text or interactive elements

