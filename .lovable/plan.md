

# Fix Admin Login vs Layout Route Conflict

## Problem
`ADMIN_ROUTES.LOGIN` and `ADMIN_ROUTES.BASE` are both `/v8k2m9x4`. When navigating to this path, React Router matches the `AdminLayout` parent route (which has an `index` element rendering `AdminDashboard`), skipping the `AdminLogin` page entirely. The `AdminLayout` then tries to verify admin access and redirects unauthenticated users back to login — creating a loop or showing the verification spinner.

## Solution
Separate the login route from the layout base by giving login its own distinct path.

### Changes

1. **`src/config/routes.ts`** — Change `LOGIN` to a different random path, e.g. `/j3r7x1w9` (keep `BASE` as `/v8k2m9x4`)

2. **`src/App.tsx`** — The login route already uses `ADMIN_ROUTES.LOGIN`, so it will automatically pick up the new path. No structural change needed.

3. **`src/components/admin/AdminLayout.tsx`** — Already redirects unauthenticated users to `ADMIN_ROUTES.LOGIN`, will work with the new path.

4. **`src/pages/admin/AdminLogin.tsx`** — Already navigates to `ADMIN_ROUTES.DASHBOARD` on success, no change needed.

5. **Legacy redirects in `App.tsx`** — Update the `/admin/*` catch-all to redirect to the new login path (already uses `ADMIN_ROUTES.LOGIN`).

### Single file change
Only `src/config/routes.ts` needs updating — change `LOGIN` from `/v8k2m9x4` to `/j3r7x1w9`.

## Files Modified
- `src/config/routes.ts` — New distinct login path

