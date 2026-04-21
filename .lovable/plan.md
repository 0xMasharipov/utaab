

## Update Mehmet BARUK image + reorder team

### Changes

**1. Replace asset**
- Overwrite `src/assets/team/mehmet-baruk.png` with the new uploaded image (`user-uploads://Mehmet_Baruk_2.png`).

**2. Reorder `src/pages/TeamPage.tsx` `teamMembers` array**

New order:
1. `mehmetBaruk` — Advisory ← **moved to first**
2. `zinurbek` — Founder
3. `yunus` — Leadership
4. `abdulla` — Engineering
5. `abdulbaki` — Operations
6. `umut` — Operations
7. `anar` — Operations
8. `burak` — Operations ← **moved up to right after Anar**
9. `yana` — Engineering
10. `shuayb` — Engineering
11. `ibrahim` — Marketing

**3. Apply identical reorder to `src/components/Team.tsx`** (homepage section) so both grids stay in sync.

### Untouched
- i18n copy, tags, LinkedIn links, card/modal/drawer components, styles, animations, DB.

### Risk: very low
Asset swap + array reorder in two files. No logic changes.

