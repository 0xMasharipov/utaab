## Fix admin login logo (`/j3r7x1w9`)

### What's actually wrong
The current image `src/assets/utaab-logo-diamond.png` is already PNG with a transparent background — but it's a **1920×1080 canvas** containing:
- The blue diamond glyph in the left third
- A stray uppercase **"B"** floating on the right side
- A huge empty area in the middle

Because of the wide empty canvas, when the badge renders the image with `object-contain`, the diamond shrinks to a tiny dot in the middle of the rounded badge and the stray "B" is visible. That's the "background" the user wants gone.

### Fix
Generate a clean, **square**, **tightly-cropped**, transparent-background version of just the diamond glyph and use that in the admin login.

### Implementation steps

1. **Crop & re-export the logo**
   - Use Python/Pillow (already available) to:
     - Open `src/assets/utaab-logo-diamond.png`
     - Crop to the diamond's bounding box (roughly the left ~30% of the canvas)
     - Erase any non-diamond pixels (the stray "B") by cropping it out
     - Pad to a square with full transparency
     - Save as `src/assets/utaab-logo-diamond.png` (overwrite)
   - Result: a square, transparent PNG containing only the 4-tile blue diamond.

2. **No code changes needed** in `AdminLogin.tsx` — the existing markup at lines 410–416 already uses `object-contain` inside a square `w-20 h-20` rounded badge, which will now render the diamond at full badge size.

### Files changed
- `src/assets/utaab-logo-diamond.png` (overwritten with cropped square version)

### Risk
Very low — single asset replacement, no code or layout changes. Easy to revert.
