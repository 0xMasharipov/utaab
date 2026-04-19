

## Fix Invisible Navbar Menu Items (Team, Blog, About, etc.)

### Root cause

The hamburger menu opens, but **all navigation items inside the 3 columns are invisible** (only the column headers ECOSYSTEM / EXPLORE / ORGANIZATION and the bottom CTA buttons render). That's why the user can't click "Team" — the link exists in the DOM but is rendered with `opacity: 0`.

**Why**: In `src/styles/deferred.css`, the items use:

```css
.nav-menu-item {
  opacity: 0;
  animation: nav-menu-item-enter 0.2s ease-out forwards;
}
```

The `@keyframes nav-menu-item-enter` is defined in `tailwind.config.ts` under `theme.extend.keyframes`, but it is **NOT registered in `theme.extend.animation`**. Tailwind's JIT only emits `@keyframes` rules into the compiled CSS when they are referenced by a generated `animate-*` utility class. Since no utility uses it, the keyframe rule never reaches the browser → the animation can't run → the item stays at `opacity: 0` forever.

The same problem affects `nav-menu-enter` (the panel slide-in) and `lang-text-swap` — they're also defined as keyframes-only without animation utilities.

### Fix (single file change)

Register the missing keyframes in `tailwind.config.ts` under `theme.extend.animation` so Tailwind ships their `@keyframes` rules:

```ts
animation: {
  // ...existing entries...
  "nav-menu-enter": "nav-menu-enter 0.22s ease-out forwards",
  "nav-menu-item-enter": "nav-menu-item-enter 0.2s ease-out forwards",
  "lang-text-swap": "lang-text-swap 0.35s ease-in-out",
  "hero-carousel-scroll": "hero-carousel-scroll 30s linear infinite",
  "blob-fade-in": "blob-fade-in 0.6s ease-out forwards",
  "mobile-hero-pulse": "mobile-hero-pulse 8s ease-in-out infinite",
  "liquidGlass": "liquidGlass 6s ease-in-out infinite",
}
```

This causes Tailwind to emit each `@keyframes` block into the CSS output. The existing `.nav-menu-item` CSS in `deferred.css` (which references these keyframes by name) will then animate correctly, and items will fade in to `opacity: 1`.

### Files modified

- `tailwind.config.ts` — add 7 missing animation registrations (keyframes already exist; just expose them)

### What this does NOT change

- No component logic, props, layout, or routing
- No new CSS, no design changes
- The `/team` route + `Team` link in Navbar are already correct — they just need to become visible

### Risk

Trivial. Tailwind config addition only. If anything, this restores intended behavior that was silently broken when these keyframes were moved from a raw CSS file into `tailwind.config.ts`.

### Verification after fix

Open Menu → all 3 columns show their items (Community, Learn, Events, Projects under Ecosystem; Resources, Blog, Education under Explore; **About, Team, Contributor Match, Join under Organization**). Clicking "Team" navigates to `/team`.

