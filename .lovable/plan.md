Hide education mobile bottom navbar while CUTİİ AI chat is open

Problem
On phones, the education mobile dock (bottom navbar) stays visible when the user opens the CUTİİ AI chat panel. The dock covers the chat composer, so students cannot type or tap Send.

Solution
1. Track panel open state on `document.body`
   - In `src/components/education/CutiiAIPanel.tsx`, add a `useEffect` tied to the `isOpen` state.
   - When `isOpen` is true, add the class `cutii-panel-open` to `document.body`.
   - Remove the class when `isOpen` becomes false or the component unmounts.

2. Hide the mobile dock via CSS
   - In `src/styles/education.css`, inside the existing `@media (max-width: 767px)` block, add:
     ```css
     body.cutii-panel-open .edu-mobile-dock {
       display: none;
     }
     ```
   - This only affects the mobile bottom dock; the desktop side dock stays untouched.

3. Verify no regressions
   - Confirm the panel still opens/closes normally on mobile and desktop.
   - Confirm the mobile composer is fully reachable and the Send button is tappable.
   - Confirm the dock reappears after closing the chat.

Files to change
- `src/components/education/CutiiAIPanel.tsx`
- `src/styles/education.css`
