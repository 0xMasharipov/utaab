

# Prevent Content Copying Across the Site

## Approach
Add CSS-based and JavaScript-based copy protection to prevent users from selecting/copying text, saving images, and downloading videos.

## Changes

### 1. Add global CSS rules in `src/index.css`
Add to the base layer:
- `user-select: none` on `body` to prevent text selection
- Disable image dragging globally
- Disable video download via `controlsList`

### 2. Add JS-level protections in `src/main.tsx`
Add event listeners on `document` to block:
- `contextmenu` (right-click menu)
- `copy` event
- `selectstart` event
- Keyboard shortcuts: `Ctrl+C`, `Ctrl+U` (view source), `Ctrl+S` (save), `Ctrl+A` (select all)

### 3. Update video elements
In `src/components/Hero.tsx` and any other video components, add `controlsList="nodownload"` and `onContextMenu={e => e.preventDefault()}` to `<video>` tags.

### 4. Add image protection
Add `draggable="false"` and `onContextMenu` prevention to image elements via a global CSS rule (`img { pointer-events: none }` or `user-drag: none`).

## Files to modify

| File | Change |
|------|--------|
| `src/index.css` | Add `user-select: none`, image drag prevention |
| `src/main.tsx` | Add `contextmenu`, `copy`, `keydown` event blockers |
| `src/components/Hero.tsx` | Add `controlsList="nodownload"` to video |

## Note
Client-side copy protection is a deterrent, not absolute security — determined users can always bypass it via dev tools. But it prevents casual copying.

