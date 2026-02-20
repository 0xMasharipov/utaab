
# Update MIT Logo and University Name

## Overview
Replace the current SVG MIT logo with the uploaded PNG logo image, and update the university name from "MIT Sloan School of Management" to "MIT - Massachusetts Institute of Technology" across all locale files and the external course data.

## Changes

### 1. Copy Uploaded Logo to Project
Copy `user-uploads://MIT_UNI_LOGO.png` to `src/assets/MIT_UNI_LOGO.png` for use as an imported asset in React components.

### 2. Update BlockchainAndMoney Page (`src/pages/education/BlockchainAndMoney.tsx`)
Replace the `<img src="/images/mit-logo.svg">` reference with an ES6 import of the new PNG logo:
- Add `import mitLogo from '@/assets/MIT_UNI_LOGO.png';` at the top
- Change `src="/images/mit-logo.svg"` to `src={mitLogo}`

### 3. Update University Name in All 4 Locale Files
Change the `schoolName` key under `education.mitOcw`:

| Locale | Before | After |
|--------|--------|-------|
| `en.json` | MIT Sloan School of Management | MIT - Massachusetts Institute of Technology |
| `tr.json` | MIT Sloan Yonetim Okulu | MIT - Massachusetts Teknoloji Enstitusu |
| `ar.json` | MIT Sloan School of Management | MIT - معهد ماساتشوستس للتكنولوجيا |
| `ru.json` | MIT Sloan School of Management | MIT - Массачусетский технологический институт |

### 4. Update External Course Data (`src/data/externalCourses.ts`)
Update the `subtitle_*` fields which reference the school name, changing from "MIT OpenCourseWare - Prof. Gary Gensler" pattern (no change needed here since subtitles reference the program not the school name -- these remain as-is).

## Files Modified

| File | Change |
|------|--------|
| `src/assets/MIT_UNI_LOGO.png` | New file (copied from upload) |
| `src/pages/education/BlockchainAndMoney.tsx` | Import and use new PNG logo |
| `src/i18n/locales/en.json` | Update schoolName |
| `src/i18n/locales/tr.json` | Update schoolName |
| `src/i18n/locales/ar.json` | Update schoolName |
| `src/i18n/locales/ru.json` | Update schoolName |
