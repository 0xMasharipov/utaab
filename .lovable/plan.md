## TonRa: SEO + mobile polish + token alignment

Single-file refactor of `src/pages/projects/TonRaPage.tsx`. No new components, no i18n changes, no asset additions beyond reusing the existing `/og-image.png`.

### 1. SEO + social preview metadata

Replace the inline `useEffect(document.title = ...)` with the existing `<SEO>` component (same pattern About uses, via `react-helmet-async` already wired in `main.tsx`).

```tsx
<SEO
  title="TonRa — Telegram Security Bot for TON | UTAAB"
  description="TonRa is UTAAB's beta Telegram security bot for the TON ecosystem — verify wallets, tokens, projects and airdrops before you interact."
  path="/projects/tonra"
  ogType="website"
  image="https://utaab.org/og-image.png"
  jsonLd={{
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "TonRa",
    applicationCategory: "SecurityApplication",
    operatingSystem: "Telegram",
    url: "https://utaab.org/projects/tonra",
    publisher: { "@type": "Organization", name: "UTAAB", url: "https://utaab.org" }
  }}
/>
```

- Drops the `useEffect` title swap (SEO component owns title + canonical + og:* + twitter:* + JSON-LD).
- Reuses the existing project-wide social card at `public/og-image.png` — no new asset, no AI-feel TonRa-specific banner.
- Canonical `https://utaab.org/projects/tonra` matches the route already mounted in `App.tsx`.

### 2. Mobile reflow — capabilities list + pull-quote

Current problems on ≤640 px:
- Capabilities numerals (`w-12` rail + `gap-6`) eat ~30% of width, squeezing titles/descriptions into 2-line ladders.
- Pull-quote `text-3xl font-light leading-snug` wraps awkwardly with the centered hairline rule and the giant `“` glyph stacked above.
- Section padding (`py-24 md:py-32`) is too tall on phones — leaves big empty gaps between blocks.

Fixes:
- **Capabilities rows**: shrink numeral rail on mobile (`w-8 text-3xl`) and bump on desktop (`md:w-12 md:text-4xl`); reduce gap (`gap-4 md:gap-6`); tighten vertical padding (`py-5 md:py-7`). Wrap text in `min-w-0` so long titles don't blow out the row.
- **Pull-quote**: scale quote glyph (`text-6xl md:text-8xl`) and body (`text-xl md:text-3xl`); reduce attribution rule width on mobile (`w-6 md:w-8`); section padding `py-16 md:py-32`.
- **All sections**: standardize to `py-16 md:py-24` (was `py-20 md:py-28`/`py-24 md:py-32` mixed). One rhythm across the page.

### 3. Typography + spacing tokens aligned with other pages

Audit reference: `UBpointPage.tsx`, `About.tsx`. Standardize TonRa to match.

- **Headings**: section titles → `text-3xl sm:text-4xl md:text-5xl font-bold leading-tight` (currently `text-3xl sm:text-4xl font-extrabold` — too small, too heavy vs. siblings). Hero H1 stays `text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight`.
- **Eyebrows**: keep uppercase tracking pattern but normalize to `text-xs uppercase tracking-[0.2em] text-muted-foreground` (currently a mix of `0.18em` / `0.22em`).
- **Body**: paragraphs → `text-base sm:text-lg text-muted-foreground leading-relaxed` (matches TonRa "What is" intro paragraph used by other project pages).
- **Dividers**: keep `border-t border-white/[0.06]` between sections; add the same hairline above the Footer so the page closes cleanly like UBpoint.
- **Container**: every section uses `section-container` (already true) with consistent inner `max-w-*` only on text-heavy blocks (quote `max-w-3xl`, CTA `max-w-2xl`).

### Out of scope
- No new og-image generation (reuses brand `/og-image.png`).
- No translation copy changes.
- No `<Navbar>`, `<Footer>`, `BackgroundGrid`, or shared component edits.
- No backend / sitemap edits (route already in `sitemap.xml` or can be added later in a separate pass if missing).
