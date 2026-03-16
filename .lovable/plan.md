

# Update Email Templates: Footer, Branding & Logo

## Changes across all 6 templates

### 1. Upload new logo
Copy `user-uploads://UTAAB_LOGO_BL.png` to `src/assets/UTAAB_LOGO_BL.png`, then upload to the `media` storage bucket as `email/logo-bl.png`. Update `LOGO_URL` in all templates.

### 2. Footer line
Change `© {siteName} · Powered by UTAAB` → `© Powered by UTAAB` in all 6 templates.

### 3. Use "UTAAB" consistently
- Signup: `Welcome to {siteName}` → `Welcome to UTAAB`
- Recovery: `reset your password for {siteName}` → `reset your password for UTAAB`
- Magic Link: `Sign In to {siteName}` → `Sign In to UTAAB`, preview text updated
- Invite: `Join {siteName}` → `Join UTAAB`
- Email Change: `for {siteName}` → `for UTAAB`
- Reauthentication: no siteName refs, already fine

### 4. Center all text
Add `textAlign: 'center'` to the `text` style in all templates (currently missing on body text).

### 5. Redeploy
Deploy `auth-email-hook` after changes.

## Files modified
| File | Change |
|------|--------|
| All 6 templates in `supabase/functions/_shared/email-templates/` | Logo URL, footer, UTAAB branding, centered text |
| Storage: `media/email/logo-bl.png` | New logo upload |

