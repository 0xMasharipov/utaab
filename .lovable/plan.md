## Goal
Make the UBpoint page automatically dial down (or fully disable) its heavy animations when the device is under pressure — low memory, low frame rate, or a sudden frame-time spike — so the page never crashes the tab again on mid/low-end devices.

All work is confined to `src/pages/projects/UBpointPage.tsx` plus one tiny new hook file. No backend, no design tokens, no copy changes.

## 1. Add a `usePerfGuard` hook
New file: `src/hooks/usePerfGuard.ts`.

Single hook that returns a `tier`: `"full" | "reduced" | "minimal"` and updates it live.

Initial tier is decided synchronously from cheap, static signals so the first paint is already correct:
- `prefers-reduced-motion: reduce` → `minimal`
- `navigator.deviceMemory <= 2` OR `navigator.hardwareConcurrency <= 2` → `minimal`
- `navigator.deviceMemory <= 4` OR coarse pointer + small viewport → `reduced`
- `navigator.connection.saveData === true` → `reduced`
- otherwise → `full`

After mount, run a lightweight `requestAnimationFrame` FPS sampler:
- Sample frame deltas in a rolling 60-frame window.
- If average FPS drops below 45 for 2 consecutive windows → downgrade one tier (`full` → `reduced`, `reduced` → `minimal`).
- If a single frame exceeds 120 ms (jank spike) twice within 3 s → downgrade one tier immediately.
- Never upgrade back up during the session — guardrails are sticky to avoid flapping.
- Pause sampling while `document.hidden` is true.
- Tear everything down on unmount.

Optional: also watch `performance.memory.usedJSHeapSize` (Chromium-only) and downgrade to `minimal` if it crosses ~85% of `jsHeapSizeLimit`.

The hook is fully passive — it never throws, gracefully no-ops on browsers that lack `deviceMemory` / `performance.memory`.

## 2. Wire the tier into UBpoint's animation stack
In `UBpointPage.tsx`, read `tier` once at the top of the component and gate the existing motion based on it:

- `full` — current behavior (already trimmed in the previous pass).
- `reduced` —
  - Hero blurred blob: keep static, remove any remaining looped `animate` props.
  - Coin / device intros: drop `scale` motion, keep only a 200 ms `opacity` fade.
  - Disable any hover-driven `whileHover` scale on coins/cards.
  - Skip the splash overlay entirely (jump straight to content).
- `minimal` —
  - No `motion.*` animations at all: render as plain `<div>`s with final styles.
  - No splash, no blob, no parallax, no hover transforms.
  - Force `prefers-reduced-motion` semantics across the whole page.

Implementation pattern: a small local helper `const motionProps = (full, reduced, minimal) => tier === 'full' ? full : tier === 'reduced' ? reduced : minimal` so each animated element picks the right prop set without sprinkling ternaries everywhere.

## 3. Image + asset guardrails (cheap wins under pressure)
When `tier !== 'full'`:
- Add `loading="lazy"` + `decoding="async"` to every coin/device image (the device hero image stays eager).
- Skip rendering the lower-priority floating coin layers (keep ~3 of the 9 in `reduced`, 0 in `minimal`).
- Replace `backdrop-blur-*` utilities on inner cards with a solid `bg-white/90` fallback in `minimal` (backdrop-filter is one of the most expensive paint ops on weak GPUs).

## 4. Observability (dev only)
- In `import.meta.env.DEV`, the hook logs tier transitions to the console (`[perf-guard] full → reduced (avg fps 38)`).
- No telemetry, no network calls, no user-visible UI.

## 5. Verify
- Open `/projects/ubpoint` on desktop → tier stays `full`, page looks unchanged.
- Throttle CPU 6× in DevTools → within ~2 s the FPS sampler drops the tier to `reduced` and the floating coin loops stop; page stays fully usable.
- Throttle CPU 20× or set `prefers-reduced-motion` → tier is `minimal` from first paint, splash is skipped, no looped motion, no `backdrop-filter`, no crash.
- Verify no regressions on the normal desktop path (tier `full` renders the exact same DOM as today).

## Technical notes
- All changes are local: one new hook (`src/hooks/usePerfGuard.ts`) and edits to `src/pages/projects/UBpointPage.tsx`. The existing error boundary, background lock, and splash logic from the previous pass stay as-is — guardrails sit on top of them.
- No new dependencies. RAF + `performance.now()` only.
- Sticky downgrades + no-upgrade policy prevents oscillation between tiers when the GC briefly recovers.
