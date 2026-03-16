

# Multi-Feature Update: Email Branding, Anti-bot Fix, OTP, Google OAuth, Login Logging

## Overview
This plan covers 7 interconnected changes across email templates, auth forms, anti-bot verification, Google OAuth, and login data persistence.

---

## 1. Upload New Logo & Update Email Templates

**Upload** the provided `UTAAB_LOGO.webp` to the `media` storage bucket as `email/logo.png`.

**Update all 6 email templates** in `supabase/functions/_shared/email-templates/`:
- Replace current logo URL with the new uploaded logo
- Change `fontFamily` to `'Montserrat, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'`
- Add tagline **"CONNECT. LEARN. BUILD."** below the logo in each template (muted gray, 11px, letter-spacing 3px)
- Refine layout: tighten padding, improve heading hierarchy, make buttons more polished
- Keep the existing dark navy (`#081020`) background + white card design

**Redeploy** `auth-email-hook` edge function after changes.

---

## 2. Fix Anti-bot (UTAAB Captcha) Blocking Registration

The UTAAB anti-bot system is too aggressive — users on the register and community join forms can't pass verification. The fix:

**`src/components/forms/EducationRegisterForm.tsx`** (signup mode, step 3):
- Remove the UTAAB captcha requirement from the signup flow entirely (it was already removed from step 3 submit — but sign-in still requires it)
- The signup flow doesn't reference `utaabToken` in the submit handler but the sign-in flow does — remove the `utaabToken` requirement from sign-in as well
- Keep honeypot + form timing + rate limiting as security measures

**`src/components/forms/CommunityJoinForm.tsx`** (step 4):
- Remove the `UtaabCaptcha` component from step 4
- Remove the `!utaabToken` check from `handleSubmit` and the submit button `disabled` prop
- Remove `utaabToken` state and `utaabRef`
- Keep honeypot field and server-side UTAAB token validation as optional (don't require it)

**`supabase/functions/submit-community-application/index.ts`**:
- Make `utaab_token` validation optional — if token is present, validate it; if absent, allow submission (relying on honeypot + rate limit)

---

## 3. Add OTP Email Verification to Sign-in & Register Pages

After signup, show an OTP input section where users enter the 6-digit code received from UTAAB email.

**`src/components/forms/EducationRegisterForm.tsx`**:
- After successful `signUp()`, instead of showing the "completed" screen immediately, show a new OTP verification step
- Add state: `awaitingOtp`, `otpCode`
- Render 6-digit OTP input using the existing `InputOTP` component
- On OTP submit, call `supabase.auth.verifyOtp({ email, token: otpCode, type: 'signup' })`
- On success, show the completed screen
- Add a "Resend code" button

**Sign-in flow**: After `signInWithPassword` returns `Email not confirmed` error, show the same OTP input and call `supabase.auth.verifyOtp({ email, token, type: 'email' })`.

---

## 4. Configure Google OAuth via Managed Solution

**Use the Configure Social Auth tool** to generate the `lovable` module for Google OAuth.

**Update `src/components/forms/EducationRegisterForm.tsx`**:
- Replace `supabase.auth.signInWithOAuth({ provider: 'google' })` calls (both in sign-in and signup modes) with `lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin })` from `@/integrations/lovable/index`

---

## 5. Save Login Data to Database

Create a `login_history` table to track user sign-ins.

**Database migration**:
```sql
CREATE TABLE public.login_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  email text,
  provider text DEFAULT 'email',
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.login_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own login history"
  ON public.login_history FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Authenticated users can insert own login history"
  ON public.login_history FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
```

**`src/components/forms/EducationRegisterForm.tsx`**:
- After successful sign-in (both password and Google OAuth callback), insert a row into `login_history` with `user_id`, `email`, `provider`, and `user_agent`

---

## 6. Handle Google OAuth Callback & Profile Creation

**`src/pages/education/EducationRegister.tsx`** and **`src/pages/education/EducationSignIn.tsx`**:
- Add `useEffect` with `supabase.auth.onAuthStateChange` listener
- On `SIGNED_IN` event from OAuth, check if `education_profiles` row exists for the user
- If not, redirect to a profile completion step or auto-create a minimal profile
- Insert login history record with `provider: 'google'`
- Navigate to `/education`

---

## Files Modified

| File | Change |
|------|--------|
| `supabase/functions/_shared/email-templates/*.tsx` (6 files) | New logo, Montserrat font, "CONNECT. LEARN. BUILD." tagline |
| `src/components/forms/EducationRegisterForm.tsx` | Remove UTAAB captcha, add OTP verification step, use managed Google OAuth, log sign-ins |
| `src/components/forms/CommunityJoinForm.tsx` | Remove UTAAB captcha requirement |
| `supabase/functions/submit-community-application/index.ts` | Make UTAAB token optional |
| `src/pages/education/EducationRegister.tsx` | Handle OAuth callback |
| `src/pages/education/EducationSignIn.tsx` | Handle OAuth callback |
| New migration | Create `login_history` table |
| Storage: `media/email/logo.png` | Upload new logo |

