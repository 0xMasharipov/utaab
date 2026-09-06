# Make the phone versions match the computer look

Three sections currently have a separate, simpler phone treatment. The goal is the same aesthetic, compact composition as the computer, scaled to phone width.

## What We Build

Today the phone shows four full-height stacked cards, all open at once — tall and repetitive. The computer shows four slim panels where the one you point at opens wide.

Change the phone version to the same panel behaviour, turned vertical:
- Four slim bars stacked, each showing only its number and title.
- Tapping a bar opens it with the same artwork placement, grid texture, blue accent wash, hairline divider, title and description as the computer panel; the previously open one closes.
- The first one is open by default, so the section always shows one full panel.
- Same spring motion, same glass borders and glow as the computer.

Result: one screen-friendly block instead of four tall cards, visually identical in detail to the desktop panels.

## Community Projects and Past Events

Both use the same poster slider. On the phone the centre poster is too narrow and the neighbours sit off-screen, so it reads as a plain one-card slider.

- Widen the phone poster and tighten the spacing so the two tilted neighbours peek in on either side, exactly like the computer composition.
- Keep the tilt, depth, scale, coloured glow behind the posters and the dots identical to the computer values.
- Let the tilted neighbours bleed to the section edges so nothing looks cut in half.

## Project card details

The Community Projects cards also carry phone-only variations that the computer version doesn't have: a faded mask over the artwork and tag rows drawn as a tinted strip with dot separators instead of pills. These get replaced by the computer treatment (pill tags, clean artwork) so both views match.

## Technical detail

- `src/components/AboutBlurb.tsx`: replace the `md:hidden` stacked block with a vertical accordion driven by the existing `activeIndex` state and `spring` config; animate `flexGrow`/height on a fixed-height column, reusing `GRID_LAYER`, `OVERLAY`, `NUMERAL` and the same `AnimatedImage` layer as the desktop branch. Collapsed bars keep the numeral plus a horizontal hairline.
- `src/components/carousel/CoverflowCarousel.tsx` (lines 150–158): mobile branch becomes roughly `clamp(w * 0.66, 220, 320)` with `effectiveGap` around `cardGap * 0.35`, so `step` places neighbours partly on-screen.
- `src/components/Projects.tsx` (lines ~154–260): drop the `sm:`-reset mobile-only mask and tag-strip branches, keeping the desktop classes at all widths.
- Respect `prefers-reduced-motion` throughout; animate transform and opacity only.
- Verify with Playwright at 390x844 and 1280x900 on `/` (`#about`, `#projects`, `#events`), then run the type check and production build.

No content, data or backend changes.
