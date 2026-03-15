

# Brand UTAAB Auth Email Templates

## Overview
Apply UTAAB's dark navy-blue Web3 branding to all 6 scaffolded auth email templates, upload the logo to storage, and deploy.

## Brand Identity (from `index.css`)
- **Primary**: `hsl(217, 91%, 35%)` → `#0B3C8C`
- **Primary foreground**: white
- **Background**: `hsl(217, 50%, 6%)` → `#081020`
- **Foreground**: `hsl(0, 0%, 98%)` → `#FAFAFA`
- **Muted foreground**: `hsl(217, 10%, 60%)` → `#919199`
- **Accent**: `hsl(213, 94%, 68%)` → `#5BA3F5`
- **Border radius**: `1rem` (16px)
- **Font**: Inter / system sans-serif stack

## Changes

### 1. Upload logo to storage
Upload `src/assets/logo-new.png` to the `media` bucket as `email/logo.png` so it can be referenced via public URL in email templates.

### 2. Update all 6 email templates
Apply consistent UTAAB branding to each template in `supabase/functions/_shared/email-templates/`:

**Style updates (all templates):**
- `main.backgroundColor`: `#ffffff` → `#081020` (dark navy background)
- `main.fontFamily`: `'Inter, -apple-system, BlinkMacSystemFont, sans-serif'`
- Add `wrapper` style: centered white card container with subtle border
- `container`: white card with padding `40px 32px`, border-radius `16px`, max-width `480px`
- `h1.color`: `#000000` → `#081020`
- `text.color`: `#55575d` → `#4A4A52`
- `button.backgroundColor`: `#000000` → `#0B3C8C` (primary blue)
- `button.borderRadius`: `8px` → `16px`
- `footer.color`: `#999999` → `#919199`
- `codeStyle` (reauthentication): update color to `#0B3C8C`

**Content updates:**
- Add UTAAB logo `<Img>` at top of each template's container
- Replace generic "siteName" references with "UTAAB" branding tone
- Add a subtle "Powered by UTAAB" footer line
- Signup: "Welcome to UTAAB" heading, "Get Started" button text
- Recovery: "Reset Your Password" stays
- Magic Link: "Sign In to UTAAB" button text
- Invite: "Join UTAAB" heading
- Email Change: stays similar
- Reauthentication: stays similar

### 3. Deploy edge function
Deploy `auth-email-hook` so the branded templates go live.

## Files Modified
| File | Change |
|------|--------|
| `supabase/functions/_shared/email-templates/signup.tsx` | UTAAB branding |
| `supabase/functions/_shared/email-templates/recovery.tsx` | UTAAB branding |
| `supabase/functions/_shared/email-templates/magic-link.tsx` | UTAAB branding |
| `supabase/functions/_shared/email-templates/invite.tsx` | UTAAB branding |
| `supabase/functions/_shared/email-templates/email-change.tsx` | UTAAB branding |
| `supabase/functions/_shared/email-templates/reauthentication.tsx` | UTAAB branding |
| Storage: `media/email/logo.png` | Logo upload |

