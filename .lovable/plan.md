
# Admin Panel IP Address and Registered Users Display Plan

## Overview

This plan addresses three requirements:
1. Show IP addresses on the Security section
2. Show IP addresses on the Audit Log section
3. Show all registered users in the Users & Roles "All Users" tab

## Current State Analysis

### 1. Security Section (`AdminSecurity.tsx`)
- **IP addresses are already displayed** in the Security Events table (line 328-329)
- The query fetches `ip_address` from `security_events` table
- However, the current data shows `ip_address: <nil>` for most events because the edge functions are not capturing IP addresses properly

### 2. Audit Log Section (`AdminAuditLog.tsx`)
- The `audit_log` table has an `ip_address` column (confirmed from schema)
- Currently shows **masked IP addresses** (lines 149-152) using format: `XX.XX.***.***.***`
- The masking is intentional for privacy but may be too aggressive

### 3. Users & Roles Section (`AdminUsers.tsx`)
- Currently only displays users from `education_profiles` table
- This only shows users who completed the education registration form
- **Missing**: Users who signed up but didn't complete the education profile

## Changes Required

### Change 1: Audit Log - Show Full IP Addresses for Admins

**File:** `src/pages/education/admin/AdminAuditLog.tsx`

Currently, IP addresses are masked too aggressively:
```typescript
IP: {String(log.ip_address).split('.').slice(0, 2).join('.')}.***.***.***
```

Change to show full IP address for admin visibility (admins need full IP for security auditing):
```typescript
IP: {log.ip_address}
```

Also add IP address as a visible column in the card display for better visibility.

### Change 2: Admin Users - Add Email Column from Auth

**File:** `src/pages/admin/AdminUsers.tsx`

The "All Users" tab needs to show user emails. Currently the table only shows:
- Name
- Department
- Role
- Joined

We need to add an **Email** column. The email can be fetched using the `lookup-user-by-email` edge function or we can query the education profile email preferences.

Since we don't have direct access to `auth.users`, we'll need to:
1. Use the existing `education_profiles` data (which already has email information in preferences)
2. Create an edge function to lookup emails securely

For now, we can add the email lookup by calling the `lookup-user-by-email` edge function for each user, OR we can store email in education_profiles.

**Better approach**: Query the email from the user's auth session or add email lookup via a new secure edge function that returns user emails for admin view.

---

## Technical Implementation

### File 1: `src/pages/education/admin/AdminAuditLog.tsx`

**Changes:**
- Remove IP masking for admin view (admins need full IP for security purposes)
- Add a dedicated IP column in the card layout
- Add IP address badge/display

### File 2: `src/pages/admin/AdminUsers.tsx`

**Changes:**
- Add "Email" column to the All Users, Admins, and Community Admins tables
- Create an edge function or use existing lookup to get user emails
- Fetch emails securely for admin viewing

### File 3: New Edge Function - `get-user-emails` (if needed)

Create an edge function that:
- Validates admin role
- Returns user_id -> email mapping for admin dashboard
- Uses service_role to query auth.users

---

## Implementation Details

### Audit Log IP Display Update

```text
// Remove masking, show full IP for admin auditing
<p className="text-xs text-muted-foreground font-mono">
  IP: {log.ip_address || 'N/A'}
</p>
```

### Users Table Email Column

```text
// Add email column to table header
<TableHead>Email</TableHead>

// Add email cell in table body
<TableCell>{user.email || lookupEmail(user.user_id)}</TableCell>
```

### Edge Function for Email Lookup

Since we need to access auth.users (which is restricted), we'll create an edge function:

```text
// supabase/functions/get-admin-users/index.ts
- Verify caller has admin role
- Use service_role client to query auth.users
- Return user_id, email pairs
- Join with education_profiles data
```

---

## Summary of Changes

| File | Change |
|------|--------|
| `src/pages/education/admin/AdminAuditLog.tsx` | Show full IP addresses instead of masked |
| `src/pages/admin/AdminUsers.tsx` | Add Email column, fetch emails via edge function |
| `supabase/functions/get-admin-users/index.ts` | New edge function to get user emails for admins |

## Expected Result

After implementation:
1. **Security Section**: Already shows IP addresses (no changes needed)
2. **Audit Log**: Will show full IP addresses in each log entry
3. **Users & Roles**: Will show Name, Email, Department, Role, and Joined date for all registered users
