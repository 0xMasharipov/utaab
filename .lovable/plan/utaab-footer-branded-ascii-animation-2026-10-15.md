# UTAAB footer — branded ASCII animation

## Visual update
- Integrate the supplied React Bits GradientASCII animation behind the footer’s UTAAB logo and brand area, not over the links or text.
- Use the supplied **horizon** shape: a softly drifting band of blue light with glowing, decoding characters. Adapt its colors to UTAAB’s brand blue, pale blue, white highlights, and dark navy; no purple.
- Keep the logo crisp and unchanged in front. Blend the animation’s edges into the footer so it feels part of the page, without a framed box or harsh color break.
- Replace the existing geometric-image and radial-glow backdrop with this single animated treatment, avoiding competing effects. Preserve the footer’s layout, wording, links, social buttons, privacy control, and newsletter controls.

## Motion and phones
- Include the supplied entrance reveal, light drift, character flicker, and subtle pointer scrambling/waves within the animated area.
- Keep the same visual treatment on phones, with touch reactions that never block scrolling or footer links.
- Limit brightness and animation density so the footer remains readable. Adjust rendering resolution for phones, pause rendering off-screen or in hidden tabs, and provide a subtle static fallback when WebGL is unavailable.
- Respect reduced-motion preferences with a still version of the same composition; normal-motion desktop and iOS browsers use the animated version.

## Technical details
- Add the supplied source as a local, reusable `GradientASCII` component and use a footer-specific wrapper for positioning, palette, and settings. The supplied source uses browser WebGL2 directly; no new rendering dependency is planned.
- Define the footer palette and backdrop styling through global semantic tokens; resolve those colors before passing them to the renderer.
- Load the decorative renderer near the footer, keep it hidden from assistive technology, and keep all existing controls above it and clickable.
- Record the local-renderer and lifecycle convention in `AGENTS.md` during implementation.

## Verification
- Check computer and phone-sized previews for visible animated characters, a clear logo, readable links, no clipping, and no horizontal overflow.
- Compare frames to confirm motion, test pointer/touch reactions and representative footer links, and verify off-screen pause and unsupported-WebGL fallback.
- Capture footer screenshots and check preview errors. Phone-sized browser testing does not establish physical iPhone/Safari compatibility; report that limitation if a real-device test is unavailable.