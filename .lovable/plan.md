

# Localize Educational Guides & Workshops Pages

## Problem
Both `EducationalGuides.tsx` and `Workshops.tsx` have all content hardcoded in English with no `useTranslation` integration.

## Changes

### 1. Add translation keys to all 4 locale files
Add new `guides` and `workshops` key groups under the existing `learn` namespace.

**~80 new keys per locale** covering:
- **Guides hero**: badge, title, subtitle, description
- **Section headers**: "Start Here", "Ethereum Fundamentals", "Build & Explore" (title + subtitle each)
- **18 guide cards**: title + description each (36 keys)
- **Difficulty badges**: "Beginner", "Intermediate", "Advanced"
- **UI labels**: "Read Guide", "Visit Resource", read time suffix
- **3 ecosystem resources**: name + description each
- **Ecosystem section**: title + subtitle
- **6 journey steps** + journey title + subtitle
- **Workshops page**: title, subtitle, coming soon badge, description lines

### 2. Refactor `EducationalGuides.tsx`
- Import `useTranslation`
- Convert card arrays from constants to functions that use `t()` calls
- Replace all hardcoded strings in hero, section headers, ecosystem resources, and journey steps with `t()` keys
- Pass `t` to `Section` component or make cards dynamic

### 3. Refactor `Workshops.tsx`
- Import `useTranslation`
- Replace 5 hardcoded strings with `t()` calls

### Files Modified
- `src/pages/learn/EducationalGuides.tsx`
- `src/pages/learn/Workshops.tsx`
- `src/i18n/locales/en.json`
- `src/i18n/locales/tr.json`
- `src/i18n/locales/ru.json`
- `src/i18n/locales/ar.json`

