

## UTAAB Content & Routing Overhaul — Phased Plan

You asked for a complete content + routing rebuild. That's a multi-day scope, so I'm structuring it in **3 sequential phases** you can approve one at a time. We start with what's broken (routing + dead links), then fill content, then add the deeper pages.

---

### Current state (verified from the codebase)

- **Navbar dropdown** items work — they scroll to homepage sections (`#community`, `#learn`, `#events`, `#projects`, `#resources`) or navigate to `/blog`, `/team`, `/about`, `/education`, `/contributor-match`.
- **`/learn/guides`** already exists with a Beginner / Intermediate / Advanced card grid powered by i18n keys — but **the cards are not clickable** (no individual guide pages exist; the "Read guide" button is decorative).
- **Resources section** on `/` (`src/components/Resources.tsx`) — bullet items are `<button>` elements with **no `onClick`**, so clicking does nothing. There is no `/resources` page.
- **Missing pages:** `/learn` (intro), `/resources`, `/whitepaper`, individual `/learn/guides/:slug` articles.
- **Footer** "Quick Links" already work (Home, About, Projects anchor, Blog, Team).

---

## Phase 1 — Fix routing, kill dead links, add page shells (this round)

**Goal:** every clickable thing leads somewhere real. No "looks like a button but does nothing."

### 1.1 New page shells with full content (real, beginner-friendly copy — no "Lorem ipsum")

| Route | Purpose |
|---|---|
| `/learn` | Learning hub landing. "What is UTAAB?", why it exists, 3 paths (Guides / Workshops / Education courses), CTA "Start Learning" → `/learn/guides`. |
| `/resources` | Trust & knowledge hub. Sections: Whitepaper, Documentation, Tokenomics (placeholder card linking to whitepaper), Blog, FAQs (6–8 real Q&As), Developer Resources (GitHub link). |
| `/whitepaper` | Visual one-page summary: Vision, Technology, Roadmap (3 phases), "Download PDF" button (placeholder link until you provide the file). |
| `/faq` | Standalone FAQ page with accordion (8–10 Web3 + UTAAB questions answered in plain language). |

All pages reuse `Navbar`, `Footer`, `AnimatedBlobBackground`, `GlassCard` — same visual language as the rest of the site.

### 1.2 Wire up dead clicks

- `Resources.tsx` (homepage section) — make each bullet item link to the matching `/resources#section` anchor or `/learn/guides#topic`. Remove items we can't back with content.
- `Learn.tsx` (homepage section) — "Guides" card → `/learn/guides` ✅ already correct; "Tutorials" → `/education` ✅; "Workshops" → `/learn/workshops` ✅. Confirmed working.
- Navbar "Resources" item → currently scrolls to `#resources` on `/`. Change to `/resources` page navigation so it works from any page.

### 1.3 Footer additions

Add new footer column "Learn" with: Learning Hub (`/learn`), Guides (`/learn/guides`), Resources (`/resources`), Whitepaper (`/whitepaper`), FAQ (`/faq`).

### 1.4 Routes added in `src/App.tsx`

```
/learn          → LearnHub.tsx           (new)
/resources      → Resources.tsx page     (new — different from homepage section)
/whitepaper     → Whitepaper.tsx         (new)
/faq            → FAQ.tsx                (new)
```

### 1.5 i18n

All new copy added to `en.json`, `tr.json`, `ru.json`, `ar.json` under new keys: `learnHub.*`, `resourcesPage.*`, `whitepaper.*`, `faqPage.*`. English written first; other languages get human-quality translations (not machine output) for the structural copy. Long-form guide bodies in Phase 2 will be EN-first with TR/RU/AR following the same pattern already used for `learn.guidesPage.*`.

---

## Phase 2 — Make every guide card open a real article (next round)

Right now `/learn/guides` shows 18 cards but none open. We add:

- New route `/learn/guides/:slug` rendering a full article layout with:
  - "What you will learn" box at the top (3–5 bullets)
  - Intro paragraph (plain language, real-world analogy)
  - 3–5 sections with H2 + short paragraphs + bullets + 1 example
  - "Summary" box at the end (3 bullets)
  - "Next guide" + "Back to all guides" CTAs
- Content stored in a typed array `src/data/guides.ts` (no CMS — keeps it simple, version-controlled, translatable).
- 6 launch articles fully written in English (the rest get a "Coming soon" state with email-notify CTA, honest tone, no fake content):
  1. What is blockchain?
  2. How wallets work
  3. Public/private keys explained
  4. What is Web3?
  5. Common Web3 terms (glossary)
  6. What is Ethereum?
- Card click in `EducationalGuides.tsx` → `navigate(/learn/guides/${slug})`. Cards for unwritten guides show a small "Coming soon" badge instead of "Read guide", so nothing feels broken.

---

## Phase 3 — Polish & extras (optional, after Phase 2)

- Reading progress bar on guide pages.
- "Beginner / Intermediate / Advanced" tab filter at top of `/learn/guides`.
- Estimated total learning time per level.
- Search box across guides.
- Related guides at the bottom of each article.

---

## What I will NOT do without your input

- **Whitepaper PDF**: I'll create the page and a download button, but it will link to a placeholder until you share the actual PDF (or confirm "no PDF yet, just the page summary").
- **Tokenomics deep dive**: UTAAB's actual token mechanics aren't in the codebase. I'll write a generic "Tokenomics framework" explainer in `/learn/guides` and a "Tokenomics announcement coming soon" card on `/resources` — but I won't invent specific numbers, supply, allocations, or roadmap dates.
- **Team LinkedIn links**: `/team` already exists and is dynamic from the database. I won't restructure it unless you confirm.
- **Governance / staking**: same as tokenomics — generic educational explainer only, no UTAAB-specific claims.

---

## Files this phase will touch

**New:**
- `src/pages/LearnHub.tsx`
- `src/pages/ResourcesPage.tsx`
- `src/pages/Whitepaper.tsx`
- `src/pages/FAQ.tsx`

**Modified:**
- `src/App.tsx` — add 4 routes
- `src/components/Navbar.tsx` — "Resources" → page navigation
- `src/components/Resources.tsx` (homepage section) — wire bullet items to anchors
- `src/components/Footer.tsx` — add "Learn" column
- `src/i18n/locales/{en,tr,ru,ar}.json` — new namespaces

**Untouched:** Hero, video, animations, styles, admin, auth, Supabase schema, existing translations.

---

## Risk: low
Pure additive work + a few link wirings. No schema, no auth, no design-system changes. If Phase 2 article volume grows large, we'll split it into sub-batches.

---

**Approve this plan and I'll execute Phase 1 in the next message.** Phase 2 and 3 require separate approval after you review Phase 1.

