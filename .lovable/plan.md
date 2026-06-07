## Problem
In the navbar mega menu, the Ecosystem column (Community, Learn, Events, Projects) and the Join button use `scrollToSection(id)`, which only calls `document.getElementById` on the current page. When the user is on a non-home route (e.g. `/blog`, `/team`, `/about`), those sections don't exist on the current page, so clicking them does nothing.

## Fix
Make `scrollToSection` route-aware:
- If `window.location.pathname === '/'`: behave as today (close menu, then smooth-scroll to the in-page element).
- Otherwise: close menu, then `navigate('/', { state: { scrollTo: id } })`.

Then on the home page, read that location state and perform the scroll after mount.

### Files
1. **Edit** `src/components/Navbar.tsx`
   - Update `scrollToSection` to navigate to `/` with `state: { scrollTo: id }` when not already on `/`.
   - Keep existing close + delay behavior for in-page scrolls.

2. **Edit** `src/pages/Index.tsx`
   - Add a `useEffect` that reads `useLocation().state?.scrollTo`, and after `showBelowFold` is true and the target element exists, smooth-scrolls to it with the same `navbarHeight` offset (100) used in the navbar.
   - Use a small `MutationObserver` or `setTimeout` retry (up to ~1.5s) because below-fold sections mount lazily after idle. Clear the state via `navigate(pathname, { replace: true, state: {} })` after scrolling so refresh doesn't re-trigger.

## Out of scope
- No styling changes, no admin changes, no changes to page-route links (Blog/Team/About already work via `handleNavigate`).
