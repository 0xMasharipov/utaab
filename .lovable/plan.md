
## Speed Up Hero Video Loading

### Why it feels slow

The video files are actually tiny (197 KB desktop / 285 KB mobile / 429 KB tablet) — the problem is **when** the browser starts fetching them, not their size:

1. **Video fetch starts only after React hydrates `Hero.tsx`.** The `<video>` tag doesn't exist in `index.html`, so the browser doesn't know about it until JS parses, mounts `<App>`, runs `useEffect` to detect device type, then renders the `<video>` element. That's typically 1.5–3s on cold load.
2. **No `<link rel="preload" as="video">`** in `index.html` — the browser can't start the video download in parallel with JS/CSS.
3. **`key={deviceType}` forces a remount.** First render uses default `'desktop'`, then the effect detects mobile and React rebuilds the `<video>` element, re-issuing the network request. The first download is wasted.
4. **`preload="auto"` on desktop** competes with JS chunks for bandwidth even though the video is invisible until `onCanPlay`.

### Fix plan (4 small, surgical changes)

**Fix 1 — Preload the right video in `index.html` (parallel to JS)**

Add a small inline script in `<head>` that detects viewport width before any framework loads and injects:

```html
<link rel="preload" as="video" href="/videos/hero-{mobile|tablet|cube}.mp4" type="video/mp4" fetchpriority="high">
```

This kicks off the video download immediately — in parallel with React/Vite chunks — so by the time `Hero.tsx` mounts, the file is already in the HTTP cache and `<video>` plays instantly.

**Fix 2 — Detect device type synchronously in `Hero.tsx`**

Replace the lazy `useState('desktop') + useEffect` pattern with a synchronous initializer:

```ts
const [deviceType] = useState(() => {
  if (typeof window === 'undefined') return 'desktop';
  if (window.matchMedia('(max-width: 767px)').matches) return 'mobile';
  if (window.matchMedia('(max-width: 1023px)').matches) return 'tablet';
  return 'desktop';
});
```

This eliminates the wrong-source first render and the wasted re-download. Keep a `matchMedia` listener for live viewport changes (rare).

**Fix 3 — Remove the `key={deviceType}` remount**

Instead of forcing a full element remount when device type changes, swap `<source src>` with a `useEffect` that calls `videoRef.current.load()`. This avoids React tearing down and rebuilding the element on initial render.

**Fix 4 — Use `preload="auto"` everywhere with `fetchpriority="high"`**

Since the file is already in cache from Fix 1, `auto` is essentially free. Drop the mobile `metadata` branch — the preload tag already gates by viewport and the file is so small (285 KB) that Save-Data users barely notice.

Add a `navigator.connection.saveData` check in the inline preload script: if Data Saver is on or `effectiveType === 'slow-2g' | '2g'`, skip the preload tag entirely (graceful degradation — video still loads later on demand).

### Expected outcome

- Video starts downloading at ~50 ms after navigation (instead of ~1500 ms after JS hydration)
- No wasted desktop-then-mobile double download
- Smooth crossfade fires almost immediately on first paint
- Save-Data users still protected

### Files to modify

- `index.html` — add inline detection script + dynamic `<link rel="preload" as="video">`
- `src/components/Hero.tsx` — synchronous device detection + `videoRef.load()` instead of `key` remount

### What this does NOT change

- Visual design, layout, animations, crossfade behavior
- Video sources or compression
- Mobile / tablet / desktop breakpoints
- Skeleton, fonts, or any other component

### Risk: very low
All changes are progressive enhancements with safe fallbacks. If the inline preload script fails (CSP, no JS), the video still loads via the React component as today.
