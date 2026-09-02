# Modernize the "What We Build" section

Replace the four static glass cards (Education, Real Projects, Ecosystem, Support) with an interactive expanding accordion inspired by the reference site, adapted to the UTAAB Web3 blue/navy identity.

## What it looks like

```text
 ┌───────────────────────────┬────┬────┬────┐
 │ 01                        │ 02 │ 03 │ 04 │
 │                           │    │    │    │
 │        [3D artwork]       │ 3D │ 3D │ 3D │
 │                           │    │    │    │
 │  Education                │    │    │    │
 │  Workshops, mentorship... │ ◇  │ ◇  │ ◇  │
 └───────────────────────────┴────┴────┴────┘
        active panel            collapsed rails
```

- Four panels in one row. One is active and wide; the rest collapse into tall narrow rails.
- Hover (desktop) or tap (touch) expands a panel; the previously active one collapses. Width animates smoothly, text cross-fades in.
- Collapsed rail shows only the index number `01`–`04`, a vertical hairline, and a small icon at the bottom.
- Active panel shows the existing 3D artwork large and centred, a dark bottom gradient, the title, description, and a subtle accent underline.
- Each panel keeps the technical grid layer and glass border already used across the site; the active one gets a soft blue glow and slight lift.
- Numbers use the existing `NUMERAL` editorial token; colors stay on semantic tokens (no new palette, no purple).

## Responsive

- Desktop (`lg+`): the four-panel accordion described above, fixed height ~420px.
- Tablet (`md`): accordion with two rows of two, same interaction.
- Mobile: accordion collapses to a vertical stack — each card full width, artwork on the right, all text visible (no hidden content on touch), preserving today's readability.
- `prefers-reduced-motion`: no width animation, panels render as the current static grid.

## Section header and CTA

Header copy, the official-community link, and the "Learn More About UTAAB" button stay exactly as they are, only re-spaced to sit with the new block.

## Technical notes

- Edit `src/components/AboutBlurb.tsx` only; no new dependencies.
- New local state `activeIndex` (default 0) driving `flex-grow` values, animated with `framer-motion` (`layout` transition, spring) already used in the file.
- Keep `AnimatedImage` for the artwork so the existing shimmer/fade loading behaviour is preserved; keep `loading="lazy"`.
- Keep `GlassCard` as the panel shell; add `aria-expanded`, keyboard focus/arrow-key support, and `role="button"` per panel so the accordion is accessible.
- No translation-key changes — the same `about.cards.*` keys are reused.
- Verify with a Playwright screenshot at desktop and mobile widths after implementing.
