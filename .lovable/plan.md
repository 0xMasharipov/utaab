

# Fix Blog Post Sync Between Admin Panel and Frontend

## Root Cause

When an admin publishes a blog post, the frontend sections don't show it because:

1. **Missing `publish_date`**: The admin form allows publishing without setting a publish date. The homepage query orders by `publish_date desc` with `nullsFirst: false`, which pushes posts with null dates to the bottom or excludes them from visibility.
2. **Stale cache**: The homepage `BlogSection` uses React Query but the cache is never invalidated after admin actions. The `/blog` page uses a one-time `useEffect` fetch — never refreshes.
3. **No auto-refresh**: Neither page refetches on window focus, so navigating from admin to the homepage shows stale data.

## Changes

### 1. `src/components/admin/BlogPostFormDialog.tsx`
- Auto-set `publish_date` to current timestamp when status is `published` and no date is provided
- This ensures the RLS policy (`publish_date IS NULL OR publish_date <= now()`) and the ordering work correctly

### 2. `src/components/BlogSection.tsx`
- Add `refetchOnWindowFocus: true` and a short `staleTime` (30s) to the `useQuery` config so the homepage refreshes when the admin switches tabs back

### 3. `src/pages/Blog.tsx`
- Convert from `useEffect` fetch to `useQuery` with `refetchOnWindowFocus: true` for consistent cache behavior and automatic refresh

| File | Change |
|------|--------|
| `src/components/admin/BlogPostFormDialog.tsx` | Auto-set `publish_date` on publish |
| `src/components/BlogSection.tsx` | Add `refetchOnWindowFocus`, `staleTime` |
| `src/pages/Blog.tsx` | Convert to `useQuery` with auto-refresh |

