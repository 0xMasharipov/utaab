# Student progress tracking, completion message, and sign-in prompt

## Current state (verified)

- The database has zero courses, zero lessons, zero enrollments and zero lesson progress rows. The enrollment/progress/certificate machinery exists in code but has no content behind it, so nothing is being tracked today.
- The only course students actually watch is the MIT "Blockchain and Money" page (24 lectures). It saves nothing but the last-viewed lecture number in the browser, has no sign-in requirement, and no completion state.
- 18 student profiles exist, so real users are watching without any progress being recorded.

## What will be built

### 1. Make MIT "Blockchain and Money" a real course

Seed the course record and its 24 lessons (title, description, duration, video URL, order) from the existing lecture data, marked free and published. From then on, the same enrollment and progress system used everywhere else applies to it.

### 2. Progress tracking on the lecture page

- A signed-in student is auto-enrolled the first time they play a lecture.
- Watch progress per lecture is saved continuously (roughly every 10 seconds and on pause/leave), and a lecture counts as complete at 95% watched.
- Returning to the page resumes at the last lecture and the position within it.
- The lecture playlist shows completed check marks and a course progress bar ("7 of 24 lectures complete").

### 3. Completion message for the free course

When the last lecture is completed:

- A dialog and a persistent banner appear: "Your certificate is on the way — we're working on it to improve our services."
- An in-app notification is created for the student.
- The completion is recorded so admins see who is waiting. A new "certificate requests" record is created (student, course, completion date, status pending/issued) and surfaced in the education admin overview as a "Pending certificates" list with a count badge.
- No blockchain certificate is auto-issued by this flow; it stays a manual admin step.

### 4. Sign-in prompt for signed-out viewers

- A signed-out visitor can start watching. After 60 seconds of playback the video pauses and a dismissible dialog appears: "Register or sign in to save your progress and earn your certificate", with Register and Sign in buttons that return to the same lecture afterwards.
- If dismissed, it does not reappear during that session; a small inline "progress not being saved" hint stays under the player.
- Fully translated in EN/TR/RU/AR.

## Technical notes

- Seed data via data-insert queries (course + 24 lessons) from `src/data/mitOcwLectures.ts`; store the MIT lecture id in `order_index` so the existing `?lecture=` deep links keep working.
- New table `public.certificate_requests` (user_id, course_id, status, requested_at, notes) with RLS: students read their own rows, admins read/update all, plus the required grants. Insert happens server-side.
- Extend the existing `issue-course-certificate` edge function (or add a sibling) so course completion records a pending certificate request and a notification instead of failing silently; keep the current server-side completion verification.
- `AppleStyleVideoPlayer` gains optional `onProgress`, `startAt` and `gate` props; the tracking logic lives in `BlockchainAndMoney.tsx` so the player stays presentational.
- Progress writes use `lesson_progress` upserts keyed on user + lesson, throttled client-side.
- Admin surface added to `src/pages/education/admin/AdminOverview.tsx`.
