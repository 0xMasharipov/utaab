## Plan: Add UTAA image to "Official University Community" section on About page

**Target:** `src/pages/About.tsx` — the `GlassCard` block for `aboutPage.officialCommunity.*`.

**Steps:**

1. Upload `user-uploads://UTAA.avif` to Lovable CDN via `lovable-assets create`, write pointer to `src/assets/utaa-community.avif.asset.json`.

2. Refactor the Official Community `GlassCard` from centered single-column to a 2-column editorial layout on `md+` (image left, text right), stacking on mobile:
   - Left: `AnimatedImage` with the UTAA cover, rounded, soft border, subtle drop shadow, aspect-[4/3], `object-cover`.
   - Right: keep the existing h2, body, and outbound link (`aboutPage.officialCommunity.*`), left-aligned on `md+`, centered on mobile.
   - Keep the `border-t-2 border-t-accent/30` accent and Glass styling consistent with neighboring cards.

3. Add a faint blue grid + gradient overlay behind the image (matching the AboutBlurb card treatment) so it harmonizes with the rest of the page — no new tokens, all existing classes.

**Out of scope:** No copy changes, no i18n keys, no other sections, no token file changes, no admin changes.
