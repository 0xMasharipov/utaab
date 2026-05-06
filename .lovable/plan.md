## Goal

Stop exposing the obfuscated admin login by redirecting `/admin` (and any `/admin/*` path). Instead, render the existing 404 NotFound page so visitors who guess `/admin` see no hint that an admin area exists.

## Current behavior

In `src/App.tsx`:
```tsx
<Route path="/admin/*" element={<Navigate to={ADMIN_ROUTES.LOGIN} replace />} />
```
Visiting `https://utaab.org/admin` redirects to the obfuscated admin login route, leaking its existence.

## Change

Replace the redirect with the existing `NotFound` page so `/admin` and any sub-path render the normal 404:

```tsx
<Route path="/admin/*" element={<NotFound />} />
```

`NotFound` is already imported and used by the catch-all `*` route, so no new imports are needed.

## Notes

- The legitimate admin entrance remains the obfuscated route defined in `src/config/routes.ts` (`ADMIN_ROUTES.LOGIN`). Nothing about the real admin flow changes.
- The `/education/admin/*` legacy redirect is left as-is unless you want the same treatment — let me know if it should also 404.
