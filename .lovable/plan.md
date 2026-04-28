## Goal

When a user clicks **Continue with Google** on `https://utaab.org/education/register` (and the matching sign-in tab), do not initiate the OAuth flow. Instead, show a branded, friendly notice:

> "Google sign-in is temporarily unavailable due to technical issues. It will be resolved soon — please use email & password for now."

This is a temporary client-side gate. The underlying OAuth code stays intact so it can be re-enabled by flipping a single flag.

## Changes

### 1. `src/components/forms/EducationRegisterForm.tsx`
- Replace the body of `handleGoogleSignIn` with a toast notice (no OAuth call). Use the existing `useToast` hook with a non-destructive variant and i18n strings. Keep the original `lovable.auth.signInWithOAuth(...)` call commented behind a `GOOGLE_OAUTH_ENABLED = false` constant at the top of the file so re-enabling is one line.
- Both Google buttons (signup view ~line 737 and signin view ~line 1108) already call `handleGoogleSignIn`, so a single change covers both.

### 2. i18n strings — add to `auth` namespace in all four locales
`src/i18n/locales/{en,tr,ru,ar}.json`:
- `googleTempUnavailableTitle`
- `googleTempUnavailableMessage`

Sample (EN):
- Title: "Google sign-in temporarily unavailable"
- Message: "We're experiencing technical issues with Google sign-in. It will be resolved soon. Please continue with email & password."

Translated equivalents for TR, RU, AR.

### 3. (Optional, same change) `src/pages/admin/AdminLogin.tsx`
The user only mentioned the education register page, so admin login is **left untouched** unless requested.

## Technical notes

- No backend / edge function changes.
- No changes to `lovable` integration files.
- The notice uses `toast({ title, description })` (default variant) so it reads as informational, not as an error.
- Re-enable later by setting `GOOGLE_OAUTH_ENABLED = true`.
