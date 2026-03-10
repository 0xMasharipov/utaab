

# Localize All Hardcoded Content

## Summary of Hardcoded Strings Found

### 1. Navbar (`src/components/Navbar.tsx`)
- Line 210: `'CLOSE'` / `'MENU'` — hardcoded instead of using `t('nav.close')` / `t('nav.menu')`
- Line 258: `'Ecosystem'` fallback (already has i18n key with fallback — need to add `nav.ecosystem` key)
- Line 286: `'Explore'` fallback — need `nav.explore` key
- Line 313: `'Organization'` fallback — need `nav.organization` key

### 2. Contributor Match Page (`src/pages/ContributorMatch.tsx`)
- Line 51: `'Analysis complete!'`, `'Your contributor profile is ready.'`
- Line 54: `'Failed to analyze your profile. Please try again.'`

### 3. ContributorHero (`src/components/contributor/ContributorHero.tsx`)
- Line 30: `'AI-powered • Role matching • Contributor-focused'`
- Line 41-44: `'Find Your Best Position'`, `'in UTAAB'`
- Line 54: `'Answer a few smart questions...'`
- Line 69: `'Start Assessment'`
- Line 78: `'Learn How It Works'`

### 4. HowItWorks (`src/components/contributor/HowItWorks.tsx`)
- All step titles/descriptions hardcoded (lines 8-20)
- Line 34: `'How It Works'`
- Line 36: `'Three simple steps...'`
- Line 52: `'Step'`

### 5. AssessmentForm (`src/components/contributor/AssessmentForm.tsx`)
- Line 14: STEPS array: `'About You'`, `'Interests'`, `'Skills'`, `'Work Style'`, `'Motivation'`, `'Review'`
- Lines 16-22: All option arrays (TOPIC_INTERESTS, FREE_TIME, etc.) — hardcoded English
- All field labels (lines 231-303): `'Full Name'`, `'Email'`, `'University / Department'`, etc.
- All validation toasts (lines 173-207)
- Line 294: `'Review Your Responses'`
- All review labels (lines 296-303)
- Lines 315-348: Navigation buttons, submit button text

### 6. ContributorArchetypes (`src/components/contributor/ContributorArchetypes.tsx`)
- All archetype names, descriptions, roles (lines 6-42)
- Line 55: `'Where People Like You Thrive in UTAAB'`
- Line 57: `'Discover which archetype resonates with you.'`

### 7. ContributorCTA (`src/components/contributor/ContributorCTA.tsx`)
- Lines 19-23: Heading text, subtitle
- Line 31: `'Take the Assessment'`
- Line 42: `'Contact UTAAB'`

### 8. AssessmentResult (`src/components/contributor/AssessmentResult.tsx`)
- Line 57: `'Match'`
- Line 72: `'Analyzing your contributor profile...'`
- Line 73: `'Our AI is evaluating...'`
- Lines 104-107: `'Your Contributor Profile'`, `'Here's what our AI discovered...'`
- Lines 121, 130: `'Primary Match'`, `'Secondary Match'`
- Line 140: `'Profile Summary'`
- Line 148: `'Why This Role Fits You'`
- Line 155: `'Your Strengths'`
- Lines 171, 178, 187, 195: Section headers
- Line 204: `'Explore UTAAB'`

### 9. Education Pages
- `EducationSignIn.tsx` line 20, 28: `'Back to Education'`, `'Welcome back! Sign in...'`
- `EducationRegister.tsx` line 20: `'Back to Education'`
- `EducationNavbar.tsx` line 155: `'Admin'`, line 343: `'Close menu'`/`'Open menu'`, line 379: `'Mobile menu'`, line 400: `'Close menu'`, line 439: `'Main Site'`, line 455: `'Student Sign In'`, line 480: `'Profile'`, line 492: `'Sign Out'`

### 10. Blog Page (`src/pages/Blog.tsx`)
- Line 142: `'All'` filter button
- Line 164: `'Loading...'`

### 11. BlogPost (`src/pages/BlogPost.tsx`)
- Line 138: `'Post not found'`

### 12. NotFound (`src/pages/NotFound.tsx`)
- Lines 14-17: `'404'`, `'Oops! Page not found'`, `'Return to Home'`

### 13. Profile Page (`src/pages/Profile.tsx`)
- Line 139: `'Back to Education'`

## Implementation Plan

### Step 1: Add i18n keys to `en.json`
Add new sections:
- `contributor.*` — ~80 keys covering Hero, HowItWorks, AssessmentForm (steps, labels, options, validation), Archetypes, CTA, Result
- `nav.ecosystem`, `nav.explore`, `nav.organization`
- `blog.all`, `blog.loading`, `blog.postNotFound`
- `notFound.*` — 3 keys
- `education.backToEducation`, `education.signIn.welcomeBack`, `education.nav.mainSite`, `education.nav.profile`, `education.nav.signOut`, `education.nav.admin`, `education.nav.openMenu`, `education.nav.closeMenu`, `education.nav.mobileMenu`

### Step 2: Add same keys to `tr.json`, `ru.json`, `ar.json`
Translate all new keys into Turkish, Russian, and Arabic.

### Step 3: Update components to use `t()` calls
Replace all hardcoded strings with `t('key')` calls in:
- `Navbar.tsx` (MENU/CLOSE button text)
- All 6 contributor components
- `ContributorMatch.tsx`
- `EducationSignIn.tsx`, `EducationRegister.tsx`
- `EducationNavbar.tsx`
- `Blog.tsx`, `BlogPost.tsx`
- `NotFound.tsx`
- `Profile.tsx`

### Notes
- AssessmentForm option arrays (TOPIC_INTERESTS, etc.) will be converted from static arrays to functions that accept `t()` so they return localized strings
- The Navbar MENU/CLOSE will use `t('nav.menu').toUpperCase()` / `t('nav.close').toUpperCase()` pattern

### Files Modified (~16 files)
- `src/i18n/locales/en.json` — add ~120 new keys
- `src/i18n/locales/tr.json` — add ~120 translated keys
- `src/i18n/locales/ru.json` — add ~120 translated keys
- `src/i18n/locales/ar.json` — add ~120 translated keys
- `src/components/Navbar.tsx`
- `src/pages/ContributorMatch.tsx`
- `src/components/contributor/ContributorHero.tsx`
- `src/components/contributor/HowItWorks.tsx`
- `src/components/contributor/AssessmentForm.tsx`
- `src/components/contributor/ContributorArchetypes.tsx`
- `src/components/contributor/ContributorCTA.tsx`
- `src/components/contributor/AssessmentResult.tsx`
- `src/pages/education/EducationSignIn.tsx`
- `src/pages/education/EducationRegister.tsx`
- `src/components/education/EducationNavbar.tsx`
- `src/pages/Blog.tsx`
- `src/pages/BlogPost.tsx`
- `src/pages/NotFound.tsx`
- `src/pages/Profile.tsx`

