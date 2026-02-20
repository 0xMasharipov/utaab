
# Animate Image Loading Across the Website

## Overview
Create a reusable `AnimatedImage` component that wraps all `<img>` tags with a smooth fade-in + scale animation on load, plus a shimmer placeholder skeleton while loading. This replaces the current static "pop-in" behavior with a polished, professional feel.

## Changes

### 1. Create Reusable `AnimatedImage` Component

**New file: `src/components/common/AnimatedImage.tsx`**

A drop-in replacement for `<img>` that:
- Shows a subtle shimmer/pulse skeleton placeholder while loading
- Fades in with a slight upward scale animation once loaded (`opacity-0 scale-95` to `opacity-100 scale-100`)
- Accepts all standard `<img>` props plus optional `placeholderClassName` for custom skeleton sizing
- Uses React state (`loaded`) toggled by the `onLoad` event

### 2. Update All Image Locations

Apply `AnimatedImage` to every static and dynamic image across the site:

| File | Images Updated |
|------|---------------|
| `src/components/Team.tsx` | Team member photos (5 images) |
| `src/components/Footer.tsx` | Footer brand logo |
| `src/components/blog/BlogCard.tsx` | Blog post cover images |
| `src/components/education/ExternalCourseCard.tsx` | Course card hero images |
| `src/pages/education/BlockchainAndMoney.tsx` | MIT logo in course header |
| `src/pages/BlogPost.tsx` | Blog post cover image + inline content images |
| `src/pages/Blog.tsx` | Featured blog post cover image |
| `src/pages/TeamPage.tsx` | Team page member photos |
| `src/pages/education/EducationHome.tsx` | Course hero images |
| `src/pages/education/CourseDetail.tsx` | Course detail hero image |
| `src/pages/education/CourseCatalog.tsx` | Course catalog hero images |
| `src/pages/education/InstructorProfile.tsx` | Instructor course images |
| `src/pages/admin/AdminEvents.tsx` | Event cover images |

**Note:** The Navbar and EducationNavbar logos already have a fade-in animation with shimmer placeholder -- these will remain unchanged.

### 3. Component Design

```text
+---------------------------+
|  AnimatedImage             |
|                           |
|  [shimmer skeleton]       |  <-- visible while loading
|  [img opacity-0]          |  <-- hidden until loaded
|                           |
|  onLoad fires -->         |
|                           |
|  [skeleton hidden]        |  <-- removed
|  [img fade-in + scale]    |  <-- smooth 500ms transition
+---------------------------+
```

## Technical Details

### `AnimatedImage` Component Props
- Extends `React.ImgHTMLAttributes<HTMLImageElement>` (all native img props)
- `placeholderClassName?: string` -- optional custom classes for the skeleton placeholder dimensions
- `containerClassName?: string` -- optional wrapper div classes

### Implementation Pattern
```tsx
const [loaded, setLoaded] = useState(false);

return (
  <div className={cn("relative overflow-hidden", containerClassName)}>
    {!loaded && (
      <div className={cn("absolute inset-0 bg-muted animate-pulse rounded-md", placeholderClassName)} />
    )}
    <img
      {...props}
      onLoad={(e) => { setLoaded(true); props.onLoad?.(e); }}
      className={cn(
        "transition-all duration-500 ease-out",
        loaded ? "opacity-100 scale-100" : "opacity-0 scale-95",
        props.className
      )}
    />
  </div>
);
```

### Files Modified

| File | Change |
|------|--------|
| `src/components/common/AnimatedImage.tsx` | **New** -- reusable animated image component |
| `src/components/Team.tsx` | Replace `<img>` with `<AnimatedImage>` |
| `src/components/Footer.tsx` | Replace `<img>` with `<AnimatedImage>` |
| `src/components/blog/BlogCard.tsx` | Replace `<img>` with `<AnimatedImage>` |
| `src/components/education/ExternalCourseCard.tsx` | Replace `<img>` with `<AnimatedImage>` |
| `src/pages/education/BlockchainAndMoney.tsx` | Replace MIT logo `<img>` with `<AnimatedImage>` |
| `src/pages/BlogPost.tsx` | Replace cover + inline `<img>` with `<AnimatedImage>` |
| `src/pages/Blog.tsx` | Replace featured post `<img>` with `<AnimatedImage>` |
| `src/pages/TeamPage.tsx` | Replace `<img>` with `<AnimatedImage>` |
| `src/pages/education/EducationHome.tsx` | Replace `<img>` with `<AnimatedImage>` |
| `src/pages/education/CourseDetail.tsx` | Replace `<img>` with `<AnimatedImage>` |
| `src/pages/education/CourseCatalog.tsx` | Replace `<img>` with `<AnimatedImage>` |
| `src/pages/education/InstructorProfile.tsx` | Replace `<img>` with `<AnimatedImage>` |
| `src/pages/admin/AdminEvents.tsx` | Replace `<img>` with `<AnimatedImage>` |
