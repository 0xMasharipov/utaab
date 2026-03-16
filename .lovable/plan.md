

# Fix Email Templates and OTP Delivery

## Problem Analysis
1. **"— — —" divider**: All 6 email templates contain `<Text style={divider}>— — —</Text>` which needs to be removed.
2. **OTP not working**: The email domain is verified (`notify.utaab.org`) and the `auth-email-hook` edge function is deployed, but the `email_send_log` table is empty -- meaning the hook is never being invoked by the auth system. The queue infrastructure (pgmq, cron job, enqueue_email RPC) all exist and are properly configured.

The root cause of OTP failure: the auth-email-hook needs to be re-scaffolded and redeployed to trigger the backend reconciliation that links the hook to the auth system.

## Changes

### 1. Remove "— — —" divider from all 6 email templates
Remove the `<Text style={divider}>— — —</Text>` line and the `divider` style constant from:
- `signup.tsx`
- `recovery.tsx`
- `magic-link.tsx`
- `invite.tsx`
- `email-change.tsx`
- `reauthentication.tsx`

### 2. Re-scaffold and redeploy auth-email-hook
- Call `scaffold_auth_email_templates` with `confirm_overwrite: true` to re-scaffold
- Re-apply the branded styling (Montserrat font, UTAAB logo, centered layout, no divider)
- Call `deploy_edge_functions` with `["auth-email-hook"]` to trigger the backend reconciliation that activates the hook with the auth system

This will ensure the auth system properly routes signup/recovery/OTP emails through the custom hook, which enqueues them for delivery via the verified `notify.utaab.org` domain.

## Files Modified
| File | Change |
|------|--------|
| All 6 templates in `supabase/functions/_shared/email-templates/` | Remove `— — —` divider line and style |
| `supabase/functions/auth-email-hook/index.ts` | Re-scaffolded to trigger auth system linking |

