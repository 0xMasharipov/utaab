

# Admin Panel Security Hardening: IP Logging and Leak Prevention

## Problem Identified
All admin login events currently have **NULL IP addresses and user agents** in:
- `security_events` table (admin_login_success/failed)
- `admin_sessions` table
- `audit_log` table

This is because `logSecurityEvent` runs client-side via the `useSecurity` hook, and the browser cannot reliably determine its own IP address. IP capture must happen server-side in edge functions.

---

## Solution: Server-Side Admin Login Logging

### 1. New Edge Function: `admin-login-log`

Create a new edge function that:
- Receives login event details (email, event type, provider)
- Extracts the client IP from request headers (`x-forwarded-for`, `x-real-ip`, or connection info)
- Extracts the user agent from the `user-agent` header
- Logs to `security_events` using service_role (bypasses RLS)
- Updates the corresponding `admin_sessions` record with IP + user agent
- Logs to `audit_log` with IP + user agent for login/logout events

**Key**: Uses `SUPABASE_SERVICE_ROLE_KEY` to insert into `security_events` (which only allows service_role inserts).

### 2. Update `AdminLogin.tsx`

After successful login (both email/password and OAuth):
- Call `admin-login-log` edge function instead of client-side `logSecurityEvent`
- Pass event type (`admin_login_success` or `admin_login_failed`), email, and provider
- The edge function captures IP and user agent server-side

For failed login attempts:
- Also call the edge function so failed attempts are logged with IP

### 3. Update `check-admin-status` Edge Function

Enhance to also log the IP when admin status is verified (on each admin page load), providing an activity trail. Add IP extraction and optional activity logging.

### 4. Add "Admin Logins" Tab to Audit Log Page

Update `AdminAuditLog.tsx`:
- Add a new filter option: `login` action type
- Add `admin_login_success` and `admin_login_failed` to entity filter
- Display IP address and user agent prominently for login entries
- Add action filter values for login events

### 5. Add "Admin Sessions" Section to Security Dashboard

Update `AdminSecurity.tsx`:
- Add a new tab "Active Sessions" showing current admin sessions with IP, user agent, created_at, expires_at
- Allow admins to terminate other sessions (delete from admin_sessions)
- Show session age and expiry countdown

### 6. Security Hardening Additions

- **Session cleanup on logout**: When admin signs out via `AdminLayout`, delete their admin_sessions record
- **Concurrent session detection**: Log a warning event if a new session is created while an active one exists
- **Failed attempt escalation**: After 3+ failed attempts from same IP, log as `high` severity instead of `medium`

---

## Files Summary

| File | Action | Purpose |
|------|--------|---------|
| `supabase/functions/admin-login-log/index.ts` | Create | Server-side IP capture and security logging |
| `supabase/config.toml` | Update | Add admin-login-log function config (verify_jwt: false, handles auth internally) |
| `src/pages/admin/AdminLogin.tsx` | Update | Call edge function instead of client-side logSecurityEvent |
| `src/components/admin/AdminLayout.tsx` | Update | Delete admin_session on logout, log logout with IP |
| `src/pages/education/admin/AdminAuditLog.tsx` | Update | Add login/logout action filters, show IP/user_agent prominently |
| `src/pages/education/admin/AdminSecurity.tsx` | Update | Add Active Sessions tab with IP visibility and session termination |

---

## Technical Details

### IP Extraction (Edge Function)
```text
Priority order:
1. x-forwarded-for header (first IP)
2. x-real-ip header
3. Request connection remote address
4. Fallback: "unknown"
```

### Edge Function Auth Pattern
- Accepts Authorization header from caller
- Validates caller is authenticated via `getUser()`
- Uses service_role client for privileged inserts (security_events, audit_log)
- Extracts IP/UA from request headers

### Audit Log Filter Additions
- Action filter: add "login" option
- Entity filter: add "session" option
- Visual: login entries show IP badge and user agent in a monospace font

