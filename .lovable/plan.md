

# Immediate Session Termination for Admin Panel

## Problem
Currently, clicking "Terminate" on an active session only deletes the `admin_sessions` row from the database. The targeted user's Supabase auth session (JWT/refresh token) remains valid -- they stay logged in and can keep using the admin panel until their token naturally expires.

## Solution
Create a server-side edge function that forcibly revokes the user's authentication session via the Supabase Auth Admin API, then deletes the `admin_sessions` record and logs the action.

## Changes

### 1. New Edge Function: `terminate-admin-session`

**File:** `supabase/functions/terminate-admin-session/index.ts`

- Accepts `{ session_id, target_user_id }` in the request body
- Verifies the caller is an authenticated admin (via `has_role` RPC)
- Uses `SUPABASE_SERVICE_ROLE_KEY` to call the Auth Admin API endpoint: `POST {SUPABASE_URL}/auth/v1/admin/users/{target_user_id}/logout` -- this revokes all refresh tokens for that user, forcing immediate sign-out
- Deletes the `admin_sessions` record
- Logs a `session_terminated` event to `security_events` and `audit_log` with the terminating admin's info and the target user's ID
- Returns success/failure response

### 2. Update `supabase/config.toml`

Add the new function entry with `verify_jwt = false` (handles auth internally).

### 3. Update `AdminSecurity.tsx` -- `handleTerminateSession`

Replace the current direct database delete with a call to the new `terminate-admin-session` edge function, passing the session ID and target user ID. The function handles everything server-side.

## Technical Details

**Auth Admin API call (inside edge function):**
```text
POST {SUPABASE_URL}/auth/v1/admin/users/{user_id}/logout
Headers:
  Authorization: Bearer {SERVICE_ROLE_KEY}
  apikey: {SERVICE_ROLE_KEY}
Scope: "global" (revokes all sessions for the user)
```

This ensures the terminated user is immediately signed out -- their next API call or page refresh will fail authentication and redirect them to the login page.

## Files Summary

| File | Action |
|------|--------|
| `supabase/functions/terminate-admin-session/index.ts` | Create |
| `supabase/config.toml` | Add function config |
| `src/pages/education/admin/AdminSecurity.tsx` | Update terminate handler |

