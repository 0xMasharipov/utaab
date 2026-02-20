

# Remove UB Point, Fix "Soon" Labels, and Complete Missing Translations

## Overview
This plan covers three categories of changes: removing the UB Point project, making all project cards show "Soon" on the View Project button, and completing all missing translations across the 4 locale files.

## Changes

### 1. Remove UB Point from Projects

**`src/components/Projects.tsx`**: Remove the UB Point entry (lines 47-51) from the projects array. This reduces the project count from 7 to 6.

**All 4 locale files**: Remove the `projects.ubpoint` object (title + description) and remove the `projects.tags.students` key (only used by UB Point).

### 2. All Projects Show "Soon" on View Project Button

**`src/components/Projects.tsx`**: Change the button so "Soon" label appears for ALL projects, not just "planning" ones. Remove the `project.status === 'planning'` condition from line 127 so every card displays "View Project Soon".

### 3. Fix Hardcoded English in KVKKRequestForm

**`src/components/forms/KVKKRequestForm.tsx`**: Replace 3 hardcoded English strings with i18n keys:
- "Meanwhile, join our community on WhatsApp to stay connected!" --> `t('kvkk.requestForm.successCommunity')`
- "Back to Home" --> `t('kvkk.requestForm.backToHome')`
- "Submitting..." --> `t('common.submitting')`

Add corresponding keys to all 4 locale files.

### 4. Add Missing Translation Keys Across Locales

#### Arabic (`ar.json`) -- Missing Sections:
- **`common.retry`**: Add `"retry": "إعادة المحاولة"`
- **`utaab` section**: Add all 8 keys (verifying, verified, humanConfirmed, verifyHuman, verificationFailed, tryAgain, clickToVerify, verify, solvingChallenge)
- **`education.registration` section**: Add full registration form translations (~50 keys including validation messages)
- **`blog.copyLink` and `blog.linkCopied`**: Add missing blog keys
- **`legal` section**: Add full Privacy Policy and Terms of Service translations (tableOfContents, relatedDocuments, privacyPolicy sections, termsOfService sections)

#### Turkish (`tr.json`) -- Missing Keys:
- **`blog.copyLink` and `blog.linkCopied`**: Add `"copyLink": "Bağlantıyı Kopyala"`, `"linkCopied": "Bağlantı kopyalandı!"`
- **`education.registration` section**: Add full registration form translations
- **`legal` section**: Add full Privacy Policy and Terms of Service translations

#### Russian (`ru.json`) -- Missing Keys:
- **`blog.copyLink` and `blog.linkCopied`**: Add `"copyLink": "Скопировать ссылку"`, `"linkCopied": "Ссылка скопирована!"`
- **`education.registration` section**: Add full registration form translations
- **`legal` section**: Add full Privacy Policy and Terms of Service translations

### 5. New i18n Keys for KVKK Form (all 4 locales)

| Key | EN | TR | AR | RU |
|-----|----|----|----|----|
| `kvkk.requestForm.successCommunity` | Meanwhile, join our community on WhatsApp to stay connected! | Bu arada, bağlantıda kalmak için WhatsApp topluluğumuza katılın! | في غضون ذلك، انضم إلى مجتمعنا على WhatsApp للبقاء على تواصل! | А пока присоединяйтесь к нашему сообществу в WhatsApp! |
| `kvkk.requestForm.backToHome` | Back to Home | Ana Sayfaya Dön | العودة إلى الرئيسية | На главную |

## Technical Details

### Files Modified

| File | Changes |
|------|---------|
| `src/components/Projects.tsx` | Remove UB Point entry, remove status condition from "Soon" label |
| `src/components/forms/KVKKRequestForm.tsx` | Replace 3 hardcoded English strings with `t()` calls |
| `src/i18n/locales/en.json` | Remove ubpoint, add KVKK form keys |
| `src/i18n/locales/tr.json` | Remove ubpoint, add KVKK form keys, add blog keys, add education.registration section, add legal section |
| `src/i18n/locales/ar.json` | Remove ubpoint, add KVKK form keys, add utaab section, add common.retry, add blog keys, add education.registration section, add legal section |
| `src/i18n/locales/ru.json` | Remove ubpoint, add KVKK form keys, add blog keys, add education.registration section, add legal section |

### Scope Note
The `education.registration` and `legal` sections are substantial (50+ keys each with long HTML content for legal pages). These will be fully translated to Turkish, Arabic, and Russian to ensure complete localization coverage across the entire website.
