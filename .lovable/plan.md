

# Transform Community Section into CTA Section

## Summary
Replace the informational Community section with a bold, conversion-focused CTA block — "Join the Movement" — with 3 action buttons, a subtle glow background, and i18n support.

## Changes

### `src/components/Community.tsx` — Full rewrite

Replace all content with:

- **Headline**: "Join the Movement" (via `community.cta.title` i18n key)
- **Subtext**: "Be part of a new generation building real-world impact through collaboration, innovation, and Web3 education." (via `community.cta.subtitle`)
- **3 CTA buttons** in a centered flex row:
  1. **Join Community** — links to `/#join` (scrolls to existing Join form), styled as primary glass pill with glow
  2. **Explore Projects** — links to `/#projects`, styled as outline glass pill
  3. **Follow Updates** — links to `/blog`, styled as subtle ghost pill
- **Background**: subtle radial gradient glow (accent blue, low opacity) positioned behind the content — CSS only, no heavy animation
- **Preserve**: `id="community"` for navbar scroll targeting, `useInView` for entrance animation, `useTranslation` for i18n, `useLanguageTransition` for text swap animations

### `src/i18n/locales/en.json` — Add new keys
```json
"community.cta.title": "Join the Movement",
"community.cta.subtitle": "Be part of a new generation building real-world impact through collaboration, innovation, and Web3 education.",
"community.cta.joinBtn": "Join Community",
"community.cta.projectsBtn": "Explore Projects",
"community.cta.updatesBtn": "Follow Updates"
```

### `src/i18n/locales/tr.json`, `ar.json`, `ru.json` — Add translated keys
Add equivalent translations for the 5 new keys in each locale file.

### Visual spec
- Section padding: `py-24 md:py-36` (generous whitespace)
- Background: `radial-gradient(ellipse at 50% 50%, hsl(var(--accent)/0.08), transparent 70%)` as a pseudo-element
- Headline: `text-4xl md:text-6xl font-bold text-glow-soft`
- Subtext: `text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto`
- Buttons row: `flex flex-wrap justify-center gap-4 mt-10`
- Primary button: same glass style as the refined AboutBlurb button with accent glow
- Secondary/tertiary: lighter glass variants

### Not modified
- `Index.tsx` — no changes, `<Community />` stays in place
- No other sections, styles, backend, or admin logic touched

## Files Modified
- `src/components/Community.tsx`
- `src/i18n/locales/en.json`
- `src/i18n/locales/tr.json`
- `src/i18n/locales/ar.json`
- `src/i18n/locales/ru.json`

