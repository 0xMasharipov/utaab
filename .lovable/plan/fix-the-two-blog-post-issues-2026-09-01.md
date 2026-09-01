# Fix the two blog post issues

## What I found

**1. The Monad Blitz Çanakkale post is invisible on the site.**
Its publish date is set to **5 December 2026** (a future date), while the event was on 16 May 2026. The database rule that decides which posts the public can see only shows posts whose publish date is in the past, so this post is filtered out everywhere (blog list, homepage, sitemap). Everything else about it is fine: it is marked published, has cover image, gallery (5 images), translations and meta description.

**2. The article body of the two newest posts renders empty.**
Confirmed on the live pages: the Beyond Blockchain and Monad posts store each content block as `{ "type": "paragraph", "text": "..." }`, while the older posts use `{ "type": "paragraph", "content": "..." }`. The renderer only reads `content`, so every heading/paragraph in the two new posts renders as blank — which is why the description/body you added doesn't appear.

## The fix

1. Correct the Monad post's publish date to 16 May 2026 so it becomes publicly visible again (list page, homepage and sitemap).
2. Make the blog renderer tolerant of both block shapes: read `text` when `content` is absent, also accept `src`/`image` for image blocks and `caption` for captions, and fall back to rendering plain text for unknown block types instead of dropping it.
3. Regenerate `public/sitemap.xml` so both new posts are listed for search engines (the live sitemap currently only has the two older posts).

## Technical details

- Data: `update blog_posts set publish_date = '2026-05-16 08:11:00+00' where slug = 'utaab-monad-blitz-canakkale-2026'`.
- Code: `src/pages/BlogPost.tsx` — normalize block fields in `RenderBlock` (`content ?? text`, `url || src || image`, `alt || caption`), handle a `text` block type, and render a paragraph fallback in `default`.
- Sitemap: re-run `scripts/generate-sitemap.ts` (already wired to `predev`/`prebuild`) and republish so the new URLs are advertised.
- No changes to the admin editor, RLS policies or blog queries.
