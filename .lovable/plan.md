

## Add Mehmet BARUK to the Team

### Discovery

The Team page (`/team`) is rendered from a **hardcoded `teamMembers` array** in `src/pages/TeamPage.tsx` plus matching i18n keys in `src/i18n/locales/{en,tr,ru,ar}.json` under `team.members.*`. The homepage `Team.tsx` component uses the same i18n keys. The DB `team_members` table exists but isn't used by these pages, so we add Mehmet the same way the other 10 members are added.

### Changes

**1. New asset**
- Copy `user-uploads://Mehmet_Baruk_1.png` → `src/assets/team/mehmet-baruk.png`

**2. `src/pages/TeamPage.tsx`**
- Import `mehmetBarukImg from '@/assets/team/mehmet-baruk.png'`
- Add as the **2nd entry** (right after Zinurbek / Founder, before Yunus / Leadership) so the Advisory role sits near the top of the hierarchy:
  ```ts
  { key: 'mehmetBaruk', image: mehmetBarukImg, tag: 'Advisory' }
  ```
  No LinkedIn provided — leave it off (button hides automatically).

**3. `src/components/Team.tsx` (homepage section)**
- Same import + insert `{ key: 'mehmetBaruk', image: mehmetBarukImg }` in the same position so the homepage grid matches.

**4. i18n — add `team.members.mehmetBaruk` to all 4 locales** (`en`, `tr`, `ru`, `ar`):
- **en**:
  - name: `Mehmet BARUK`
  - position: `Strategic Vision Advisor`
  - description: `Mehmet BARUK serves as a strategic compass, helping accelerate UTAAB's mission. He provides strategic guidance and deep technical mentorship to build scalable and sustainable ecosystems.` (typo "povides" → "provides" fixed)
- **tr / ru / ar**: human-quality translations matching the tone used for other members' bios in those locales.

### Files touched

- **New:** `src/assets/team/mehmet-baruk.png`
- **Modified:** `src/pages/TeamPage.tsx`, `src/components/Team.tsx`, `src/i18n/locales/en.json`, `src/i18n/locales/tr.json`, `src/i18n/locales/ru.json`, `src/i18n/locales/ar.json`

### Untouched

DB `team_members` table, card/modal/drawer components, animations, ordering of other members, styles.

### Risk: very low
Pure additive — one new entry, one new asset, four translation blocks. Same pattern as the existing 10 members.

