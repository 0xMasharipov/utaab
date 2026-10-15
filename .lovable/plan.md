# Footer: bigger white icon, centered low

## Design
- Keep the large white icon-only UTAAB mark as the footer's centered backdrop piece, separate from the small logo and wordmark in the brand column.
- Move it from its current mid-footer position down so it sits centered near the bottom edge of the footer, like a watermark rising from the base of the page.
- Make it a little bigger — roughly a quarter larger on computers (about 320px to about 400px wide) and a similar modest bump on phones (about 280px to about 340px wide).
- Keep the ASCII light directly behind the icon, not behind the top-left wordmark, so the glow continues to read as backlight for the mark.
- Keep the icon's current softness (it stays a faint backdrop, not a bright logo) and keep every link, social button, newsletter control, copyright line and disclaimer fully readable and clickable above it.
- No new effects, no color changes, no layout changes to the footer content.

## Technical details
- `src/index.css`, `.footer-centered-mark`: replace the vertical centering (`top: 48%` with `translate(-50%, -50%)`) with a bottom anchor (`bottom` offset with `translate(-50%, 0)`), and raise `width` from `min(38%, 320px)` to about `min(46%, 400px)`.
- Same file, phone block (`@media (max-width: 767px)`): raise `width` from `min(72%, 280px)` to about `min(86%, 340px)` and apply the same bottom anchor, so the mark stops floating in the middle of the tall stacked mobile footer.
- Same file, `.footer-ascii`: re-anchor the animation to the bottom as well (instead of `top: 50%` centering) and extend its height slightly on phones, so the bright band of characters sits behind the lowered icon rather than above it; adjust the existing fade masks if needed so the band still dissolves into the footer edges.
- Keep the existing semantic tokens (`--footer-mark-opacity`, `--footer-ascii-opacity`, `--footer-ascii-*` palette) as the single source of appearance values; no hardcoded colors in the component.
- `src/components/Footer.tsx` needs no change: the mark stays inside `.footer-brand-backdrop` at `z-index: 0`, below the content layer at `z-index: 10`, and the footer's `overflow-hidden` keeps the larger artwork from causing horizontal scroll.
- Preserve the renderer's existing behavior untouched: near-view lazy loading, off-screen pausing, cleanup, reduced-motion still version, and the static gradient fallback when WebGL is unavailable.

## Verification
- Playwright checks at 1280px and 390px widths: confirm the mark's measured width grew as intended, its horizontal center matches the viewport center, and its bottom sits close to the footer's bottom edge instead of mid-footer.
- Confirm the ASCII band's bright area overlaps the icon's center, and that animation frames still change over time.
- Confirm the copyright line, disclaimer, social buttons and newsletter controls remain visible and clickable, and that the page has no horizontal overflow.
- Re-check the reduced-motion still state and the no-WebGL fallback, plus the preview build log.
- Physical iPhone/Safari behavior remains unverified unless tested on a real device.
