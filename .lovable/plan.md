

# Fix Broken Image Loading

## Problem
The `AnimatedImage` component wraps every `<img>` in a `<div class="relative overflow-hidden">` container. For absolutely-positioned decorative images inside cards (AboutBlurb, Learn, Projects, Resources), this wrapper div has no intrinsic size and its `overflow-hidden` clips the image — making them invisible.

## Fix

### Approach: Move positioning classes to `containerClassName`
For absolutely-positioned images, the container div must carry the absolute positioning, and the `<img>` inside should fill the container. For normal-flow images (Events, EducationHome), no changes needed.

### `src/components/AboutBlurb.tsx` (line 76–83)
Move `absolute bottom-0 right-0 w-[65%] h-auto z-10 translate-x-[5%] translate-y-[5%]` to `containerClassName`. Keep `object-contain transition-transform duration-500 group-hover:scale-105` on `className`. Add `w-full h-full` to className so img fills container.

### `src/components/Learn.tsx` (line 76–83)
Same pattern — move absolute positioning to `containerClassName`.

### `src/components/Projects.tsx` (line 105–112)
Move `absolute bottom-0 right-0 w-[55%] z-10 opacity-[0.85]` to `containerClassName`. Keep `object-contain transition-transform...` on className.

### `src/components/Resources.tsx` (lines 83–90 and 103–110)
- Layer 2 (line 83): Move `absolute bottom-0 right-0 w-[40%] z-[5] opacity-[0.12] blur-[1px]` to `containerClassName`
- Layer 4 icon (line 103): This is normal-flow, but the container's `relative overflow-hidden` may interfere with inline icon sizing. Add `containerClassName="inline-block"` and keep img classes as-is.

### `src/components/Events.tsx`
No change needed — already normal-flow with `containerClassName` usage.

## Files Modified
- `src/components/AboutBlurb.tsx`
- `src/components/Learn.tsx`
- `src/components/Projects.tsx`
- `src/components/Resources.tsx`

