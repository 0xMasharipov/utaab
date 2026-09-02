# Language selector refinement + mobile card parity

## 1. One shared language selector

Today the selector is written out twice — once in the main site navbar and once in the education navbar — with a third copy of the language list inside each mobile menu. Each copy has drifted slightly, so a fix in one place doesn't reach the others.

Replace all of them with a single shared component used everywhere. One list of languages, one behaviour, one look.

## 2. How it appears

- The dropdown opens **below the navbar pill**, clearly detached from it, instead of sitting on top of the bar. It stays anchored to the button and flips to stay on screen near the edges.
- Glassmorphic panel: frosted blur, soft translucent surface, hairline light border, subtle inner highlight and drop shadow — matching the navbar's own glass treatment rather than a flat menu.
- Smooth open and close: a short fade with a small rise and scale, easing out. Users who prefer reduced motion get an instant, non-animated open.
- The active language is marked with a filled pill and a checkmark, so it reads as selected rather than just hovered.
- Right-to-left (Arabic) alignment is handled in the shared component so it can't drift between navbars again.

## 3. Mobile clarity

- The trigger shows **flag + language code** (for example 🇬🇧 EN) at all sizes, so it's obvious on a phone that the control is for language. The globe icon stays as a secondary cue.
- The button gets a proper touch target (minimum 44px tall) and a spoken label like "Language: English".
- Inside the mobile menu, the language row keeps its heading and full names so it stays self-explanatory.

## 4. What We Build cards on mobile

Bring the mobile version of the What We Build cards in line with the desktop treatment: same index numeral, title, hairline and description hierarchy, same glass border, grid layer and artwork placement, scaled down for a narrow screen. Only the homepage feature cards change; the rest of the mobile layout stays as it is.

## 5. Load and performance

- The dropdown panel renders only while open, so it costs nothing on first paint.
- The language list and flag data become one module-level constant shared by all call sites instead of being rebuilt per render.
- Blur effects are kept to the panel itself and composited on the GPU, so opening the menu doesn't cause repaint jank on phones.
- The trigger reserves fixed width so switching language doesn't shift the navbar contents.

## Technical notes

- New `src/components/common/LanguageSelector.tsx` exporting the shared trigger + panel and a `LANGUAGES` constant; consumed by `src/components/Navbar.tsx` and `src/components/education/EducationNavbar.tsx`, and by both mobile menu panels.
- Built on the existing `DropdownMenu` primitives with `sideOffset` clearing the navbar pill height and `collisionPadding` for edge safety; portal content keeps its current stacking above the nav.
- Panel styling composed from the existing `glass-strong` utility plus tokens from `index.css` — no hardcoded color utilities.
- Animation uses the Radix `data-[state]` open/close classes already available in the project, gated by a `prefers-reduced-motion` check.
- Mobile card parity is a presentation-only change in `src/components/AboutBlurb.tsx`; no data, translation-key or logic changes.
- Verification: TypeScript check, then Playwright screenshots of the navbar with the selector open at 1280px and 390px, plus the `#about` section at both widths, and a console check for errors.
