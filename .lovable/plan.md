

# Update Email Logo

## Changes

### 1. Upload new logo to storage
Upload the provided image (`UTAAB_LOGO_BL-2.png`) to the `media` bucket at `email/utaab-logo.png`, replacing the current diamond-only logo. Since all 6 email templates already reference this exact path, no template code changes are needed.

### 2. Redeploy auth-email-hook
Redeploy the edge function so the templates pick up the updated asset.

| Step | Detail |
|------|--------|
| Upload image | `media/email/utaab-logo.png` (overwrites existing) |
| Templates | No changes needed — all 6 already point to this URL |
| Deploy | Redeploy `auth-email-hook` |

