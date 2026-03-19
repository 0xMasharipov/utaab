

# Fix Blog Content JSON Blocks Rendering

## Problem
The blog content field supports a localized JSON structure like `{ "content": { "en": [...], "tr": [...] } }`, but the `BlogPost.tsx` renderer (line 103) only handles a flat array format: `Array.isArray(post.content) ? post.content : []`. When the nested/localized format is pasted and saved, the content silently becomes an empty array and nothing renders.

## Changes

### File: `src/pages/BlogPost.tsx`
Update the content extraction logic (line 103) to handle three formats:
1. **Flat array** (legacy): `[{type: "paragraph", ...}]`
2. **Localized object**: `{ "en": [...], "tr": [...] }`
3. **Wrapped localized object**: `{ "content": { "en": [...] } }`

For formats 2 and 3, select the array matching the current language, falling back to `en`.

```typescript
// Replace line 103
const rawContent = post?.content;
const content: ContentBlock[] = useMemo(() => {
  if (!rawContent) return [];
  if (Array.isArray(rawContent)) return rawContent;
  // { "content": { "en": [...] } }
  if (rawContent.content && typeof rawContent.content === 'object') {
    return rawContent.content[lang] || rawContent.content['en'] || [];
  }
  // { "en": [...], "tr": [...] }
  if (rawContent[lang]) return rawContent[lang];
  if (rawContent['en']) return rawContent['en'];
  return [];
}, [rawContent, lang]);
```

### File: `src/components/BlogSection.tsx`
Same fix needed here — the homepage blog cards might also try to render content previews from the same data.

### File: `src/components/admin/BlogPostFormDialog.tsx`
Update the `useEffect` that loads existing post content (line 56) to properly serialize nested content back to JSON string for editing, and update the save handler to preserve the structure rather than flattening it.

