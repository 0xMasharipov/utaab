

# Fix Hero Video Bug on Dropdown Open

## Root Cause

The hero video uses a JavaScript-based mobile detection (`window.innerWidth < 768`) tied to a `resize` event listener. When the dropdown menu opens, some browsers trigger layout recalculations that briefly change `window.innerWidth` (e.g., scrollbar appearing/disappearing, virtual keyboard, or viewport changes). This toggles `isMobile`, which changes the `key` prop on the `<video>` element, causing React to **unmount and remount** the video with the other source file. This results in:

1. Both video versions briefly loading
2. The native video player UI flashing
3. Video restarting playback

## Fix

### 1. Replace `window.innerWidth` resize listener with `matchMedia` (`Hero.tsx`)

Use `window.matchMedia` instead of raw `innerWidth`. `matchMedia` only fires when the media query result **actually changes** (crossing the breakpoint), not on every minor layout shift. This prevents false toggles.

```tsx
useEffect(() => {
  const mql = window.matchMedia('(max-width: 767px)');
  const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
  setIsMobile(mql.matches);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
}, []);
```

### 2. Reset `videoReady` when video source changes (`Hero.tsx`)

When `isMobile` legitimately changes (e.g., actual device rotation), reset `videoReady` to `false` so the new video fades in cleanly instead of showing the poster then jumping.

```tsx
useEffect(() => {
  setVideoReady(false);
}, [isMobile]);
```

## Files Modified
- `src/components/Hero.tsx` — 2 small changes (replace resize listener, add videoReady reset)

