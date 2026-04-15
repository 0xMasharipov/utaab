

# Show Contributor Assessments in Admin Applicants Tab

## Summary
Merge `contributor_assessments` data into the Applicants tab alongside `community_applications`, so admins can see and manage both types of applicants in one unified view.

## Changes

### `src/pages/admin/AdminUsers.tsx`

1. **Fetch contributor assessments** in `fetchData()` — query `contributor_assessments` table, normalize each record into the same shape as community applicants with a `source` field:
   - Map `full_name`, `email`, `created_at` directly
   - Extract `form_data` fields for department-equivalent info (e.g. `trackInterest`, `weeklyHours`)
   - Extract AI result data (`ai_result`) for experience/role info
   - Set `status` to `'pending'` (contributor assessments have no status column)
   - Add `source: 'contributor'` vs `source: 'community'` to distinguish them

2. **Merge both lists** into the `applicants` state array, sorted by `created_at` descending

3. **Add a source badge** in the Applicants table — a small "Community" or "Contributor" badge next to each row so admins can tell them apart

4. **Add source filter** alongside the existing status filter — options: All Sources, Community, Contributor

5. **Update the Preview Dialog** to handle contributor assessments:
   - Show AI matching results (primary role, secondary role, match score) when `source === 'contributor'`
   - Show form data fields (university, strengths, motivations, work style) mapped from `form_data`
   - Show links (GitHub, LinkedIn, portfolio) from `form_data`

6. **Update stats card** — the Applicants count will naturally include both sources

7. **Update `filteredApplicants`** to also filter by source when selected

### No database or edge function changes needed
The `contributor_assessments` table already has admin SELECT RLS policy in place.

## Files Modified
- `src/pages/admin/AdminUsers.tsx` — Fetch, merge, display contributor assessments in Applicants tab

