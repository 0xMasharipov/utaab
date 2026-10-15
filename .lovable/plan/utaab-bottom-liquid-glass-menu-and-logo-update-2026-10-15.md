# UTAAB bottom liquid-glass menu and logo update

## Branding and scope
- Remove the entire public-site top navigation, including its logo, background, language control and menu text. Nothing remains fixed at the top.
- Use the first uploaded image as the complete icon-and-wordmark lockup in the footer’s top-left brand area and inside the expanded bottom menu. Remove the separate text wordmark there to avoid duplicating “UTAAB.” Clean away the black background and excess empty space while preserving the supplied white artwork and proportions.
- Remove the black background from the second uploaded image, including inside its hollow diamonds, and use that transparent outline mark instead of the visible “Menu” label on the bottom trigger. Retain an accessible menu name and a clear close control.
- Leave the large half-visible bottom-center footer icon, ASCII animation, footer text, links and other controls unchanged.
- Apply this replacement wherever the shared public-site Navbar is used; leave education and administrator navigation unchanged.
- Update the favicon from the supplied primary brand icon in the same change.

## Bottom menu appearance
- Adapt the supplied liquid-morph floating-menu source: a compact bottom-center trigger expands upward into the navigation panel, with a smooth shape transition and staggered link entrances.
- Replace the sample yellow/cream palette and sample fonts with UTAAB’s navy, white and blue semantic colors and Montserrat typography.
- Use a safe liquid-glass treatment: a translucent navy surface, restrained blue accents, a fine highlight border and supported backdrop blur. Provide a readable solid/translucent fallback when blur is unavailable; do not rely on experimental refraction or distortion filters.
- Keep the expanded panel compact but large enough for all destinations, using grouped links and internal scrolling when needed rather than squeezing them into the sample’s three-item dimensions.
- Keep the trigger centered above the device’s bottom safe area and prevent clipping on narrow screens. Give the expanded menu a clear logo header and accessible close control.

## Visibility and interaction
- Show the collapsed menu on initial page entry and at the top of the page.
- Hide it when the user scrolls down; reveal it when they scroll up. Use a small movement threshold so tiny scroll changes do not cause flickering.
- Hide and close the menu whenever the footer enters the viewport, regardless of scroll direction. Once the footer leaves the viewport, resume the normal direction-based behavior.
- Keep the menu visible while users interact with its open panel; scrolling inside the panel must not trigger page-scroll hiding. Footer visibility remains the overriding rule.
- Close after choosing a destination, on outside interaction or Escape, and return focus appropriately. Hidden links must not remain keyboard-focusable.
- Preserve existing section links, page links, education access, student sign-in, community joining, four-language selection and right-to-left support. Add home access inside the menu to replace the removed top logo’s home action.
- Preserve direct navigation to the main-page join form and section navigation from other pages; remove obsolete top-navbar scroll offsets from the paths affected by this replacement.

## Technical details
- Introduce a reusable local floating-menu component based on the supplied source and adapt the existing public Navbar entry point to render it, avoiding duplicate menus across page wrappers.
- Use the existing animation and Button components, semantic style tokens, cleaned transparent image assets and the project asset storage flow.
- Use passive, frame-batched scroll-direction tracking and a footer visibility observer, with listener cleanup and state reset on page changes.
- Keep morphing and reveal motion consistent across desktop and phone browsers, with reduced-motion simplification and no dependence on pointer-only interaction.
- Record the shared public-navigation convention in AGENTS.md and the approved branding/visibility preferences in project memory during implementation.

## Verification
- Check desktop and phone-sized previews: no top navigation, correct supplied logo, transparent diamond trigger, readable glass surface and no overflow.
- Exercise opening, closing, keyboard access, outside dismissal, scrolling down/up, footer entry/exit, route changes, language switching and representative section/page links, including Join.
- Confirm internal menu scrolling does not hide the panel and that the existing footer icon and ASCII motion remain unchanged.
- Capture screenshots of collapsed, expanded and footer-hidden states; check preview errors and blur fallback. Browser emulation does not establish physical iPhone/Safari compatibility, so report that limitation if real-device testing is unavailable.