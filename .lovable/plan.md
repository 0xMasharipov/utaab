

# Add Direct Role Assignment to Main Admin Panel

## Problem
1. The duplicate invitation error has already been fixed (expired invites are now auto-deleted).
2. However, the invitation flow is still the **only** way to grant roles from `/admin/users`. The direct role assignment dialog (`RoleManagementDialog`) exists but is only connected to the education admin panel at `/education/admin/users`.

## Solution
Wire up the existing `RoleManagementDialog` component into the main admin users page, giving admins a second way to manage roles for any registered user -- without needing to send an invitation at all.

## Changes Required

### File: `src/pages/admin/AdminUsers.tsx`

1. **Import** `RoleManagementDialog` from `@/components/admin/RoleManagementDialog`
2. **Add state** for the selected user and dialog visibility:
   - `selectedUserForRole` (the user object)
   - `roleDialogOpen` (boolean)
3. **Add a "Manage Roles" button** (Shield icon) to each user row in the registered users table
4. **Render** the `RoleManagementDialog` at the bottom of the component, passing the selected user and a callback to refresh the user list on update

### No other files need to change
The `RoleManagementDialog` component and the `manage-user-role` edge function already exist and are fully functional.

## How It Will Work

- In the **Registered Users** tab, each user row will show a shield icon button
- Clicking it opens the role management dialog showing all available roles (admin, moderator, instructor, community_admin, student, user)
- The admin can toggle roles on/off and save -- changes go through the secure `manage-user-role` edge function
- All changes are logged to the audit log

## Summary

| File | Change |
|------|--------|
| `src/pages/admin/AdminUsers.tsx` | Add RoleManagementDialog import, state, button, and dialog render |

## Result
Admins will have **two ways** to grant roles:
1. **Invitation flow** -- for users not yet registered (with the duplicate fix already in place)
2. **Direct role assignment** -- for users already registered, via the Manage Roles dialog

