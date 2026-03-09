

# Add Image Gallery to Blog Posts

## What
Add a gallery image upload section to the admin blog post form, and display those images in the `BlogCard` component under the tags. The `blog_posts` table already has a `gallery` column (jsonb, default `'[]'`), so no database migration is needed.

## Changes

### 1. `src/components/admin/BlogPostFormDialog.tsx`
- Add `gallery` field to the form state (array of image URL strings, stored as JSON)
- In the "Media" tab, add a gallery section below the cover image that allows admins to upload multiple images using the existing `ImageUpload` component
- Include an "Add Image" button that appends new upload slots, and ability to remove individual gallery images
- Persist `gallery` as a JSON array of URL strings in the payload

### 2. `src/components/blog/BlogCard.tsx`
- Add `gallery` to the post interface (`gallery?: any[] | null`)
- Below the tags section, render a horizontal row of gallery image thumbnails (max 3-4 shown) using `AnimatedImage` for loading animations
- Small rounded thumbnails with overflow hidden, subtle hover effect

### 3. `src/components/BlogSection.tsx`
- Already fetches `select('*')` which includes the `gallery` column — no change needed, data flows through automatically

| File | Change |
|------|--------|
| `BlogPostFormDialog.tsx` | Add gallery upload UI in Media tab |
| `BlogCard.tsx` | Display gallery thumbnails under tags |

