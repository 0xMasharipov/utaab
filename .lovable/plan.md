## Goal

Rebrand the "Confirm your sign up" auth email — and the other auth emails — to visually match the UTAAB Welcome email shown in the user's screenshot. Same logo, tagline, white card on navy, Montserrat type, and `© Powered by UTAAB` footer.

## Reference (from screenshot + brand memory)

- Outer background: solid navy `#081020`, ~40px vertical padding
- White card: `#FFFFFF`, 20px border-radius, soft border + light shadow, ~480px wide
- Inside the card, top-aligned:
  - UTAAB logo (`https://nxbjgqdehvxszqjoxumx.supabase.co/storage/v1/object/public/media/email%2Futaab-logo.png`, ~160px wide) — same asset already used by the welcome email, so the diamond + UTAAB lockup is identical
  - Tagline: `CONNECT · LEARN · BUILD`, 11px, letter-spacing 3px, muted gray, uppercase
- Heading in `#081020`, body text in `#374151`, muted text in `#9ca3af`
- Divider `<Hr>` before footer
- Footer lines: contextual disclaimer + `© Powered by UTAAB`
- Font: Montserrat via Google Fonts, fallback to system sans
- Body background MUST stay white inside the card; navy is only the outer page background

Note: per brand memory, auth templates previously placed the logo *above* the card. The user's screenshot shows the logo *inside* the card (welcome layout). We will follow the screenshot — logo inside the card — and update the brand memory accordingly so all UTAAB emails share one layout.

## File changes

### 1. `supabase/functions/_shared/email-templates/signup.tsx` (primary — "Confirm your sign up")

Full rebrand to mirror the welcome layout:
- Montserrat `<link>` in `<Head>`
- Navy `Body` → centered `Container` → white `card` Section
- Inside card: logo `<Img>`, `CONNECT · LEARN · BUILD` tagline, `Heading` "Confirm your email", short intro mentioning UTAAB, primary CTA `<Button>` "Verify Email" → `confirmationUrl`, fallback plain link below the button for clients that strip buttons, `<Hr>`, "If you didn't sign up, you can ignore this email." disclaimer, `© Powered by UTAAB`
- CTA button: navy `#081020` background, white text, 10px radius, bold, full-width feel (centered, generous padding)
- Keeps the existing prop signature `{ siteName, siteUrl, recipient, confirmationUrl }` so `auth-email-hook` and `education-signup` keep working with no changes

### 2. Apply the same shell to the other auth templates (so the whole flow is cohesive)

- `magic-link.tsx` — heading "Your sign-in code", keep 6-digit code box (restyle in brand navy `#081020` background, white code text, 10px radius), keep optional sign-in button below
- `recovery.tsx` — heading "Reset your password", CTA "Reset Password"
- `invite.tsx` — heading "You're invited to UTAAB", CTA "Accept Invite"
- `email-change.tsx` — heading "Confirm your new email", CTA "Confirm Email Change"
- `reauthentication.tsx` — heading "Confirm it's you", keep code box in brand navy

All six templates will share the same shell components and styles (logo, tagline, card, divider, footer, button styling) so the auth flow looks like one product.

### 3. No changes required to:

- `supabase/functions/auth-email-hook/index.ts` — template props are unchanged
- `supabase/functions/education-signup/index.ts` — already passes `siteName / siteUrl / recipient / confirmationUrl` to `SignupEmail`
- `supabase/functions/_shared/transactional-email-templates/*` — already branded
- `supabase/functions/_shared/transactional-email-templates/registry.ts`

## Deploy

Redeploy `auth-email-hook` so the updated templates take effect. (Edge Functions serve last-deployed code, not the file on disk.)

## Memory update

Update `mem://auth/branded-auth-email-templates` so it reflects the unified rule: **logo and tagline live INSIDE the white card for both auth and transactional templates** (matching the screenshot), instead of the previous "auth above the card / transactional inside" split.

## Out of scope

- No DNS / email-domain changes (already verified, sending works)
- No new logo upload — reusing the hosted UTAAB logo PNG already used by the welcome email
- No copy translation; auth emails remain in English (matches current behavior)
- No changes to the email queue, suppression, unsubscribe, or rate-limit logic
