# Match the UBpoint phone page to the computer version

## Goal
Make `/projects/ubpoint` retain the same polished composition on phones as on computers, using the selected **scaled two-column** layout rather than the current stacked phone treatment.

## What I confirmed
- The scrolling story currently changes from a left-phone/right-copy composition on computers to a vertically stacked, centered composition on phones.
- The phone view hides the computer's vertical progress rail and places the dot controls at the bottom.
- The download area currently stacks the Web App, iOS, and Android panels into three tall cards, while the computer uses one wide Web App panel beside two compact platform panels.
- The page already uses the same images, copy, and scroll-driven stage changes at both sizes; the work is visual parity, not new content or backend work.

## Changes
1. **Scaled two-column story on phones**
   - Keep the mockup on the left and the active heading, body, and action on the right at every screen size.
   - Scale the mockup, type, spacing, and action button specifically for narrow widths so the composition fits without clipping or horizontal scrolling.
   - Preserve the same tilt, image crossfade, text blur/fade, oversized stage numeral, and scroll-driven four-stage sequence used on computers.

2. **Computer-style progress treatment**
   - Show the slim vertical progress rail on phones instead of replacing it with a phone-only bottom treatment.
   - Keep the stage indicators usable and avoid collisions with the text and mockup.

3. **Compact download composition**
   - Recreate the computer arrangement on phones: a dominant Web App panel with compact iOS and Android panels beside it in a constrained grid.
   - Scale icons and copy while retaining the same hierarchy, blue treatment, borders, and card proportions.

4. **Navigation and footer parity**
   - Keep the phone menu because the full computer navigation cannot fit at 390px, but preserve the same branding and visual quality.
   - Tighten the footer into a compact version of the computer columns without removing links or information.

5. **Accessibility and quality checks**
   - Continue respecting the visitor's reduced-motion setting.
   - Verify at 390×844 and 1280×1800 that all four story stages animate, text remains readable, actions remain tappable, and there is no horizontal overflow or overlap.
   - Run the TypeScript check and production build.

## Technical details
- Update the responsive grid, sizing, alignment, and progress placement in `src/pages/projects/UBpointPage.tsx`; reuse the existing `StoryPhone`, `StageContent`, `StoryProgress`, and `AnimatedStory` paths rather than adding a separate mobile implementation.
- Rework `AvailabilitySection` with narrow-screen grid tracks that preserve the desktop card relationship at a smaller scale.
- No translation, content, route, database, or certificate changes.
