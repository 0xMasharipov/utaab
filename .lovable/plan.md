

# Fix OG Image & Favicon for WhatsApp Previews

## Problem
1. `og:image` (line 17) and `twitter:image` (line 24) still point to the old Google Storage URL — WhatsApp uses these for the preview image
2. Duplicate meta tags at bottom of `<head>` (lines 64-67) create conflicts
3. The favicon may still be serving the old Lovable logo (WhatsApp uses favicon as the site icon badge)

## Changes

### File: `index.html`
Consolidate and fix all meta tags:
- Update `og:image` and `twitter:image` to `https://utaab.org/og-image.png`
- Move `og:title`, `og:description`, `twitter:title`, `twitter:description` into the main OG block (lines 12-24)
- Remove the duplicate meta tags at lines 64-67
- Ensure favicon references are correct

### File: `public/favicon.png`
Re-copy the UTAAB logo (`src/assets/logo-new.png`) to `public/favicon.png` to ensure it overwrites any cached/old Lovable favicon.

## Important Note
After publishing, WhatsApp caches link previews aggressively. You may need to:
- Wait some time for cache to expire
- Or share a URL with a query param (e.g. `utaab.org/?v=2`) to force a fresh preview

## Files Modified
- `index.html` — fix og:image URLs, remove duplicates
- `public/favicon.png` — ensure UTAAB logo is the favicon

