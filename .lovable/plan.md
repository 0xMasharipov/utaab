

# Refine "Learn More About UTAAB" Button

## Summary
Upgrade the button from a plain outline style to a polished, branded glass button with a subtle glow and arrow animation — matching the hero section's visual language.

## Changes to `src/components/AboutBlurb.tsx`

### Replace the current Button (lines 79-84)
- Swap the generic `<Button variant="outline">` for a custom styled `<Link>` button
- Apply the same glass aesthetic as `hero-btn-outline` but adapted for in-page use:
  - Glass background (`rgba(255,255,255,0.06)`) with `backdrop-blur`
  - Subtle glowing border (`border-white/[0.12]` → on hover `border-accent/40`)
  - Soft box-shadow glow on hover (`0 0 24px rgba(var(--accent), 0.2)`)
  - Rounded-full pill shape for a modern look
  - Larger padding (`px-8 py-3`) and slightly bigger text (`text-[15px]`)
  - Arrow icon slides right on hover with opacity transition
  - `tracking-wide` and `font-semibold` for crispness

### Visual result
- At rest: subtle glass pill with light border, readable text, small arrow
- On hover: border brightens to accent blue, faint glow appears, arrow slides right — inviting click without being loud

## Files Modified
- `src/components/AboutBlurb.tsx` — Button styling upgrade (lines 79-84)

