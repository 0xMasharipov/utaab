

# Add Abdulbaki Image and 5 New Team Members

## Overview
Add the uploaded photo for Abdulbaki Karaman (who currently has no image), and add 5 new team members with their uploaded photos and descriptions.

## Image Assets
Copy 6 uploaded images to `src/assets/team/`:
- `UTAAB_P_Abdulbaki.png` → `src/assets/team/abdulbaki.png`
- `UTAAB_P_Yana.png` → `src/assets/team/yana.png`
- `UTAAB_P_Shuayb.png` → `src/assets/team/shuayb.png`
- `UTAAB_P_Shuayb_1.png` → `src/assets/team/ibrahim.png` (Ibrahim's photo)
- `UTAAB_P_Burak.png` → `src/assets/team/burak.png`
- `UTAAB_P_Anar.png` → `src/assets/team/anar.png`

**Note:** The user uploaded `UTAAB_P_Shuayb_1.png` which appears to be a different person than `UTAAB_P_Shuayb.png` — this is likely Ibrahim Hasanli's photo based on upload order matching the member list.

## Code Changes

### 1. `src/components/Team.tsx` (homepage team section)
- Import `abdulbakiImg` and add `image: abdulbakiImg` to the abdulbaki entry
- Add 5 new members to the `teamMembers` array with their imported images:
  - `yana` (Front-End Developer)
  - `shuayb` (Full-Stack Developer)
  - `ibrahim` (Social Media)
  - `burak` (Event Coordinator)
  - `anar` (HR and Coordinator)

### 2. `src/pages/TeamPage.tsx` (dedicated team page)
- Same imports and member additions as above
- Add appropriate tags: `Engineering`, `Engineering`, `Marketing`, `Operations`, `Operations`

### 3. Translation files — add 5 new member entries in all 4 languages

**`src/i18n/locales/en.json`** — add yana, shuayb, ibrahim, burak, anar with the English descriptions provided.

**`src/i18n/locales/tr.json`** — add Turkish translations for all 5 new members.

**`src/i18n/locales/ru.json`** — add Russian translations for all 5 new members.

**`src/i18n/locales/ar.json`** — add Arabic translations for all 5 new members.

## Files Modified
| File | Change |
|------|--------|
| `src/assets/team/` | 6 new image files |
| `src/components/Team.tsx` | Add abdulbaki image + 5 new members |
| `src/pages/TeamPage.tsx` | Add abdulbaki image + 5 new members |
| `src/i18n/locales/en.json` | Add 5 member translation entries |
| `src/i18n/locales/tr.json` | Add 5 member translation entries |
| `src/i18n/locales/ru.json` | Add 5 member translation entries |
| `src/i18n/locales/ar.json` | Add 5 member translation entries |

