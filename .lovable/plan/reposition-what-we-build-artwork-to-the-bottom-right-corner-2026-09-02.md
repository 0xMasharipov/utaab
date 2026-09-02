# Reposition "What We Build" artwork to the bottom-right corner

Move the 3D artwork inside each "What We Build" card so it sits in the bottom-right corner, is fully visible, and stops being cropped. Apply the change to the desktop accordion, tablet accordion, and mobile stack.

## What will change

- In `src/components/AboutBlurb.tsx`, update the artwork positioning for every card state:
  - **Desktop active panel:** anchor the image to the bottom-right of the panel, scale it to fit without cropping, and keep it above the text gradient.
  - **Desktop collapsed rails:** show a smaller version of the same artwork anchored to the bottom-right rail instead of the current centered/cropped placement.
  - **Mobile stack:** move the card artwork from the current right-side inset to the bottom-right corner, sized so the full image is visible.
- Keep using `AnimatedImage` with `loading="lazy"` and `object-contain`; add `object-right-bottom` so the image aligns to the bottom-right within its container.
- Replace the current absolute `inset-*` tricks with explicit `right`, `bottom`, `width`, and `height` values to prevent cropping.
- Preserve the existing shimmer/fade loading behavior, glass border, grid layer, and blue glow on the active panel.
- No translation key changes and no new dependencies.

## Verification

- Run typecheck (`npx tsgo --noEmit -p tsconfig.app.json`).
- Take Playwright screenshots of the `#about` section at desktop (1280px) and mobile (390px) to confirm the artwork sits cleanly in the bottom-right corner of each card and no artwork is clipped.
