

# Obfuscate Admin Routes and Remove Public References

## Summary
Replace all `/admin/*` routes with randomized, non-semantic paths. Remove all visible admin links from public UI. Rename page titles to neutral wording.

## Randomized Route Map

```text
/admin/login        → /v8k2m9x4
/admin              → /v8k2m9x4/p3
/admin/dashboard    → /v8k2m9x4/p3  (same as index)
/admin/users        → /v8k2m9x4/q7w
/admin/communities  → /v8k2m9x4/r2f
/admin/communities/:id → /v8k2m9x4/r2f/:id
/admin/events       → /v8k2m9x4/t5j
/admin/courses      → /v8k2m9x4/k8n
/admin/blog         → /v8k2m9x4/m4b
/admin/site-content → /v8k2m9x4/s6c
/admin/announcements→ /v8k2m9x4/a1x
/admin/messages     → /v8k2m9x4/d9g
/admin/media        → /v8k2m9x4/h3v
/admin/contributors → /v8k2m9x4/w7p
/admin/security     → /v8k2m9x4/z2e
/admin/settings     → /v8k2m9x4/y5l
/admin/audit        → /v8k2m9x4/f8u
/education/admin    → /v8k2m9x4/p3  (redirect)
```

## Route Constants File (new)
Create `src/config/routes.ts` — single source of truth for all obfuscated paths. Every file references this instead of hardcoded strings.

## Files Modified

1. **`src/config/routes.ts`** (new) — Route constants map
2. **`src/App.tsx`** — Update all route definitions to use constants
3. **`src/components/admin/AdminLayout.tsx`** — Update sidebar paths, redirect paths, remove "Admin" from visible title
4. **`src/pages/admin/AdminLogin.tsx`** — Update navigate targets, OAuth redirect, history.replaceState, rename heading to "Sign In" / "Authentication"
5. **`src/components/Navbar.tsx`** — Remove the "Admin Sign In" button entirely (lines 372-377)
6. **`src/components/education/EducationNavbar.tsx`** — Remove the admin nav item push (lines 154-156)
7. **`src/pages/education/UserProfile.tsx`** — Change "Admin Dashboard" button to use obfuscated path, rename label to neutral text like "Management"
8. **`src/pages/admin/AdminDashboard.tsx`** — Rename heading from "Admin Dashboard" to "Overview"
9. **`src/pages/admin/AdminCommunityDetail.tsx`** — Update back navigation path
10. **`src/pages/admin/AdminCommunities.tsx`** — Update navigation path

## Neutral Labels
- Login page title: "Sign In" / "Authentication"
- Dashboard heading: "Overview"
- Sidebar labels stay functional (Dashboard, Users, etc.) — they're only visible to authenticated users inside the protected layout
- UserProfile button: "Management" instead of "Admin Dashboard"

## Security Note
This is obscurity only. All actual protection remains via:
- `check-admin-status` edge function (server-side role verification)
- `AdminLayout` auth guard with mandatory 2FA
- RLS policies on all tables

## No changes to
- Edge functions, database, auth logic, RLS policies
- Component file names (only route paths change)

