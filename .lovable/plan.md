

## Add UTAABLoader full-screen boot loader

### What you'll see
A full-screen dark navy boot screen with the rotated 2×2 UTAAB outline logo at center, animated particles, scan lines, perspective grid, scrolling hash strips, corner brackets, and a stepped progress bar. Fades out smoothly and unmounts when loading completes, revealing the home page beneath.

### Files

**New: `src/hooks/useBreakpoint.ts`**
- Returns `"mobile" | "tablet" | "desktop"` based on `window.innerWidth` (<640 / <1024 / ≥1024)
- Listens to `resize` with a 100ms debounce
- SSR-safe initial value (defaults to `"desktop"` if `window` undefined, then corrects on mount)

**New: `src/components/UTAABLoader.tsx`**
- Props: `{ onComplete?: () => void }`
- Fixed full-viewport overlay, `z-[9999]`, background `#080d1a`, `touch-action: none`, `user-select: none`, `-webkit-tap-highlight-color: transparent`
- Uses `useBreakpoint()` to drive sizes per the responsive map (logo 100/130/160, fonts, progress bar widths, particle count 16/28/40, etc.)
- Background layers (all `pointer-events-none`):
  1. Nebula radial-gradient with `bgBreath` 7s
  2. Perspective grid (52px desktop/tablet, 36px mobile) with opacity pulse 6s
  3. Particles array generated once outside the component (40 entries; sliced based on breakpoint), each animated with `particleRise`
  4. Two horizontal scan lines (top 38% and 62%) with `scanH` sweep; opacity ×0.6 on mobile
  5. Two vertical accent lines (hidden on mobile) with `vertLinePulse`
  6. Four corner brackets (sized/inset per breakpoint) with staggered `bracketPulse`
  7. Two scrolling hash strips (top scrolls left 12s, bottom right 18s) using duplicated content + `hashScroll`
- Center column: `flex flex-col items-center`, `max-w-[100vw]`, padding 0 16/24/0px, fade-in opacity 0→1 over 0.8s
  - EPOCH label "EPOCH · 2025 · MAINNET"
  - 2×2 logo grid rotated 45deg with 4 tile variants (`tilePulseA/B/C/D`), behind it a radial glow (`outerGlow`), spring entrance via cubic-bezier
  - Subtitle "Build Your Future in Blockchain" (letter-spacing reduced to 0.25em on mobile, `nowrap` on tablet/desktop, `normal` on mobile)
  - Progress bar with stepped fills `[12, 28, 41, 57, 69, 78, 88, 94, 99, 100]%` advanced via chained `setTimeout` (600–1000ms gaps), gradient fill with `progressGlow`, hex/percent labels below
- On reaching 100%: set `visible=false` to trigger 0.9s opacity fade, then call `onComplete?.()` via `transitionend` (with a safety timeout fallback)
- Single `<style>` JSX block at the bottom containing all keyframes (`scanH`, `vertLinePulse`, `bracketPulse`, `particleRise`, `bgBreath`, `progressGlow`, `hashScroll`, `subtitleFade`, `tilePulseA/B/C/D`, `outerGlow`) and a Google Fonts `@import` for DM Mono (300/400/500) and Syne (700/800)
- Cleanup: clears all timers on unmount

**Modified: `src/main.tsx`**
- Wrap `<App />` in a small `<Boot>` component that holds `loading` state and renders `<UTAABLoader onComplete={() => setLoading(false)} />` while loading, alongside `<App />` underneath. The loader sits on top via `z-[9999]` and fades away — `App` mounts immediately so the page is ready when the overlay clears.

### Untouched
All routes, components, styles, and the existing copy-protection listeners in `main.tsx`. No new dependencies. No changes to Tailwind config (everything is inline styles + utility classes already available).

### Responsive guarantees baked in
- Logo always centered, capped by `max-w-[100vw]` on the column
- Progress bar `min(…, 80–60vw)` with hard `90vw` cap
- Vertical accent lines hidden on mobile to avoid clipping
- Corner brackets use percentage insets so they stay in viewport
- Particle count and travel distance reduced on mobile
- Subtitle letter-spacing reduced + `white-space: normal` on mobile to prevent overflow on 320px screens

### Risk: low
Pure additive: one new hook, one new component, one tiny wrapper in `main.tsx`. No styling/system changes. Entirely self-contained CSS via scoped `<style>` block.

