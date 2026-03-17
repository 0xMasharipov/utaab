

# Add Contact Email to Footer & Update Email Logo

## Changes

### 1. Footer — Add Contact Section
**File:** `src/components/Footer.tsx`

Add a "Contact" section to the footer grid with a `Mail` icon and a clickable `contact@utaab.org` mailto link. Place it within the existing Social column or as a separate contact info block beneath the social icons, keeping the 4-column grid layout intact.

### 2. Update Email Template Logo Image
The uploaded image (blue diamond cross logo) needs to replace the current `logo-bl.png` used across all email templates.

**Steps:**
- Copy the uploaded image to the project (`public/images/utaab-email-logo.png`)
- Upload it to storage (media bucket) so it's accessible via a public URL for email rendering
- Update `LOGO_URL` in all 6 email templates:
  - `magic-link.tsx`
  - `signup.tsx`
  - `recovery.tsx`
  - `invite.tsx`
  - `email-change.tsx`
  - `reauthentication.tsx`
- Redeploy `auth-email-hook` edge function

### Files Modified

| File | Change |
|------|--------|
| `src/components/Footer.tsx` | Add contact@utaab.org email with Mail icon |
| `supabase/functions/_shared/email-templates/*.tsx` (all 6) | Update LOGO_URL to new image |
| `supabase/functions/auth-email-hook/index.ts` | Redeploy |

