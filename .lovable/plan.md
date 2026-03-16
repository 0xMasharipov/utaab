

# Fix: Auth Emails Not Being Delivered

## Root Cause

The email infrastructure is fully configured:
- Domain `notify.utaab.org` is **verified**
- Templates exist and are properly coded
- Cron job for `process-email-queue` is active
- `email_send_log` table has **zero rows** — no emails have ever been enqueued

**The auth-email-hook edge function shows no logs at all**, meaning it's either not deployed or not connected as the auth email hook. The fix is to redeploy both `auth-email-hook` and `process-email-queue` to ensure the hook is active and processing.

## Plan

### 1. Redeploy edge functions
Deploy `auth-email-hook` and `process-email-queue` to ensure:
- The auth-email-hook is registered as the active email hook
- The process-email-queue dispatcher is running

### 2. Verify delivery
After deployment, test by triggering a signup or password reset and checking `email_send_log` for new entries.

No code changes are needed — the templates and function code are correct. This is a deployment/activation issue.

## Files Modified

None — this is a redeployment of existing edge functions.

