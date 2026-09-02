# Match the mobile carousels to the desktop look

## What I verified

Both "Community Projects" and "Past Events" already use the same carousel component, so the difference is sizing, not missing features. Checked side by side in a real browser:

- Desktop (1280px): three posters visible — the centre card straight on, the neighbours tilted and pushed back in 3D, coloured glow behind them.
- Mobile (390px): only one card is visible. The card is 300px wide inside a 366px viewport, and the spacing between cards is 28px, so the neighbouring cards land completely outside the visible area and get clipped away.
- Swiping does work on mobile (a swipe moves from slide 1 to slide 2 on both events and projects), and the coloured backdrop glow is being computed on mobile too — it's just not visible because the side cards aren't.

So "not working" on mobile is really "looks like a plain one-card slider instead of the 3D coverflow".

## The fix

Change the responsive sizing inside the shared carousel so small screens get the same coverflow composition as desktop:

1. Card width on small screens becomes a proportion of the viewport (about 62%, clamped to a sensible min/max) instead of "viewport minus 64px". That leaves room on both sides for the neighbouring posters to peek in.
2. Card gap scales with card width on small screens so the neighbours sit just outside the centre card rather than off-screen.
3. Keep rotation, depth, scale, gradient glow and the dot indicators exactly as they are — same parameters as desktop, so the two views match visually.
4. Give the carousel a little more horizontal breathing room on mobile (allow the tilted neighbours to bleed to the section edges) so nothing looks cut in half.

Applies automatically to both sections, since Community Projects and Past Events share the component. The reduced-motion fallback (simple swipe strip for users who ask for less animation) stays unchanged.

## Technical detail

- `src/components/carousel/CoverflowCarousel.tsx`: in the `useLayoutEffect` measuring block, replace `w < 640 ? Math.min(w - 64, 300) : clamp(w * 0.32, 280, 380)` with a mobile branch of roughly `clamp(w * 0.62, 200, 300)`, and derive an effective gap (`cardGap` scaled down, e.g. `Math.round(cardGap * 0.5)` under 640px) used by `step`, `applyTransforms` and the drag math.
- Verify with Playwright at 390x844 and 1280x900 that both `#projects` and `#events` show the centre card plus two tilted neighbours, and that swipe still advances the active dot.

No content, data or backend changes.
