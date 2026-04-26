## Goal

Bring TR, RU, and AR locales to full parity with EN (currently 130 keys missing each), then run a grammar/quality pass on all four languages so every public page is fully and correctly localized.

## Scope of missing translations

The English locale has **1,225 keys**; TR/RU/AR each have **~1,094**. Each is missing the same **130 keys** spanning recently added public pages:

- `faqPage.*` — FAQ hero, 10 Q&A pairs, CTA (27 keys)
- `learnHub.*` — Learn Hub hero, 3 paths (Courses/Guides/Workshops), 3 principles, About, CTA (32 keys)
- `whitepaper.*` — Whitepaper hero, vision, tech (3 items), roadmap (3 phases), CTA, disclaimer (35 keys)
- `resourcesPage.*` — Resources hero, 6 items (Whitepaper/Guides/Blog/FAQ/Tokenomics/Developers), CTA (24 keys)
- `footer.*` — `aboutLink`, `faq`, `guides`, `learn`, `learnHub`, `resources`, `whitepaper` (7 keys)
- Misc strays (workshops page subtitle/description, etc.)

User-facing pages without `useTranslation` are confirmed to be only structural/UI primitives (background blobs, three.js scenes, shadcn `ui/*`, BlogPostFormDialog admin tabs) — no public copy gap.

## Approach

1. **Generate translations with the AI gateway** (`google/gemini-2.5-pro`).
   - Feed the model the full English source for each missing key plus existing TR/RU/AR samples from the same locale (so tone, formality, and brand vocabulary stay consistent — e.g., founder name "Zinurbek Masharipov", "UTAAB EDU", "Lovable Cloud" → keep "backend"-style terminology).
   - Request strict JSON output with the exact 130-key tree, one call per language.
   - For Arabic, ensure RTL-friendly punctuation (Arabic comma `،`, question mark `؟`).

2. **Merge into locale files** preserving existing key order and nested structure (deep-merge, never overwrite existing translations).

3. **Grammar & consistency QA pass** on all four locales:
   - Run a second AI pass per language that reads the full locale file and returns only **flagged corrections** (typos, agreement errors, awkward phrasing, English bleed-through) as a diff list.
   - Apply only safe corrections (typos, punctuation, capitalization); leave any semantic rewrites for the user to confirm via a short follow-up summary.

4. **Verification**:
   - Re-run the key-diff script — target: 0 missing keys in TR/RU/AR.
   - JSON-validate all four files.
   - Spot-check the `dir="rtl"` Arabic rendering on `/faq`, `/learn`, `/whitepaper`, `/resources` via the browser tool to confirm no layout breaks.

## Out of scope (kept as-is)

- Admin panel form labels (`BlogPostFormDialog`, `AnnouncementFormDialog`, `CourseFormDialog`, etc.) — admin UI is intentionally English-only per existing convention.
- Shadcn `ui/*` primitives (pagination "Previous/Next") — internal labels not surfaced to end users in current flows.
- Three.js / background / loader components — no copy.

If you'd like the admin panel localized as well, say so and I'll add it as a follow-up.

## Technical notes

- Translation generation uses the `lovable_ai` skill (`google/gemini-2.5-pro`, `--schema` for structured JSON), one call per target language → 3 calls total for the gap-fill, plus 4 calls for the QA pass.
- Merging is done in Python with `json.load` → recursive dict merge → `json.dump(..., ensure_ascii=False, indent=2)` to preserve non-ASCII characters and existing formatting.
- No code changes to `src/` are required — this is a content-only update to `src/i18n/locales/{tr,ru,ar}.json` (and minor corrections to `en.json` if grammar QA finds typos).

## Files to be modified

- `src/i18n/locales/tr.json`
- `src/i18n/locales/ru.json`
- `src/i18n/locales/ar.json`
- `src/i18n/locales/en.json` (only if QA surfaces typos)
