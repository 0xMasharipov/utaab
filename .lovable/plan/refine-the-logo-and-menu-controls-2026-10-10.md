# Refine the logo and Menu controls

## Goal
Make the upper-left navigation feel integrated with the supplied UTAAB logo rather than placing both controls inside generic glass buttons.

## Changes
- Remove the Menu button’s glass fill, border, shadow, blur, and rounded container while retaining the grid motif, “MENU” label, hover response, keyboard focus, and full touch target.
- Replace the logo’s current rectangular glass button with a close-fitting shaped glass silhouette that follows the horizontal logo’s long profile and angled right edge.
- Keep the logo fully readable with restrained padding and no clipping; the clickable area will remain accessible even though the visible background follows the logo shape.
- Apply the same treatment at desktop and phone sizes without changing the drawer, menu destinations, or opening animation.

## Verification
- Check the closed navigation on desktop and iPhone-sized views for alignment, logo clarity, and clean transparent surroundings.
- Confirm the logo and Menu controls remain easy to click, keyboard-focusable, and that the left drawer still opens and closes correctly.
- Confirm the preview loads without errors.

## Technical details
- Limit the change to the existing navigation styles and use semantic color tokens.
- Use a CSS shape/mask treatment for the logo glass rather than modifying the supplied logo image.
