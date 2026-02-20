

# Refine Mobile Menu: Blur, Readability, Education Button, and Sign In Visibility

## Overview
Improve the mobile menu in `src/components/Navbar.tsx` to have better blur/readability, make the Education Platform button stand out with blue styling, and make the Sign In option more prominent for new users.

## Changes (all in `src/components/Navbar.tsx`)

### 1. Increase Background Opacity and Blur for Readability
Change the mobile menu panel background from `rgba(15, 23, 42, 0.75)` to `rgba(10, 15, 30, 0.92)` and increase blur from `32px` to `40px`. This makes the background more opaque so text is clearly readable against any page content behind it.

### 2. Style Education Platform as a Blue Button
Replace the plain text menu item for Education Platform (lines 439-451) with a styled blue button:
- Use a gradient blue background (`bg-gradient-to-r from-blue-600 to-blue-500`)
- Rounded pill shape with white text and bold font
- Full width, centered text
- Subtle hover brightening effect

### 3. Make Sign In More Visible
Replace the current subtle "Account" section (lines 455-488) with a more prominent Sign In area:
- Add a clear "Sign In" styled button with an outlined/bordered style (`border border-white/40`) so it visually stands out as an action
- Include a `User` icon next to the text
- Keep admin sign in as a smaller secondary link below
- Remove the small "Account" header label -- the button itself is self-explanatory

### 4. Summary of Visual Changes

| Element | Before | After |
|---------|--------|-------|
| Menu background | 75% opacity, 32px blur | 92% opacity, 40px blur |
| Education Platform | Plain white text link | Blue gradient pill button |
| Student Sign In | Plain text under small "Account" label | Bordered button with User icon |
| Admin Sign In | Same style as student | Small secondary text link |

## Technical Details

### File: `src/components/Navbar.tsx`

**Line 389**: Change background opacity from `0.75` to `0.92`

**Line 391**: Change blur from `32px` to `40px`

**Lines 439-451**: Replace Education Platform plain button with:
```tsx
<Button
  onClick={handleEducationClick}
  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl min-h-[44px]"
  size="lg"
>
  {t('education.title')}
</Button>
```

**Lines 455-488**: Replace Account section with prominent Sign In button:
```tsx
<button
  role="menuitem"
  onClick={() => { closeMobileMenu(); setTimeout(() => navigate('/education/sign-in'), 200); }}
  className="flex items-center justify-center gap-2 w-full text-base font-semibold text-white border border-white/40 hover:bg-white/15 transition-all py-3 px-4 rounded-xl min-h-[44px]"
>
  <User className="h-5 w-5" />
  {t('nav.studentAuthOptions')}
</button>

<button
  role="menuitem"
  onClick={() => { closeMobileMenu(); setTimeout(() => navigate('/admin/login'), 200); }}
  className="text-center text-sm text-white/50 hover:text-white/80 transition-all py-2 px-4 rounded-xl"
>
  {t('nav.adminSignIn')}
</button>
```

