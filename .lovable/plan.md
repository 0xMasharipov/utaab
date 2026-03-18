

# Update Email Templates — Navy Background, White Card, UTAAB Branding

## Summary
Update all 6 email templates to use a consistent navy/dark blue background (no dark mode switching), white card always, and ensure "UTAAB" is always capitalized correctly.

## Changes

**Files (6 templates in `supabase/functions/_shared/email-templates/`):**
- `signup.tsx`, `recovery.tsx`, `invite.tsx`, `email-change.tsx`, `magic-link.tsx`, `reauthentication.tsx`

**Per template:**
1. **Background**: Change `main.backgroundColor` from `#F4F7FB` to navy gradient blue `#081020` — consistent in both light and dark mode
2. **Remove dark mode media query**: Delete the `@media (prefers-color-scheme: dark)` style block since background is now always navy
3. **Card stays white**: Inner container remains `#ffffff` with white background (no change needed)
4. **Footer text**: Ensure `powered` text says "© Powered by UTAAB" (already correct, verify capitalization)
5. **Footer text color**: Update footer/powered text colors to be visible on navy background context (they're inside the white card so remain as-is)

**Post-edit:** Redeploy `auth-email-hook` edge function.

## Technical Details

Style changes per template:
```
// Remove: <style> with @media (prefers-color-scheme: dark) block
// Change: main.backgroundColor from '#F4F7FB' to '#081020'
// Keep: container.backgroundColor as '#ffffff'
```

