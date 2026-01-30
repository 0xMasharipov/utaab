
# Delete Subtitle Page from Admin Panel

## Overview

Remove the subtitle management page from the admin panel, including its route, navigation item, and page component.

## Changes Required

### 1. Remove Route and Import from App.tsx

**File:** `src/App.tsx`

Remove:
- Line 38: The lazy import for `AdminSubtitles`
- Line 85: The route definition `<Route path="subtitles" element={<AdminSubtitles />} />`

### 2. Remove Sidebar Navigation Item from AdminLayout.tsx

**File:** `src/components/admin/AdminLayout.tsx`

Remove:
- Line 19: The `Subtitles` icon import from lucide-react
- Line 35: The sidebar navigation item `{ icon: Subtitles, label: 'Subtitles', path: '/admin/subtitles' }`

### 3. Delete the Page Component

**File to delete:** `src/pages/admin/AdminSubtitles.tsx`

This entire file (297 lines) will be removed.

---

## Summary

| Action | File | Description |
|--------|------|-------------|
| Edit | `src/App.tsx` | Remove import and route |
| Edit | `src/components/admin/AdminLayout.tsx` | Remove icon import and sidebar item |
| Delete | `src/pages/admin/AdminSubtitles.tsx` | Remove entire file |

## Impact

- The `/admin/subtitles` route will no longer be accessible
- The "Subtitles" link will be removed from the admin sidebar
- No other features depend on this page

Note: The subtitle VTT files in `/public/subtitles/` and the database tables (`subtitle_jobs`, `lecture_subtitles`) will remain intact. Only the admin UI for managing subtitles will be removed.
