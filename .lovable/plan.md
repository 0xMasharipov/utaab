
## Fix navbar dropdown text disappearing

### Root cause
The dropdown item text depends on classes defined in `src/styles/deferred.css`:

- `.nav-menu-item { opacity: 0; animation: nav-menu-item-enter ... }`
- `.nav-menu-enter { ... }`
- `.lang-transition`, `.lang-transitioning`

But that stylesheet is only loaded inside `src/pages/Index.tsx` via `import('@/styles/deferred.css')` in a `useEffect`.

That creates two problems:
1. On the homepage, the menu can open before the deferred CSS finishes loading.
2. On all other pages (`/about`, `/team`, `/blog`, etc.), the navbar renders without those shared navbar classes being guaranteed at all.

So the dropdown ends up with incomplete animation/text styles and the menu text can disappear.

### Plan
1. Move the navbar-critical classes out of deferred loading.
   - Make `nav-menu-enter`, `nav-menu-item`, `lang-transition`, and `lang-transitioning` available in the main global CSS path (`src/index.css`), since the navbar is site-wide and above-the-fold.
2. Keep only truly below-fold / non-critical styles in `src/styles/deferred.css`.
   - Leave things like carousel/grid/other deferred utilities there if they are not needed immediately.
3. Preserve current behavior.
   - Keep the same animations, delays, reduced-motion fallback, and existing visual design.
4. Audit for duplication/conflicts.
   - Ensure these shared classes are defined in one place only after the move, so there is no override mismatch between main CSS and deferred CSS.

### Files to update
- `src/index.css` — add the navbar-critical shared classes
- `src/styles/deferred.css` — remove the moved navbar/language classes or keep only non-critical utilities
- `src/pages/Index.tsx` — keep deferred import only for below-fold styling, not navbar-critical behavior

### Expected result
- Navbar dropdown text is visible immediately on `/`
- Same fix works consistently on `/about`, `/team`, `/blog`, and other pages using the same Navbar
- No more race condition where menu opens before its CSS exists

### Risk
Very low. This is a CSS-loading fix, not a layout or routing change.
