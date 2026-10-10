# UTAAB liquid-morph navigation

## Goal
Replace the current left drawer with a liquid-morph menu inspired by the supplied component, adapted to UTAAB’s navy/blue identity, shaped logo control, grid Menu trigger, translations, and full navigation set.

## Experience
- Keep the supplied UTAAB logo fixed at the upper-left in its close-fitting shaped background.
- Keep the transparent grid-style Menu trigger beneath the logo as the collapsed state.
- On activation, morph the Menu control into a polished dark navy floating panel growing from the upper-left instead of sliding a full-height drawer onto the screen.
- Use UTAAB blue highlights, translucent layered surfaces, and an expanding circular color transition rather than the reference’s yellow and charcoal palette.
- Animate menu labels into view with staggered timing and add the reference’s rolling-letter hover treatment on pointer devices.
- Transform the Menu indicator into a close control while open.

## Navigation content
- Preserve every existing destination and translated label: Community, Learn, Events, Projects, Resources, Blog, Education, Certificates, About, Team, Contributor Match, and Join.
- Preserve Education and Join actions, student sign-in, and language selection inside the expanded panel.
- Organize the larger link set into the existing Ecosystem, Explore, and Organization groups so the morph panel remains scannable.

## Interaction and accessibility
- Close through the transformed Menu control, outside click, Escape, or selecting a destination.
- Retain background scroll locking, focus trapping/restoration, keyboard navigation, route changes, section scrolling, and Arabic right-to-left text support.
- Size the open panel to fit phone screens with internal scrolling and safe-area spacing; use the same motion language on iOS and desktop.
- Keep touch targets stable and ensure the panel never covers essential controls incoherently.

## Technical details
- Create a reusable liquid-morph navigation component under the existing `src/components/ui` convention and compose it from the site Navbar.
- Reuse the installed Framer Motion dependency and existing design-system Button, BrandLogo, language, routing, and translation utilities.
- Convert the reference’s hardcoded colors, fonts, dimensions, and inline visual styling to UTAAB semantic tokens and Montserrat.
- Remove the obsolete full-height drawer presentation styles after the replacement is connected; no new assets or packages are required.

## Verification
- Test open, close, outside click, Escape, focus loop, section links, page links, language selection, sign-in, and body scroll restoration.
- Check desktop and iPhone-sized layouts, including long translated labels and Arabic direction.
- Confirm animation continuity, no overlaps, and a healthy preview without runtime or build errors.
