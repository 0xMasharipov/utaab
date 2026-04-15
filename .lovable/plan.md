

# Redesign About Page — Full Content & Structure

## Summary
Replace the current minimal About page with a comprehensive, multi-section page matching the provided content structure. Reuse the existing TeamPage's overlapping card layout (with modal/drawer profiles) directly on the About page. All text goes through i18n for 4-language support.

## Page Sections (in order)

1. **Hero** — Bold headline "Not Just a Community. Building Real-World Impact." + supporting paragraph
2. **Why UTAAB** — 4 short statements in a stacked layout with subtle glass cards
3. **Mission & Vision** — Side-by-side glass cards (similar to current but with new copy)
4. **What We Actually Do** — 4 icon cards: Educate, Build, Connect, Support
5. **Real-World Impact** — Intro line + visual cards for Projects/Initiatives/Outcomes
6. **Team** — Reuse TeamOverlapCard grid + TeamProfileModal/Drawer (same as TeamPage)
7. **Closing CTA** — "Be Part of the Future We're Building" + two buttons

## Files Modified

### `src/pages/About.tsx` — Full rewrite
- Import TeamOverlapCard, TeamProfileModal, TeamProfileDrawer, useIsMobile
- Import team member images and data (same array as TeamPage)
- 7 sections as described above
- All text via `t('aboutPage.xxx')` keys

### `src/i18n/locales/en.json` — Add `aboutPage` namespace
New keys under `aboutPage`:
- `hero.title`, `hero.subtitle`
- `whyUtaab.title`, `whyUtaab.items` (array of 4 statements)
- `mission.title`, `mission.text`, `vision.title`, `vision.text`
- `whatWeDo.title`, `whatWeDo.educate.*`, `whatWeDo.build.*`, `whatWeDo.connect.*`, `whatWeDo.support.*`
- `impact.title`, `impact.subtitle`, `impact.projects.*`, `impact.initiatives.*`, `impact.outcomes.*`
- `cta.title`, `cta.joinButton`, `cta.exploreButton`

### `src/i18n/locales/tr.json`, `ru.json`, `ar.json` — Same keys (translated)

### No changes to:
- TeamPage, Team component, admin panel, database, routing (route already exists)
- TeamOverlapCard, TeamProfileModal, TeamProfileDrawer components

## Technical Notes
- Team section on About page uses the same overlapping card pattern as `/team` — clicking opens modal (desktop) or drawer (mobile) with LinkedIn links
- All new text content is parameterized through i18n, editable via admin Translation Editor
- Icons: GraduationCap (Educate), Wrench (Build), Network (Connect), Heart (Support)
- Uses existing GlassCard, GlassSectionWrapper, AnimatedBlobBackground components

