# New UTAAB logo and left-side navigation

## Goal
Replace the site’s visible branding with the supplied UTAAB logo and rebuild the main navigation to match the second reference: a compact logo control at the upper-left, a grid-style Menu control beneath it, and a full-height glass menu that slides in from the left.

## What will change

### 1. Prepare the supplied logo
- Use `UTAA_LOGO_4k_1.png` as the source artwork; the second upload is a layout reference only.
- Trim the large transparent margins and store an optimized horizontal logo through the project’s asset delivery system.
- Derive an icon-only crop from the same supplied artwork for square contexts such as the loader, browser icon, and compact marks.
- Update the favicon and Apple touch icon from that icon crop.

### 2. Replace visible site branding
- Use the new horizontal logo in the main navigation, footer, education navigation, and administration header/sidebar.
- Remove duplicated HTML “UTAAB” lettering where the supplied logo already contains the name.
- Update compact visible marks—the loading screen, admin sign-in, certificate/contributor logo treatments, and other icon-only placements—to use or faithfully retain the icon shape derived from the supplied logo.
- Keep transactional email templates unchanged, as selected.

### 3. Rebuild the main navigation
- Replace the wide centered navbar with a fixed upper-left navigation cluster on desktop and mobile.
- Place the new logo inside a shaped, translucent glass background.
- Add a separate Menu control below it with a subtle grid motif inspired by the second image.
- Keep the logo linked to the home page and preserve every existing destination: Community, Learn, Events, Projects, Resources, Blog, Education, Certificates, About, Team, Contributor Match, Join, student sign-in, language selection, and the existing Education/Join actions.

### 4. Add the animated left drawer
- Open a full-height frosted-glass drawer from the left with a dimmed backdrop and staggered menu-item entrance.
- Close it through the close control, backdrop click, Escape key, route selection, or section selection.
- Prevent background scrolling while open, preserve keyboard focus, and support right-to-left language content without changing the requested left-side opening direction.
- Scale the logo cluster, touch targets, drawer width, and typography for phones while keeping the same design and motion.

### 5. Verify
- Check the home page, secondary pages, education area, admin sign-in/layout, loader, footer, favicon, and menu navigation.
- Test opening, closing, section scrolling, route changes, keyboard controls, and body scroll locking on desktop and iPhone-sized views.
- Confirm the supplied logo remains sharp, uncropped, and readable against every surface, then confirm the preview builds without errors.

## Technical details
- Build the new navbar with the existing React routing, translations, and semantic design tokens.
- Use the existing design-system controls for interactive actions and CSS transforms for performant iOS-compatible drawer motion.
- Keep the uploaded raster out of the source repository by using an asset pointer; only the optimized square favicon remains in `public/` as required by browsers.