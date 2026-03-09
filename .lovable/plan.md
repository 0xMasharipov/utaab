

# Add Blog Section to Homepage (Below Events)

## What
Create a new `BlogSection` component that fetches and displays published blog posts in a grid on the homepage, placed between the Events and Projects sections. Uses the existing `BlogCard` component (which already uses `AnimatedImage` for loading animations).

## Changes

### 1. New file: `src/components/BlogSection.tsx`
- Fetch published blog posts from the database (limit 6, ordered by publish_date desc)
- Use `useQuery` for data fetching (consistent with Events component pattern)
- Display in a responsive grid: 1 col mobile, 2 col tablet, 3 col desktop
- Reuse existing `BlogCard` component (already has `AnimatedImage` with shimmer loading)
- Add a "View All" link to `/blog`
- Loading state with `Loader2` spinner (matching Events pattern)
- Section title using translation key `blog.sectionTitle`
- Glass section styling consistent with the rest of the homepage

### 2. `src/pages/Index.tsx`
- Import and add `<BlogSection />` between `<Events />` and `<Projects />`

### 3. Translation files (en.json, tr.json, ru.json, ar.json)
- Add `blog.sectionTitle` and `blog.viewAll` keys

