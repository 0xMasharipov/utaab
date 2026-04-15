

# Remove Rocket Blue Background & Make It Bigger

## Summary
Remove the blue-tinted container background behind the rocket image and increase the image size for more visual impact.

## Changes

### `src/pages/learn/Workshops.tsx`
- **Line 23**: Remove `bg-primary/20` from the wrapper `div` — this eliminates the blue background
- **Line 23**: Increase wrapper size from `w-16 h-16` to `w-24 h-24`
- **Line 24**: Increase image size from `w-10 h-10` to `w-16 h-16`
- Keep `rounded-2xl`, `mb-8`, and centering classes

### What does NOT change
- Page layout, text, translations, glass card
- Navbar, Footer, blob background

## Files Modified
- `src/pages/learn/Workshops.tsx` — remove blue bg, resize icon

