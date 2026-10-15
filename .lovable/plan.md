# Restore the centered footer logo

## Design
- Restore a large, white, icon-only UTAAB logo at the center of the footer backdrop, as selected—not a replacement for the smaller logo and wordmark.
- Position the animated ASCII light behind that centered icon, removing its current top-left placement behind the brand column.
- Keep the white icon recognizable with restrained opacity and a clear silhouette. Fade the decorative layer around text so navigation, social links, newsletter controls and copyright remain readable and clickable.
- Preserve the existing small logo and wordmark, footer content, translations and destinations. Use UTAAB navy, blue and white without introducing new decorative effects.
- Maintain the same centered composition on phones with appropriately sized artwork and no horizontal overflow.

## Technical details
- Update `Footer.tsx` to add a dedicated decorative backdrop containing the existing white UTAAB mark and `FooterASCII`, beneath the footer content.
- Replace the left-offset `.footer-ascii` positioning in `src/index.css` with centered, responsive sizing relative to the backdrop; define any new appearance values as semantic tokens.
- Preserve the local renderer's near-view loading, off-screen pausing, resource cleanup, reduced-motion behavior and static fallback.

## Verification
- Capture desktop and phone-sized footer screenshots to confirm the white icon is centered and the ASCII animation sits behind it rather than behind the top-left wordmark.
- Check animation frame changes, text readability, link interaction, newsletter control visibility and absence of horizontal overflow.
- Check reduced-motion and unavailable-WebGL fallbacks, plus preview errors. Physical iPhone/Safari behavior remains unverified unless tested on an actual device.