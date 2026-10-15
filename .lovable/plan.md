# Half-visible footer icon and continuous ASCII motion

## Visual changes
- Place the large white icon at the horizontal center of the footer’s bottom edge, with its upper half visible and its lower half clipped below the footer. Keep its current larger size and faint appearance.
- This bottom-center placement is the default because the annotated screenshot was not attached; no footer content will be rearranged.
- Extend the ASCII backdrop across the footer and upward behind the description beginning “Building the future of blockchain technology,” while keeping it behind the centered icon too.
- Soften the effect beneath text to preserve readability. Keep the small brand logo, wordmark, links, social buttons, newsletter, and copyright unchanged.

## Animation
- Keep the footer ASCII moving continuously while visible on computers and iOS, including when the device reports reduced motion. Use gentle drift and character changes rather than intense flashing.
- Retain off-screen and hidden-tab pausing, with automatic resume when the footer becomes visible again.
- Provide an animated lightweight character fallback when WebGL is unavailable or its context is lost, rather than leaving a static backdrop.
- Keep this motion change scoped to the footer; do not alter other site animations.

## Technical details
- Update `.footer-centered-mark` in `src/index.css` so the icon’s midpoint aligns with the footer bottom, using responsive clipping rather than an offset above the edge.
- Replace the bottom-limited ASCII height and narrow center mask with full-footer coverage and adjusted edge fades. The current phone rule limits the backdrop to 560px; remove that restriction so it reaches the description in the stacked layout.
- Add a footer-specific continuous-motion option to the local `gradient-ascii` renderer. Its current reduced-motion branch stops time and flicker updates; retain that default for other callers while opting the footer into continuous gentle motion.
- Add the lightweight animated ASCII fallback through `FooterASCII`, with matching palette, visibility handling, cleanup, and recovery when WebGL returns.
- Use the existing semantic footer palette and opacity tokens. During implementation, update the footer preference and architecture documentation to reflect this request.

## Verification
- Check desktop, the current 966px-wide layout, and a phone-sized layout: horizontally centered icon, approximately half visible, ASCII behind the description and lower icon, no horizontal overflow.
- Compare successive rendered frames with normal and reduced-motion settings to confirm visible animation, including the unsupported-WebGL fallback.
- Check scrolling away and back, context recovery, text readability, and footer link/control interaction; check the preview error log.
- Browser checks cannot establish physical iPhone/Safari behavior; report real-device testing as unverified unless a physical device is available.