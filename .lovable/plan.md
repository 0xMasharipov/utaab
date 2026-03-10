

# Add Admin Sign In Button to Dropdown Menu

## Change

Add a small, secondary "Admin Sign In" link below the student auth button in the bottom CTA row of the mega menu. Per the memory context, it should be a smaller secondary link that navigates to `/admin/login`.

## Implementation — `src/components/Navbar.tsx`

After the student auth button (line ~369), add an admin sign-in link styled as a subtle text link:

```tsx
{/* Admin Sign In - secondary link */}
<button
  onClick={() => handleNavigate('/admin/login')}
  className="text-xs text-white/40 hover:text-white/70 transition-colors duration-200"
>
  {t('nav.adminSignIn', 'Admin Sign In')}
</button>
```

Place it right after the student auth `<button>` element, wrapping both in a flex column so the admin link sits below the student button as a smaller secondary action.

## Files Modified
- `src/components/Navbar.tsx` — add admin sign-in link in bottom CTA area

