# Goal

Improve discoverability of **About**, **FAQ**, **Blog**, **Blog posts**, and **Projects** pages so that when users type related keywords or full questions, **utaab.org** appears in Google, Bing, and AI search engines (ChatGPT, Perplexity, Gemini).

This is a frontend/metadata-only change. No business logic, no backend.

---

## What's already in place

- `index.html` sitewide title, description, OG/Twitter, Organization + WebSite JSON-LD ✅
- `public/sitemap.xml` lists all key routes ✅
- `public/robots.txt` allows crawlers + points to sitemap ✅
- `<SEO>` component (react-helmet-async) used on: About, FAQ, BlogPost, TonRa, Team, BlockchainAndMoney ✅

## What's missing or weak

1. **Blog index** (`/blog`) — uses `document.title` only, no `<SEO>` tag, no canonical, no OG, no JSON-LD `Blog` schema.
2. **UBpoint project page** (`/projects/ubpoint`) — no `<SEO>` tag at all.
3. **About** — has `<SEO>` but no JSON-LD `AboutPage` / `Organization` schema, weak keyword targeting in title/description.
4. **FAQ** — has FAQPage JSON-LD ✅ but the `<SEO>` description is generic and doesn't include long-tail keywords ("what is UTAAB", "is UTAAB free", etc.).
5. **BlogPost** — has `<SEO>` but does not pass `Article` JSON-LD (headline, author, datePublished, image) which is what Google needs for rich results and AI answer engines.
6. **TonRa / UBpoint** — descriptions could include question-style phrases users actually type.

---

## Plan (file-by-file)

### 1. `src/pages/Blog.tsx`
- Add `<SEO>` with:
  - title: `UTAAB Blog — Web3, Blockchain & Student Innovation Insights`
  - description: keyword-rich (~155 chars) covering "blockchain blog", "Web3 articles", "student crypto community updates".
  - path: `/blog`
  - JSON-LD: `Blog` schema linked to Organization UTAAB.
- Remove the `useEffect` that sets `document.title` (Helmet handles it).

### 2. `src/pages/BlogPost.tsx`
- Extend the existing `<SEO>` call to also pass `jsonLd` with an `Article` schema:
  - `headline`, `description`, `image` (cover_image), `datePublished`, `dateModified`, `author` (UTAAB), `publisher` (Organization), `mainEntityOfPage` canonical URL.
- Ensure title/description fall back to localized title/excerpt.

### 3. `src/pages/projects/UBpointPage.tsx`
- Add `<SEO>` mirroring the TonRa pattern:
  - title: `UBpoint — Community Rewards Token by UTAAB`
  - description targeting "blockchain rewards", "community engagement token", "Web3 student project".
  - JSON-LD: `SoftwareApplication` / `Product` with publisher = UTAAB.

### 4. `src/pages/About.tsx`
- Strengthen title and description with high-intent phrases ("what is UTAAB", "student blockchain community", "Web3 education Turkey/global").
- Add JSON-LD: `AboutPage` referencing the UTAAB `Organization` (founder, foundingDate if known, sameAs social links — pull from existing footer config).

### 5. `src/pages/FAQ.tsx`
- Keep existing `FAQPage` JSON-LD (it is the key win for "people also ask" / AI snippets).
- Improve `<SEO>` description with long-tail phrases like "UTAAB blockchain community FAQ — how to join, is it free, certificates, wallets".

### 6. `src/pages/projects/TonRaPage.tsx`
- Minor: enrich description with question-style phrases ("Is this TON wallet safe?", "verify TON token before airdrop") to win long-tail/AI queries. Same JSON-LD.

### 7. `public/sitemap.xml`
- Already lists all target routes. Verify `priority`/`changefreq` are reasonable; no structural change.
- (Optional) After build, dynamic blog post URLs are NOT in sitemap. Add a TODO comment noting that a generator script could append `/blog/<slug>` entries from Supabase — but do not implement unless you approve, since this introduces a build-time DB fetch.

### 8. `public/robots.txt`
- No change needed; already permissive + sitemap reference.

---

## Out of scope (ask before doing)

- Adding a build-time sitemap generator that pulls blog slugs from the database.
- Generating per-page Open Graph images for blog posts / projects.
- Translating meta tags per language (currently English only; multilingual hreflang would be a separate, larger task).
- Server-side rendering (needed for perfect LinkedIn/Slack previews on dynamic blog posts — current Helmet approach works for Google but not non-JS crawlers).

---

## Expected impact

- Google can index per-page titles, descriptions, and structured data → richer SERP results (FAQ accordions, article cards).
- AI engines (ChatGPT, Perplexity) consume JSON-LD + clean meta → higher chance of citing utaab.org when users ask "what is UTAAB", "UTAAB blockchain community", "TonRa bot", etc.
- No visual/UX change for end users.

Shall I proceed with these edits?
