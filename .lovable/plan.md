

# Localize All Hardcoded English Content

## Summary
Add i18n support to 9 components with hardcoded English strings and add the corresponding translation keys to all 4 locale files (EN, TR, RU, AR).

## Components to Localize

### 1. Profile Sub-Components (7 files)
All in `src/components/profile/`:

| File | Hardcoded strings |
|------|------------------|
| `ProfileOverview.tsx` | "About", "Not specified", "Joined", "Language:", "Focus Areas", "Recent Activity", "No recent activity" |
| `ProfileSettings.tsx` | "Account Settings", "Profile Information", "Full Name", "Department", "Email Preferences", "Course Updates", "Newsletters", "Marketing Emails", "Save Changes", "Saving...", toast messages |
| `ProfileCertificates.tsx` | "No certificates yet", "Complete courses to earn certificates", "My Certificates", "Your earned certifications", "Issued:", "Download", "Verify" |
| `ProfileCourses.tsx` | "No courses yet", "Start learning...", "Browse Courses", "My Courses", "Track your learning progress", "Progress", "Completed", "In Progress", "Review Course", "Continue Learning", "Completed:" |
| `ProfileNotifications.tsx` | "No notifications", "You're all caught up!", "Notifications", "unread notifications", "All caught up", "Mark all as read", "New", toast messages |
| `ProfileSaved.tsx` | "No saved items", "Bookmark courses...", "Saved Items", "Your bookmarked content", "Saved", "Item removed" |
| `ProfilePrivacy.tsx` | "Privacy & Data", "KVKK Consent Status", "Granted", "Not Granted", "Version", "Granted on:", "Data Management", "Download My Data", "Submit KVKK Request", "Delete My Account", "Privacy Documents", "Privacy Policy", "Cookie Policy" |
| `ProfileAdminMode.tsx` | "Root Admin Mode:", admin tool labels, tab names, descriptions |

### 2. Other Components (1 file)
| File | Hardcoded strings |
|------|------------------|
| `CertificateDisplay.tsx` | "Certificate of Completion", "This certifies that", "has successfully completed", "Certificate Number:", "Issued on:", "Download PDF", "Share" |

## Implementation per component
1. Import `useTranslation` from `react-i18next`
2. Replace all hardcoded strings with `t('profile.xxx')` or `t('certificate.xxx')` calls
3. Replace toast message strings with `t()` calls

## Locale file updates
Add new keys under a `profile` section (extending existing keys) in all 4 files:
- `src/i18n/locales/en.json` -- English values
- `src/i18n/locales/tr.json` -- Turkish translations
- `src/i18n/locales/ru.json` -- Russian translations
- `src/i18n/locales/ar.json` -- Arabic translations

New key groups to add:
- `profile.overview.*` (about, notSpecified, joined, language, focusAreas, recentActivity, noRecentActivity)
- `profile.settingsPage.*` (title, subtitle, profileInfo, fullName, department, emailPreferences, courseUpdates, courseUpdatesDesc, newsletters, newslettersDesc, marketing, marketingDesc, saveChanges, saving, savedSuccess, saveFailed)
- `profile.certificatesPage.*` (noCertificates, noCertificatesDesc, title, subtitle, issued, download, verify, loadFailed)
- `profile.coursesPage.*` (noCourses, noCoursesDesc, browseCourses, title, subtitle, progress, completed, inProgress, completedDate, reviewCourse, continueLearning, loadFailed)
- `profile.notificationsPage.*` (noNotifications, allCaughtUp, title, unreadCount, markAllRead, new, markReadFailed, markAllReadSuccess, loadFailed)
- `profile.savedPage.*` (noSaved, noSavedDesc, title, subtitle, saved, itemRemoved, removeFailed, loadFailed)
- `profile.privacyPage.*` (title, subtitle, kvkkStatus, granted, notGranted, version, grantedOn, dataManagement, downloadData, submitKvkk, deleteAccount, privacyDocuments, privacyPolicy, kvkkText, cookiePolicy)
- `profile.adminMode.*` (rootAdminAlert, adminTools, adminToolsDesc, quickUploads, announcements, messages, auditLog + descriptions)
- `certificate.*` (title, certifiesThat, hasCompleted, certificateNumber, issuedOn, downloadPdf, share, downloadStarting, shareLinkCopied)

## File count
- 9 component files modified (add `useTranslation`, replace strings)
- 4 locale JSON files updated (add ~120 new keys each)

