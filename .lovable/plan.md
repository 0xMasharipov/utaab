## Problem
On mobile (and sometimes desktop), navigating between routes lands you scrolled to the bottom near the footer. React Router does not reset scroll on navigation, so the new page inherits the previous page's scroll position.

## Fix
Add a small `ScrollToTop` component that scrolls to the top whenever the pathname changes, and mount it inside `BrowserRouter` in `src/App.tsx`.

### Files
1. **New** `src/components/ScrollToTop.tsx`
   - Listens to `useLocation().pathname` and calls `window.scrollTo({ top: 0, left: 0 })` in an effect.
   - Skips scroll reset when the URL has a hash (`#projects`, etc.) so in-page anchor links still work.
   - Returns `null`.

2. **Edit** `src/App.tsx`
   - Import and render `<ScrollToTop />` as the first child inside `<BrowserRouter>`, before `<Routes>`.

## Out of scope
- No changes to per-page layouts, admin panel, or styling.
- No changes to hash-anchor scroll behavior on the home page.
