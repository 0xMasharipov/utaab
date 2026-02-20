
# Fix Team Page: Placeholder, Duplicate Close Button, and Polish

## Issues Identified

### 1. Placeholder Covers Images
The `AnimatedImage` component's shimmer placeholder (`absolute inset-0 bg-muted`) has the same stacking as the image itself. Since the placeholder div comes before the `<img>` in the DOM and both are positioned within the same container, the placeholder visually sits on top. Additionally, the placeholder uses `bg-muted` which is opaque, blocking the image even during the fade-in transition.

**Fix**: Add `z-10` to the placeholder so it layers correctly, and more importantly add `pointer-events-none` and ensure the placeholder fades out smoothly when the image loads (add a transition to the placeholder itself instead of just removing it abruptly).

### 2. Text Not Visible on Cards
The dark gradient overlay on the Image Card (`absolute inset-0`) may be obscured by the `AnimatedImage` container. The overlay needs a higher z-index to sit above the image container.

**Fix**: Add `z-10` to the gradient overlay div in `TeamOverlapCard` so it renders above the image.

### 3. Duplicate Close Buttons in Profile Modal
The Radix `DialogContent` component already includes a built-in close button (X icon at top-right). The `TeamProfileModal` adds a second custom close button on top of the image. This results in two X buttons.

**Fix**: Hide the default Radix close button by adding a CSS class to `DialogContent` that hides it (`[&>button]:hidden`), keeping only the custom styled one that matches the design.

## Changes

### File: `src/components/common/AnimatedImage.tsx`
- Add a smooth opacity transition to the placeholder div so it fades out instead of disappearing abruptly
- Change from conditional render (`{!loaded && ...}`) to always-rendered with opacity transition
- Add `pointer-events-none` to the placeholder

### File: `src/components/team/TeamOverlapCard.tsx`
- Add `z-10` to the gradient overlay div so it renders above the AnimatedImage container
- Ensure the Glass Info Card has appropriate z-index (`z-20`) to stay above everything

### File: `src/components/team/TeamProfileModal.tsx`
- Add `[&>button]:hidden` class to `DialogContent` to hide the default Radix close button
- Keep the custom styled close button over the image

### File: `src/components/team/TeamProfileDrawer.tsx`
- Verify no duplicate close elements (drawer uses pull handle, no X button conflict expected -- no changes needed)

## Technical Details

**AnimatedImage placeholder fix:**
```tsx
// Before: abrupt removal
{!loaded && <div className="absolute inset-0 bg-muted animate-pulse" />}

// After: smooth fade-out
<div className={cn(
  'absolute inset-0 bg-muted animate-pulse rounded-md pointer-events-none transition-opacity duration-500',
  loaded ? 'opacity-0' : 'opacity-100',
  placeholderClassName
)} />
```

**TeamOverlapCard gradient overlay fix:**
```tsx
// Add z-10 to gradient overlay
<div className="absolute inset-0 pointer-events-none z-10" style={{...}} />
```

**TeamProfileModal close button fix:**
```tsx
// Hide default Radix close button, keep custom one
<DialogContent className="... [&>button]:hidden">
```

## Files Modified

| File | Change |
|------|--------|
| `src/components/common/AnimatedImage.tsx` | Smooth placeholder fade-out transition |
| `src/components/team/TeamOverlapCard.tsx` | Add z-index to gradient overlay |
| `src/components/team/TeamProfileModal.tsx` | Hide duplicate Radix close button |
