

# Update OG/Social Metadata & Favicon to UTAAB Logo

## Problem
1. OG meta tags use a generic Google Storage banner URL — need UTAAB branding
2. og:title and og:description are missing (only twitter variants exist at bottom of `<head>`)
3. WhatsApp link preview shows Lovable badge because `favicon.png` is the Lovable logo — WhatsApp uses the favicon as the site icon in link previews

## Changes

### 1. Add UTAAB logo to `public/` for OG image
Copy `src/assets/logo-new.png` to `public/og-image.png` so it's accessible at a static URL for social crawlers (OG images must be absolute public URLs, not Vite-processed assets).

### 2. Update `index.html` meta tags
- **og:image** and **twitter:image**: Point to `/og-image.png` with full absolute URL (`https://utaablockchain.com/og-image.png`)
- **og:title**: "UTAAB — Build Your Future in Blockchain"
- **og:description**: Same as existing meta description
- **twitter:title** and **twitter:description**: Match OG values
- Consolidate the duplicate title/description meta tags (currently split between lines 12-24 and lines 63-68)

### 3. Replace favicon with UTAAB logo
- Overwrite `public/favicon.png` and `public/favicon.ico` with the UTAAB logo (`src/assets/logo-new.png`)
- This fixes the WhatsApp link preview showing Lovable badge — WhatsApp uses the favicon as the site icon
- Add `<link rel="apple-touch-icon">` pointing to the same logo for iOS

### Files Modified
- `public/og-image.png` — new file (copy of logo-new.png)
- `public/favicon.png` — replaced with UTAAB logo
- `index.html` — updated meta tags

