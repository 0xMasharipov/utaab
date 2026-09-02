# New social preview image + cleaner "What We Build" cards

Two changes: use the uploaded UTAAB banner as the site's social/link preview image, and simplify the "What We Build" cards.

## 1. Social preview (og:image)

- Save the uploaded banner into the site as `public/utaab-og-banner.png` (renamed from the ChatGPT export filename), sized/kept at 1200x630-friendly proportions.
- Point the sitewide tags in `index.html` at the absolute URL `https://utaab.org/utaab-og-banner.png` for both `og:image` and `twitter:image`, replacing the current external `storage.googleapis.com` URL.
- Add `og:image:width`, `og:image:height`, and `og:image:alt` so previews render at full size with a description.
- Leave per-route SEO (`src/components/SEO.tsx`) as-is; it already falls back to the sitewide image when a page has none.

Note: Slack, X, LinkedIn and WhatsApp cache previews. The new banner shows up on already-shared links only after they re-scrape; a link-preview debugger can force it.

## 2. "What We Build" section

- Remove the small square icon badge from every card — desktop active panel, collapsed rails, and the mobile stack. The `lucide-react` icons and the `Icon` field on the card data are dropped.
- With the icon gone, give the text block more room so the left side no longer reads as empty:
  - Active desktop panel: title steps up in size, description widens (currently capped at a narrow column) and sits with more comfortable line spacing, filling the open left area.
  - The index numeral `01`-`04` stays as the visual marker in place of the icon.
  - Collapsed rails keep only the numeral and hairline.
  - Mobile cards: numeral moves inline above the title, description width increased.
- Artwork placement, glass border, grid layer, gradients and animations stay exactly as they are.

## Technical notes

- Files: `index.html`, `src/components/AboutBlurb.tsx`, plus the new `public/utaab-og-banner.png`.
- No translation-key changes, no new dependencies.
- Verify with `tsgo --noEmit` and Playwright screenshots of `#about` at 1280px and 390px.
