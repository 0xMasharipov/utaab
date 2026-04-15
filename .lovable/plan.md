

# Refine Welcome Email Template — Logo Outside Card

## Summary
Update the welcome email template so the logo sits outside and above the white card, matching the auth email structure. Ensure the card is always pure white regardless of dark mode, with consistent spacing and branding.

## Changes to `supabase/functions/_shared/transactional-email-templates/welcome-email.tsx`

### Structure
- **Logo section**: Stays outside the card container (already correct), but align styling with auth templates — use `width="160"`, add the "CONNECT. LEARN. BUILD." tagline above the card alongside the logo
- **White card**: Add `border: '1px solid #e8e8ec'`, `boxShadow`, and `borderRadius: '20px'` to match auth email card styling
- **Tagline**: Move from inside the card to below the logo (outside the card), matching the auth template pattern
- **Body background**: Keep `#081020` (navy) — consistent with auth emails
- **Card background**: Force `#ffffff` with no dark-mode media queries

### Style updates (align with auth templates)
- Container max-width: `480px` (match auth emails, currently `560px`)
- Card padding: `48px 36px 40px` (match auth)
- Font family: Use the full `Montserrat, -apple-system, BlinkMacSystemFont...` stack
- Tagline color: `#919199` with `letterSpacing: '3px'` (match auth, currently purple `#6366f1`)
- Footer: Split into two lines — disclaimer + "© Powered by UTAAB" (match auth)
- Text alignment: Center all text (match auth)

### Deploy
- Redeploy `send-transactional-email` and `preview-transactional-email` Edge Functions

## Files Modified
- `supabase/functions/_shared/transactional-email-templates/welcome-email.tsx`

## No changes to
- Registry, Edge Function logic, auth email templates, any app pages

