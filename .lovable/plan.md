# Goal

Strengthen structured data for Q&A content, ship a complete `sitemap.xml`, and confirm `robots.txt` is correctly indexable.

## Current state (already in place)

- `src/pages/FAQ.tsx` — already emits `FAQPage` JSON-LD with all 10 Q&As ✅
- `public/sitemap.xml` — already lists `/`, `/about`, `/team`, `/faq`, `/blog`, `/learn*`, `/projects/tonra`, `/projects/ubpoint`, `/education*`, plus legal pages ✅
- `public/robots.txt` — already `Allow: /` for all major bots + `Sitemap: https://utaab.org/sitemap.xml` ✅

What's missing: **dynamic `/blog/:slug` URLs are not in the sitemap**, and the TonRa / UBpoint project pages don't expose their built-in Q-style content as `FAQPage` schema even though both have question-shaped sections in their i18n copy.

## Plan

### 1. FAQPage structured data — extend beyond `/faq`
- **`/faq`** — no change; already correct.
- **`/projects/tonra`** — add a small `FAQPage` JSON-LD block with 4–5 user-intent questions pulled from the page's existing copy (e.g. *"What is TonRa?"*, *"Is TonRa free?"*, *"Does TonRa store my wallet keys?"*, *"How do I verify a TON token?"*, *"What chains does TonRa support?"*). Stacked alongside the existing `SoftwareApplication` schema via the `jsonLd` array of `<SEO>`.
- **`/projects/ubpoint`** — same treatment: 4–5 questions (e.g. *"What is UBpoint?"*, *"How do I earn UBP?"*, *"Is UBP a cryptocurrency?"*, *"What can I do with UBP?"*). Stacked alongside the `Product` schema.
- **`/about`** — add 3 short "about UTAAB" questions as a secondary `FAQPage` block (*"What is UTAAB?"*, *"Who runs UTAAB?"*, *"Is UTAAB free to join?"*) — these are the exact phrasings users type into Google and ChatGPT.

No visible UI changes; this is metadata only.

### 2. Sitemap — make it complete (including dynamic blog posts)

The current `public/sitemap.xml` is a hand-edited static file. To include every published blog post (currently `/blog/:slug` URLs are missing), we'll migrate to a **build-time generator script**:

- Create `scripts/generate-sitemap.ts` that:
  - Outputs all 19 static routes already in the current sitemap (verbatim, same priorities/changefreq).
  - Connects to Lovable Cloud (Supabase) with the public anon key and pulls all `blog_posts` rows where `status = 'published'`, appending each as `/blog/<slug>` with `lastmod = updated_at` and `changefreq = monthly`.
  - Writes `public/sitemap.xml`.
- Add `predev` and `prebuild` npm scripts to `package.json` so it runs automatically before dev and production builds:
  - `"predev": "bunx tsx scripts/generate-sitemap.ts"`
  - `"prebuild": "bunx tsx scripts/generate-sitemap.ts"`
- The generated file keeps `BASE_URL = "https://utaab.org"`.

If the DB fetch fails at build time (network/auth), the script falls back to writing the static route list only, so a flaky build never produces an empty sitemap.

### 3. Robots.txt — verify and leave as is
- `public/robots.txt` already allows Googlebot, Bingbot, Twitterbot, facebookexternalhit, and `*`, and points to `https://utaab.org/sitemap.xml`. **No change needed.**

## Out of scope (not requested)

- Per-language `hreflang` tags (the site is i18n but pages share one URL).
- Generating Open Graph images per blog post.
- Adding `BreadcrumbList` schema (could be a follow-up).

## One question before I implement

Migrating the sitemap from a hand-edited file to an auto-generator is the only way to keep `/blog/:slug` URLs in sync. **OK to do that?** If you'd rather keep the file hand-edited, I'll just add the currently-published blog slugs once and you'll need to ping me whenever you publish a new post.
