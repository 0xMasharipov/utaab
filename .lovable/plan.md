

## Fix invisible navbar dropdown items (definitive fix)

### Diagnosis

From the screenshot, all three column headers (ECOSYSTEM / EXPLORE / ORGANIZATION) render, the bottom CTA row renders, but the menu items themselves are completely invisible. The button DOM is present (you confirmed in code) but visually empty.

The root cause is `.nav-menu-item` in `src/index.css`:

```css
.nav-menu-item {
  opacity: 0;                                          /* hidden by default */
  animation: nav-menu-item-enter 0.2s ease-out forwards;
}
```

It defaults to `opacity: 0` and relies on the `@keyframes nav-menu-item-enter` animating opacity back to `1`. If the keyframes rule is missing from the shipped CSS for any reason — Tailwind purge edge cases, CSS load order race, browser cache of an older build, or any future regression — the items stay at `opacity: 0` forever.

The previous fix (registering animations in `tailwind.config.ts` and moving the class to `src/index.css`) was correct in theory but the symptom is still occurring on the user's screen. We need a fix that **cannot regress**.

### Fix — make items visible by default, treat animation as pure enhancement

Change `.nav-menu-item` so the default state is **visible**, and the animation only adds a subtle slide-up. If keyframes ever fail to load, items still show.

**`src/index.css`** — replace the `.nav-menu-item` block:

```css
.nav-menu-item {
  opacity: 1;                  /* always visible — never depends on animation */
  transform: translateY(0);
  animation: nav-menu-item-enter 0.2s ease-out both;
}
@media (prefers-reduced-motion: reduce) {
  .nav-menu-item { animation: none; }
}
```

The `@keyframes nav-menu-item-enter` (already defined in `tailwind.config.ts`) goes from `opacity:0, translateY(6px)` → `opacity:1, translateY(0)`. With `animation-fill-mode: both`, it still produces the nice fade-in/slide-up effect when keyframes are present, but if they're ever stripped, the element stays at the default `opacity:1` state we just set.

Same hardening for `.nav-menu-enter` (panel) and `.lang-transitioning` (language swap) — set safe visible defaults, animation becomes additive only.

### Files modified

- `src/index.css` — change `.nav-menu-item`, `.nav-menu-enter`, `.lang-transitioning` to visible-by-default; animation becomes enhancement only.

### What this does NOT change

- Visual design, layout, animation feel (when keyframes load, behavior is identical)
- Component logic, props, routing
- Tailwind config, deferred.css, or any other file

### Risk: zero
Items can never be invisible again, regardless of CSS load timing or build issues. Animation gracefully degrades to "no animation" instead of "permanently hidden".

### Verification

Open menu → all items in all 3 columns visible immediately. Clicking "Team" navigates to `/team`. Reduced-motion users see items instantly with no animation.

