

# Admin Panel Enhancements

Four changes requested: video upload in courses, contributor match results viewer, storage section with 20TB capacity display, and system metrics graph on the dashboard.

## 1. Video Upload in Course Section

The `CourseFormDialog` already has a `promo_video` field with `ImageUpload accept="video/*"`. This is functional. The request likely means adding a dedicated **lesson video upload** capability so admins can upload course lecture videos directly. 

**Changes:**
- Add a "Lesson Videos" section in `CourseFormDialog` or as a separate tab in `AdminCourses` where admins can upload videos per lesson
- Actually, since the video upload already exists in CourseFormDialog (promo_video field), we should enhance it to also allow uploading **course content videos** (lesson-level). Add a "Course Videos" upload section below the promo video with multi-file support and a list of uploaded videos.

**Files:** `src/components/admin/CourseFormDialog.tsx` — add a dedicated course video upload section with the existing `ImageUpload` component configured for `accept="video/*"`.

## 2. Contributor Match Results in Admin Panel

Create a new admin page `AdminContributorAssessments` that queries the `contributor_assessments` table and displays submissions with their AI results.

**Changes:**
- Create `src/pages/admin/AdminContributorAssessments.tsx` — table view of all assessments with columns: name, email, date, primary role match, score. Expandable rows to show full AI result details (strengths, growth paths, etc.)
- Add route in `App.tsx` under `/admin/contributors`
- Add sidebar item in `AdminLayout.tsx` with a `Sparkles` or `Users` icon labeled "Contributors"

**Files:** 
- New: `src/pages/admin/AdminContributorAssessments.tsx`
- Edit: `src/App.tsx` — add route
- Edit: `src/components/admin/AdminLayout.tsx` — add sidebar item

## 3. Storage/Media Section with 20TB Capacity

Enhance `AdminMedia` to show a storage usage bar at the top: used space (from `admin-stats` edge function's `contentMetrics.storageUsedGB`) out of 20TB total, with a visual progress bar.

**Changes:**
- Add a storage usage card at the top of `AdminMedia` that fetches stats from `admin-stats` and displays used/total with a progress bar (X GB / 20,480 GB)

**Files:** `src/pages/education/admin/AdminMedia.tsx`

## 4. System Metrics Graph on Dashboard

Add a Recharts `AreaChart` to the dashboard showing user registrations and enrollments over the last 7 days. The data will come from the existing `admin-stats` edge function — we need to add a `dailyMetrics` array to it.

**Changes:**
- Update `supabase/functions/admin-stats/index.ts` to query daily registration and enrollment counts for the last 7 days
- Add a "System Metrics" section in `AdminDashboard.tsx` with a Recharts `AreaChart` showing users and enrollments per day

**Files:**
- Edit: `supabase/functions/admin-stats/index.ts` — add daily metrics query
- Edit: `src/pages/admin/AdminDashboard.tsx` — add chart section using `recharts`

## Summary of All Files

| File | Action |
|------|--------|
| `src/components/admin/CourseFormDialog.tsx` | Add dedicated video upload section |
| `src/pages/admin/AdminContributorAssessments.tsx` | **New** — contributor results table |
| `src/App.tsx` | Add `/admin/contributors` route |
| `src/components/admin/AdminLayout.tsx` | Add "Contributors" sidebar item |
| `src/pages/education/admin/AdminMedia.tsx` | Add storage capacity bar (20TB) |
| `supabase/functions/admin-stats/index.ts` | Add daily metrics data |
| `src/pages/admin/AdminDashboard.tsx` | Add system metrics chart |

