# Desktop CUTII window and full iPhone animation parity

## Goal
Restore CUTII’s desktop-only window mode, keep its phone presentation edge-to-edge, and make iPhone motion match the computer version across the entire website—including the new opening screen.

## Plan

1. **Restore CUTII window mode on computers only**
   - Open CUTII as a centered desktop window at roughly 75% viewport width and 85% height.
   - Add header dragging, edge/corner resizing, minimum dimensions, viewport bounds, and a maximize/restore control.
   - Preserve the current CUTII avatar, Thinking Orbs, messages, Grok behavior, glass styling, keyboard handling, and scroll lock.
   - Keep phones and tablets in the existing full-screen mode; no dragging, resizing, or maximize control appears there.

2. **Fix the new opening animation on iPhone**
   - Move the four-piece logo assembly animation out of the externally loaded SVG and into the React/CSS layer, avoiding iOS Safari’s unreliable animation behavior inside an SVG used as an image.
   - Run the same piece assembly, halo pulse, timing, and fade-out on phone, tablet, and computer.
   - Keep stable full-screen sizing and safe-area behavior through orientation changes.

3. **Make site motion consistent on iPhone**
   - Remove `prefers-reduced-motion` branches that currently substitute posters, skip reveals, stop rotating/orbiting elements, shorten the loader, or disable transitions.
   - Cover the home page, navigation and language transitions, image reveals, carousels, team/about effects, education/CUTII, TonRa, UBpoint, contributor, blog, certificate, privacy, and whitepaper experiences.
   - Remove phone-only motion downgrades while retaining responsive sizing and touch interactions.
   - Per your choice, animations will remain active even when iOS Reduce Motion is enabled.

4. **Verify parity and stability**
   - Compare key routes in iPhone-sized Safari-compatible emulation and desktop Chromium, including the loader, home, team, education/CUTII, TonRa, UBpoint, whitepaper, blog, contributor, and certificate pages.
   - Confirm CUTII is draggable/resizable/maximizable only on desktop and remains full-screen on mobile.
   - Check orientation changes, touch scrolling, focus, no overlapping controls, runtime errors, lint, type checking, and production build.

## Technical details
- Reuse the earlier CUTII desktop window behavior as a reference, but reapply it to the current component so Grok, localization, and Thinking Orbs remain intact.
- Use pointer events rather than mouse-only events for smoother desktop drag/resize handling.
- Replace reduced-motion checks in both React and CSS instead of overriding them globally, preventing hidden initial states or still-image fallbacks from surviving on iOS.
- No backend, course content, email, or AI-provider changes.
