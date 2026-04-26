## What I found

I checked every page directly linked from the footer's **Learn** column (Learning Hub, Guides, Resources, Whitepaper, FAQ) by switching the site to Turkish and inspecting each one. They are all fully localized — every visible string translates correctly.

The actual gap is one click deeper: from the **Learning Hub** page, the *"Structured Courses"* path links to `/education` (the UTAAB EDU sub-platform). The EDU platform and its components still contain a lot of hardcoded English strings, which is what looks "non-localized" when you click through from the footer.

## Files with hardcoded English to fix

### Public-facing pages (high priority)
- `src/pages/education/EducationHome.tsx` — `"UTAAB EDU · Learn Web3"` badge, `"Browse Catalog"` button.
- `src/pages/education/CourseDetail.tsx` — toast titles/descriptions (`"Authentication required"`, `"Please sign in to enroll in courses"`).
- `src/pages/education/UserProfile.tsx` — toast messages, fallback `"Untitled Course"`, `"Continue Learning"` / `"Review"` button labels.
- `src/components/education/CourseReviews.tsx` — 16 hardcoded strings (validation errors, toast titles, button labels like `"Edit Review"` / `"Write a Review"`, `"Sign in required"`, `"Enrollment required"`, etc.).
- `src/components/education/CutiiAIPanel.tsx` — toast messages (`"Sign in required"`, `"Please sign in to use the AI assistant"`).
- `src/components/education/ExternalCourseCard.tsx` — difficulty labels (`"Beginner"`, `"Intermediate"`, `"Advanced"`).

### Admin (kept English by convention — out of scope)
- `src/pages/education/AdminDashboard.tsx`, `src/pages/education/admin/*` — admin-only, English-only per existing project convention.

## Approach

1. **Add new keys** under a single `education.*` sub-namespace in `src/i18n/locales/en.json`, then mirror them into `tr.json`, `ru.json`, and `ar.json` using the AI gateway (`google/gemini-2.5-pro`) for natural translations consistent with the existing tone.
   - `education.home.browse_catalog`, `education.home.hero_badge`
   - `education.course.auth_required.title|description`
   - `education.profile.toast.*`, `education.profile.untitled_course`, `education.profile.continue|review`
   - `education.reviews.*` (sign-in required, enrollment required, verification required, write/edit review, validation errors)
   - `education.cutii.auth_required.title|description`
   - `education.levels.beginner|intermediate|advanced` (already exists for some — will reuse)

2. **Replace hardcoded literals** in the listed `.tsx` files with `t('education.…')` calls, using `useTranslation()` (already imported in all of them).

3. **Verify** by switching the site to TR/RU/AR and visiting `/education`, `/education/courses`, `/education/course/<slug>`, and the user profile to confirm every visible string translates and RTL layout (AR) still looks right.

## Out of scope

- Education **admin** dashboards (`AdminDashboard`, `admin/*`) — kept English per existing project convention.
- Internal validation strings thrown as `Error('Not authenticated')` etc. — those are developer-facing, not shown to users.
- Workshops page (already fully localized).

## Files to be modified

- `src/i18n/locales/en.json`, `tr.json`, `ru.json`, `ar.json` — add new keys under `education.*`.
- `src/pages/education/EducationHome.tsx`
- `src/pages/education/CourseDetail.tsx`
- `src/pages/education/UserProfile.tsx`
- `src/components/education/CourseReviews.tsx`
- `src/components/education/CutiiAIPanel.tsx`
- `src/components/education/ExternalCourseCard.tsx`
