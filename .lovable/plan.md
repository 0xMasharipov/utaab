## Goal

Allow admins to write the **Content (JSON blocks)** body in all four supported languages (EN, TR, RU, AR), not just English. The public blog reader already understands the per-language shape — we only need to upgrade the admin editor and the save logic.

## How it will look in the editor

In the **New / Edit Post** dialog → **Content** tab, the single "Content (JSON blocks)" textarea will be replaced with a **language-tabbed editor**:

```text
Content (JSON blocks)
┌──────────────────────────────────────────┐
│ [EN]  [TR]  [RU]  [AR]                   │
├──────────────────────────────────────────┤
│  [ JSON blocks textarea for active lang ]│
│                                          │
│  Copy from EN ▸                          │
└──────────────────────────────────────────┘
```

- Each tab holds its own JSON blocks array.
- EN remains required; TR/RU/AR are optional. If a language is empty, the public site falls back to EN automatically (already implemented in `BlogPost.tsx`).
- A small **"Copy from EN"** button on the TR/RU/AR tabs pre-fills the textarea with the English JSON so the admin only translates the `content` strings inside the blocks.
- Per-tab JSON validation indicator (same pattern used in `TranslationEditor.tsx`) so invalid JSON is caught before saving.

The **Translations** tab keeps its current role for Title and Excerpt translations (no change there).

## Storage shape

Posts will be saved to `blog_posts.content` as:

```json
{
  "en": [ { "type": "paragraph", "content": "..." }, ... ],
  "tr": [ ... ],
  "ru": [ ... ],
  "ar": [ ... ]
}
```

This matches the shape `BlogPost.tsx` already reads (lines 112–114). Existing posts stored as a plain array stay fully compatible — the reader already handles both shapes, and the editor will auto-migrate a legacy array into `{ en: [...] }` on first open.

## Technical changes

**`src/components/admin/BlogPostFormDialog.tsx`**
- Replace the single `content: string` field with `content_en / content_tr / content_ru / content_ar` strings (each holding stringified JSON).
- On open: if `post.content` is an array → load it into `content_en`; if it's already `{en,tr,ru,ar}` → load each into its tab.
- Render a nested `<Tabs>` (EN/TR/RU/AR) inside the Content section with one `<Textarea>` per language, plus a JSON-validity badge per tab.
- Add a "Copy from EN" button visible on non-EN tabs.
- On save: parse each tab's JSON (fallback to `[]` on parse error for empty langs), then build `payload.content = { en, tr, ru, ar }`. Drop empty arrays so the JSON stays clean (only include languages with at least one block).
- Keep the `title_en` requirement; do not block save when only EN content is filled.

**No other files need to change** — `BlogPost.tsx`, `BlogCard.tsx`, the database schema, and the blog listing query already work with the localized shape.

## Out of scope

- No database migration (the `content` column is already `jsonb`).
- No changes to the Title/Excerpt translation tab.
- No automatic machine translation — admins write each language manually (or copy from EN as a starting point).
