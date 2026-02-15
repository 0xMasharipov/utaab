
# Enhanced Background: Dynamic Blue Blobs for Visible Glassmorphism

## Problem
The current background color is near-black (`hsl(0 0% 4%)`) and the animated blobs have very low opacity (0.20-0.30). This makes all glassmorphism effects (glass cards, blurred buttons, frosted borders) nearly invisible -- they blend into the dark void.

## Solution
Two changes that work together:

### 1. Shift base background from pure black to dark navy blue
**File:** `src/index.css`

Change the CSS custom properties:
- `--background`: from `0 0% 4%` (black) to `217 50% 6%` (very dark navy blue)
- `--card`: from `0 0% 7%` to `217 40% 9%` (dark blue-tinted card)
- `--popover`: same shift as card
- `--muted`: from `217 33% 10%` to `217 40% 12%`

This gives a subtle blue undertone to the entire page, making glass reflections and blur visible.

### 2. Increase blob visibility significantly
**File:** `src/components/AnimatedBlobBackground.tsx`

- Blob 1 (large blue): opacity from 0.30 to **0.45**, size from 500px to **600px**
- Blob 2 (purple): opacity from 0.25 to **0.40**, size from 400px to **500px**
- Blob 3 (bright blue): opacity from 0.20 to **0.38**, size from 450px to **550px**
- Blob 4 (deep blue): opacity from 0.20 to **0.35**, size from 300px to **400px**
- Add a 5th blob (cyan accent, opacity 0.30, 350px) for more coverage
- Reduce blur slightly on some blobs (from 100-110px to 80-90px) so they have more visible color presence

The combination of a blue-tinted base background + brighter, larger blobs creates a rich, layered backdrop where glass effects clearly stand out.

## Files Changed

| File | Change |
|------|--------|
| `src/index.css` | Shift background/card/popover/muted to dark navy tones |
| `src/components/AnimatedBlobBackground.tsx` | Increase blob opacity, sizes, add 5th blob |
