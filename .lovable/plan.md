
## Migrate Static CSS Animations to Tailwind + TS-Driven Logic

### Current state

The project already uses **Tailwind CSS + TypeScript** as the foundation. However, there are two `.css` files carrying overhead:

1. **`src/App.css`** (~40 lines) — **completely unused**. Leftover from Vite scaffolding (logo spin animations, `.read-the-docs`, etc.). Not imported anywhere meaningful.
2. **`src/styles/deferred.css`** (~200 lines) — contains hand-written keyframes and utilities, several of which **duplicate Tailwind config** or could be moved into `tailwind.config.ts` so Tailwind's JIT compiler only ships what's actually used (tree-shaking).

### What this plan does

**Step 1 — Delete dead CSS**
- Remove `src/App.css` entirely (zero usages confirmed via search).
- Saves a small bundle + one less HTTP parse.

**Step 2 — Move reusable keyframes into `tailwind.config.ts`**

Migrate these from `deferred.css` into Tailwind's `theme.extend.keyframes` / `animation` so they become tree-shakeable utility classes:

| Currently in deferred.css | Becomes Tailwind utility |
|---|---|
| `@keyframes hero-carousel-scroll` | `animate-carousel-scroll` |
| `@keyframes nav-menu-enter` | `animate-nav-enter` |
| `@keyframes nav-menu-item-enter` | `animate-nav-item-enter` |
| `@keyframes lang-text-swap` | `animate-lang-swap` |
| `@keyframes float` | `animate-float` (consolidate; already partial) |
| `@keyframes glow` | `animate-glow` |
| `@keyframes blob-fade-in` | `animate-blob-fade` |
| `@keyframes mobile-hero-pulse` | `animate-mobile-hero-pulse` |

Result: only the keyframes actually referenced in JSX get included in the final CSS bundle. Unused ones are tree-shaken.

**Step 3 — Keep what truly belongs in CSS**

These stay in `deferred.css` because they can't be expressed cleanly in Tailwind utilities:
- `.bg-technical-grid` (complex layered linear-gradients)
- `.bg-grain` (inline SVG data URI)
- Native video control hiding (`::-webkit-media-controls-*`)
- `.cv-auto` (already added — `content-visibility` not in Tailwind)
- `.scrollbar-hide`, `.pb-safe` (browser-specific)
- `prefers-reduced-motion` overrides (media-query-scoped rules)

**Step 4 — Convert remaining inline component styles where it helps**
- `BrandText.tsx`, `GlassCard.tsx` — already pure Tailwind, no change needed
- Audit `Hero.tsx` for any inline `style={{}}` blocks that could be Tailwind classes (reduces runtime style recalc)

### Files to modify

- **Delete**: `src/App.css`
- **Edit**: `tailwind.config.ts` — add 8 keyframes + 8 animation utilities
- **Edit**: `src/styles/deferred.css` — remove the migrated keyframes, keep the genuinely CSS-only rules
- **Edit (search-and-replace class names)**: any component using the old class names (e.g. `hero-carousel-track` → `animate-carousel-scroll` on the relevant element). Components touched will be limited to: `HeroCarousel.tsx`, `Navbar.tsx`, components using `lang-transitioning`.

### Expected outcome

- **Bundle size**: ~3-5 KB CSS reduction (App.css gone + tree-shaken unused keyframes)
- **Runtime**: fewer style recalculations (Tailwind's atomic classes are cheaper than custom keyframe lookups)
- **Maintainability**: single source of truth for animations (tailwind.config.ts)
- **No visual change**: every animation behaves identically — same duration, easing, keyframes
- **No functional change**: pure refactor

### What this plan does NOT do

- Doesn't touch component logic, behavior, props, or state
- Doesn't change visual design, colors, spacing, animations' look
- Doesn't migrate `index.css` (contains the design system tokens — must stay)
- Doesn't touch the recently-optimized images/videos

### Risk

- **Low**. The migration is mechanical: same `@keyframes` definitions move from raw CSS into Tailwind config. Any class-name rename is search-and-replaced atomically. If a class is missed, the animation simply won't fire — caught instantly in preview.
