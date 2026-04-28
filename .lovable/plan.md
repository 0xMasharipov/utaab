# Smoother Dropdown Menu Animations

## What feels off today

Two "menus" open from the navbar:

1. **Language dropdown** (Globe icon) — already animates via `.dropdown-animated` (220ms open / 160ms close), but the curve is fairly snappy and the scale origin can feel abrupt on touch.
2. **MENU mega panel** (the big frosted overlay) — only animates IN via `nav-menu-enter`. When you close it, the panel is unmounted instantly with no exit animation, which feels harsh. Items inside also pop in without a clean stagger on every open.

The user's complaint ("should appear with smooth animation") points mainly at the MENU overlay.

## Changes

### 1. MENU mega panel — add real open/close animation

In `src/components/Navbar.tsx`:

- Replace the hard `{isMenuOpen && (...)}` unmount with a controlled mount that keeps the panel in the DOM during the close animation (e.g. local `isMounted` state + `onAnimationEnd`, or a small `useEffect` that delays unmount by ~260ms).
- Add a `data-state="open" | "closed"` attribute on the overlay so CSS can drive both directions.
- Stagger child items slightly more gracefully (40–50ms per item, capped) so columns flow in instead of all snapping.

In `src/index.css` (keep navbar-critical animations in the always-loaded sheet, per existing comment):

- Add `nav-menu-exit` keyframes: opacity 1→0, `translateY(0 → -8px)`, `scale(1 → 0.98)`, 200ms `cubic-bezier(0.4, 0, 1, 1)`.
- Update `.nav-menu-enter` to use a softer curve: `cubic-bezier(0.22, 1, 0.36, 1)` over ~280ms with `translateY(-12px → 0)` and `scale(0.98 → 1)` so it "drops in" instead of just fading.
- Drive both via `[data-state="open"]` / `[data-state="closed"]` selectors so the same element animates in and out.
- Keep the existing `prefers-reduced-motion` guard (no animation, instant show/hide).

### 2. Language dropdown — smoother feel

In `src/index.css` `.dropdown-animated` block:

- Slightly longer open (240ms) with the existing `cubic-bezier(0.22, 1, 0.36, 1)`.
- Adjust open keyframes from `scale(0.92) translateY(-6px)` to `scale(0.96) translateY(-4px)` so it glides rather than jumps.
- Keep close at ~160ms but with `cubic-bezier(0.32, 0, 0.67, 0)` for a gentler fade-out.
- Tablet/mobile branch already extends to 260ms — bump to 280ms for parity.

### 3. Menu items inside the overlay

- Update `.nav-menu-item` keyframes (already in tailwind config under `nav-menu-item-enter`) to start at `translateY(8px)` and `opacity: 0` and ease in at 260ms with `cubic-bezier(0.22, 1, 0.36, 1)`. The existing per-item `animationDelay: ${0.03 * i}s` stays, just feels smoother because of the softer curve.

## Files touched

- `src/components/Navbar.tsx` — controlled mount/unmount for the MENU panel, `data-state` attribute, keep stagger logic.
- `src/index.css` — refined `.dropdown-animated` curves, new `nav-menu-enter` / `nav-menu-exit` driven by `data-state`.
- `tailwind.config.ts` — tweak `nav-menu-item-enter` keyframes/easing (small change, only if needed; otherwise rely on CSS).

## Out of scope

- No changes to which menus exist, what they contain, or their layout.
- No changes to the admin dropdowns, profile menus, or shadcn dropdowns elsewhere — those already inherit `.dropdown-animated` and benefit from the easing tweak automatically.
- No new dependencies (no framer-motion added; pure CSS keeps TBT low, matching existing performance notes in the codebase).
