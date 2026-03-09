

# Add Parallax Scroll Effect to Background Radial Glows

## Approach
Convert the component to track scroll position and apply different `translateY` speeds to each glow orb. Since the container is `fixed`, we use `transform: translateY(scrollY * rate)` where each glow gets a different rate, creating a layered depth effect.

## Changes

### `src/components/AnimatedBlobBackground.tsx`
- Add `useState` + `useEffect` with a passive scroll listener (throttled via `requestAnimationFrame`)
- Apply `transform: translateY(scrollY * rate)` to each glow with different rates:
  - Glow 1 (top-right): `scrollY * -0.08` — moves up slightly (closest layer)
  - Glow 2 (mid-left): `scrollY * -0.15` — moves up more (mid layer)
  - Glow 3 (lower-center): `scrollY * -0.22` — moves up most (deepest layer)
- Use `will-change: transform` on glow elements for GPU compositing
- The gradient and grain layers remain static — only glows move

This is lightweight: one scroll listener, three transform updates per frame, all GPU-accelerated with no layout thrashing.

