

# Remove Duplicate "Create Account" Link on Sign In Page

## Problem
The Student Sign In page shows two identical "Create Account" links because both the page wrapper (`EducationSignIn.tsx`) and the form component (`EducationRegisterForm.tsx`) each render one.

## Fix
Remove the "Create Account" link from inside `EducationRegisterForm.tsx` (the signin mode block, lines 546-557), keeping only the one in the parent `EducationSignIn.tsx` page.

## Technical Details

### File: `src/components/forms/EducationRegisterForm.tsx`
Delete the following block (lines 546-557) from the signin form:
```tsx
// REMOVE THIS:
<div className="text-center pt-4">
  <p className="text-muted-foreground">
    {t('education.registration.noAccount')}{' '}
    <button type="button" onClick={() => navigate('/education/register')}
      className="text-accent hover:underline font-medium">
      {t('education.registration.createAccount')}
    </button>
  </p>
</div>
```

The parent page `EducationSignIn.tsx` already has an identical link and will continue to show it.

| File | Change |
|------|--------|
| `src/components/forms/EducationRegisterForm.tsx` | Remove duplicate "Create Account" link block from signin mode |

