

# Add Contributor Match to Navigation Dropdown

## Change
Add "Contributor Match" as a navigation item in the mega menu's **Organization** column (Column 3), alongside "Team" and "Join UTAAB". It will link to `/contributor-match` as a page navigation.

## File: `src/components/Navbar.tsx`
- Add `{ key: 'contributorMatch', type: 'page', path: '/contributor-match' }` to the Organization column array (around line 323), between "Team" and "Join"
- Uses existing `handleNavigate()` for page routing

## Translation Keys
- Add `nav.contributorMatch` to all 4 locale files (`en.json`, `tr.json`, `ru.json`, `ar.json`) with appropriate translations (e.g. "Contributor Match", "Katılımcı Eşleştirme", "Подбор роли", "مطابقة المساهمين")

## Impact
- No structural changes — just inserting one item into an existing array and adding translation strings

