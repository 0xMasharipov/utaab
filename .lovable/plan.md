

# Localize Missing and Incomplete Translations

## Summary
After auditing all 4 locale files (EN, TR, AR, RU), the pages (Privacy Policy, Terms of Service, Team, KVKK Request), and comparing key coverage, I found several categories of missing or incomplete translations.

## Issues Found

### 1. Missing i18n Keys (All Locales)
The key `common.back` is used in Privacy Policy and Terms of Service pages but does not exist in any locale file. It falls back to the hardcoded string "Back".

**Fix:** Add `common.back` to all 4 locale files.

| Locale | Value |
|--------|-------|
| EN | "Back" |
| TR | "Geri" |
| AR | "رجوع" |
| RU | "Назад" |

### 2. Missing Keys in Non-English Locales
The following keys exist only in `en.json` and are missing from TR, AR, and RU:

- `education.admin.applications` ("Community Applications")
- `education.admin.kvkkRequests` ("KVKK Requests")

**Fix:** Add these 2 keys to `tr.json`, `ar.json`, and `ru.json`.

### 3. Missing Key in English Locale
`kvkk.requestForm.successMessage` exists in TR, AR, and RU but is missing from EN.

**Fix:** Add to `en.json`:
```
"successMessage": "Your KVKK data request has been submitted. We will contact you via email with updates."
```

### 4. Hardcoded Date String
"December 2024" is hardcoded in both `PrivacyPolicy.tsx` and `TermsOfService.tsx`. This should be localized.

**Fix:**
- Add `legal.lastUpdatedDate` key to all locales
- Update both page components to use `t('legal.lastUpdatedDate')`

| Locale | Value |
|--------|-------|
| EN | "December 2024" |
| TR | "Aralık 2024" |
| AR | "ديسمبر 2024" |
| RU | "Декабрь 2024" |

### 5. Thin Legal Content in AR and RU
The Arabic and Russian Privacy Policy and Terms of Service sections have significantly shorter content compared to English and Turkish. For example, EN's "Data Security" section has 6 bullet points and 2 paragraphs, while RU has a single sentence. This is a content completeness issue, not a missing-key issue.

**Fix:** Expand the `legal.privacyPolicy.sections.*.content` and `legal.termsOfService.sections.*.content` values in `ar.json` and `ru.json` to match the detail level of EN. This involves rewriting ~24 content blocks (12 privacy + 12 terms sections per locale).

## Files Modified

| File | Change |
|------|--------|
| `src/i18n/locales/en.json` | Add `common.back`, `kvkk.requestForm.successMessage`, `legal.lastUpdatedDate` |
| `src/i18n/locales/tr.json` | Add `common.back`, `education.admin.applications`, `education.admin.kvkkRequests`, `legal.lastUpdatedDate` |
| `src/i18n/locales/ar.json` | Add `common.back`, `education.admin.applications`, `education.admin.kvkkRequests`, `legal.lastUpdatedDate`, expand all legal section content to full detail |
| `src/i18n/locales/ru.json` | Add `common.back`, `education.admin.applications`, `education.admin.kvkkRequests`, `legal.lastUpdatedDate`, expand all legal section content to full detail |
| `src/pages/PrivacyPolicy.tsx` | Replace hardcoded "December 2024" with `t('legal.lastUpdatedDate')` |
| `src/pages/TermsOfService.tsx` | Replace hardcoded "December 2024" with `t('legal.lastUpdatedDate')` |

## Scope of Legal Content Expansion (AR and RU)

For both Arabic and Russian, the following Privacy Policy sections will be expanded to match English/Turkish detail:

- `dataSecurity` -- add encryption, security assessments, access controls details
- `yourRights` -- add full list of 10 KVKK Article 11 rights
- `cookies` -- add cookie category breakdown
- `thirdParty` -- add Google OAuth, cloud hosting, email, analytics details
- `international` -- add safeguards (standard clauses, adequacy decisions)
- `children` -- expand with minor data collection policy
- `updates` -- add notification methods
- `contact` -- add full contact details

For Terms of Service, similar expansion for:
- `acceptance`, `description`, `accounts`, `conduct`, `intellectual`, `educational`, `community`, `payment`, `disclaimers`, `indemnification`, `termination`, `governing`, `changes`, `contact`

