

# Premium Blog Image Lightbox

## What
Create a reusable `ImageLightbox` component with glassmorphism styling, and wire it into `BlogPost.tsx` so clicking any content image or gallery image opens an immersive modal viewer with navigation.

## New File: `src/components/blog/ImageLightbox.tsx`

A self-contained lightbox component accepting:
- `images: { url: string; alt?: string }[]` — all viewable images
- `initialIndex: number` — which image was clicked
- `open: boolean` / `onClose: () => void`

Features:
- **Overlay**: `fixed inset-0 z-[100]` with `bg-black/70 backdrop-blur-xl` — cinematic, not flat black
- **Image container**: centered with `max-w-[90vw] max-h-[85vh]`, `rounded-[24px]`, subtle `border border-white/10`, `shadow-2xl shadow-black/40`, object-contain to preserve aspect ratio
- **Navigation arrows**: `ChevronLeft` / `ChevronRight` from lucide-react, wrapped in glass-style circular buttons (`bg-white/10 backdrop-blur-md border border-white/10 rounded-full`), positioned absolutely on left/right sides, vertically centered. Hover: `bg-white/20 scale-110`
- **Close button**: `X` icon, same glass style, top-right corner
- **Looping**: prev/next wrap around
- **Keyboard**: `ArrowLeft`, `ArrowRight`, `Escape` via `useEffect` keydown listener
- **Mobile swipe**: track `touchstart`/`touchend` X delta, threshold ~50px to navigate
- **Body scroll lock**: `document.body.style.overflow = 'hidden'` on mount, restore on unmount
- **Animations**: framer-motion `AnimatePresence` for overlay fade-in, image uses `key={currentIndex}` with fade+scale transition
- **Preloading**: preload `images[currentIndex ± 1]` via `new Image()` in useEffect
- **Accessibility**: `role="dialog"`, `aria-label`, focus trap (auto-focus close button), alt text on image
- **Click outside**: overlay click (not image) calls `onClose`
- **Image counter**: subtle `1 / 5` text at bottom center

## Modified: `src/pages/BlogPost.tsx`

1. **Collect all post images** into a single array:
   - Content block images (type `'image'`, extract `url` and `alt`)
   - Gallery images (from `post.gallery`)
   - Cover image excluded (it's decorative background)

2. **Add lightbox state**: `lightboxOpen`, `lightboxIndex`

3. **Pass `onImageClick` callback to `RenderBlock`**: When an image content block is clicked, find its index in the collected array and open lightbox

4. **Update gallery rendering**: Replace `<a href target="_blank">` with `onClick` that opens lightbox at the correct index

5. **Update `RenderBlock`**: Accept optional `onImageClick` prop; for `image` type, add `cursor-pointer` and `onClick` handler

6. **Render `<ImageLightbox>` at bottom** of the component with the collected images array

## Summary of changes

| File | Action |
|------|--------|
| `src/components/blog/ImageLightbox.tsx` | **Create** — reusable lightbox component |
| `src/pages/BlogPost.tsx` | **Edit** — collect images, add lightbox state, wire click handlers |

