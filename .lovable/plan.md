

# Step 2: Replace Hardcoded Strings with `t()` Calls

All i18n keys were added in Step 1. Now we update ~15 component files to use them.

## Files to Modify

### 1. `src/components/Navbar.tsx` (line 210)
- Replace `'CLOSE'` / `'MENU'` with `t('nav.close').toUpperCase()` / `t('nav.menu').toUpperCase()`

### 2. `src/pages/ContributorMatch.tsx`
- Add `useTranslation` import and hook
- Replace toast strings with `t('contributor.toast.*')` keys

### 3. `src/components/contributor/ContributorHero.tsx`
- Add `useTranslation`, replace all hardcoded strings with `t('contributor.hero.*')`

### 4. `src/components/contributor/HowItWorks.tsx`
- Add `useTranslation`, convert static `steps` array to use `t('contributor.howItWorks.*')`

### 5. `src/components/contributor/AssessmentForm.tsx`
- Add `useTranslation` hook
- Convert `STEPS` from static array to function using `t('contributor.form.steps.*')`
- Convert all option arrays (`TOPIC_INTERESTS`, `FREE_TIME`, etc.) to use translated values from `t('contributor.form.topicOptions.*')`, etc.
- Replace all `FieldLabel` text, `placeholder` text, validation `toast` messages, review labels, button text with `t()` calls
- The option arrays will become functions called inside the component that return localized arrays

### 6. `src/components/contributor/ContributorArchetypes.tsx`
- Add `useTranslation`, replace archetype data with `t('contributor.archetypes.*')` calls

### 7. `src/components/contributor/ContributorCTA.tsx`
- Add `useTranslation`, replace heading/subtitle/button text with `t('contributor.cta.*')`

### 8. `src/components/contributor/AssessmentResult.tsx`
- Add `useTranslation`, replace all section headers, loading text, button text with `t('contributor.result.*')`

### 9. `src/pages/education/EducationSignIn.tsx`
- Replace `'Back to Education'` with `t('educationNav.backToEducation')`
- Replace welcome subtitle with `t('educationNav.welcomeBack')`

### 10. `src/pages/education/EducationRegister.tsx`
- Replace `'Back to Education'` with `t('educationNav.backToEducation')`

### 11. `src/components/education/EducationNavbar.tsx`
- Replace `'Admin'` (line 155) with `t('educationNav.admin')`
- Replace `'Close menu'`/`'Open menu'` aria-labels with `t('educationNav.*')`
- Replace `'Mobile menu'` aria-label
- Replace `'Main Site'` (lines 264, 439) with `t('educationNav.mainSite')`
- Replace `'Student Sign In'` (line 455) with `t('educationNav.studentSignIn')`
- Replace `'Profile'` (line 480) with `t('educationNav.profile')`
- Replace `'Sign Out'` (lines 324, 492) with `t('educationNav.signOut')`

### 12. `src/pages/Blog.tsx`
- Replace `'All'` (line 142) with `t('blog.all', 'All')`
- Replace `'Loading...'` (line 164) with `t('blog.loading', 'Loading...')`

### 13. `src/pages/BlogPost.tsx`
- Replace `'Post not found'` (line 138) with `t('blog.postNotFound', 'Post not found')`

### 14. `src/pages/NotFound.tsx`
- Add `useTranslation`, replace `'404'`, `'Oops! Page not found'`, `'Return to Home'` with `t('notFound.*')`

### 15. `src/pages/Profile.tsx`
- Replace `'Back to Education'` with `t('profile.backToEducation')`
- Replace tab labels (`Overview`, `Courses`, etc.) with `t('profile.*')`
- Replace stat labels (`Enrolled`, `Completed`, `In Progress`) with `t('profile.*')`

## Notes
- AssessmentForm is the most complex change: static option arrays at module level will be moved inside the component as functions that use `t()`
- All components already have react-i18next available except contributor components and NotFound which need the import added

