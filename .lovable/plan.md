

# Add Translation Content JSON Editor to Admin Localization Tab

## Summary
Add a JSON editor section to the Localization tab in Admin Settings where admins can view and edit the translation content for each language (EN, TR, RU, AR) directly from the admin panel.

## Changes

**File:** `src/pages/admin/AdminSettingsNew.tsx`

In the Localization `TabsContent` (after the existing Language Settings card, line ~487), add a new card titled "Translation Content" with:

1. A language selector dropdown to pick which locale to edit (EN/TR/RU/AR)
2. A collapsible/accordion list of all top-level translation sections (nav, auth, hero, community, learn, events, projects, resources, join, footer, education, blog, etc.)
3. Each section expands to show a JSON textarea pre-filled with the current content from the corresponding locale file
4. An "Apply Changes" button that updates the i18n resources in-memory via `i18next.addResourceBundle()`
5. A note explaining that changes are session-only unless exported (since locale files are static JSON bundled at build time)

**Implementation details:**
- Import the 4 locale JSON files directly (`en.json`, `tr.json`, `ru.json`, `ar.json`)
- Use `Accordion` component for each top-level key section
- Each accordion item contains a `Textarea` with `JSON.stringify(section, null, 2)` as the value
- On edit, parse the JSON and validate before allowing save
- Use `i18n.addResourceBundle(locale, 'translation', mergedData, true, true)` to apply changes live
- Show validation error toast if JSON is malformed

