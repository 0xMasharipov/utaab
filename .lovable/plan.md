

## Verify Lovable badge stays hidden across all navbar destinations

### Scope
Navigate to every destination reachable from the main navbar menu and confirm `#lovable-badge` is either absent from the DOM or has computed `display: none`.

### Routes to check
From `Navbar.tsx`, the menu links resolve to:

**Page routes (navigate)**
1. `/` (home — baseline)
2. `/resources`
3. `/blog`
4. `/education`
5. `/about`
6. `/team`
7. `/contributor-match`

**Same-page scroll targets** (all on `/`, badge state can't change between scrolls — covered by route 1)
- `#community`, `#learn`, `#events`, `#projects`, `#join`

### Verification per route
For each page route:
1. `browser--navigate_to_sandbox` with the path
2. `browser--extract` running:
   ```js
   const el = document.getElementById('lovable-badge');
   return {
     present: !!el,
     display: el ? getComputedStyle(el).display : null,
     visibility: el ? getComputedStyle(el).visibility : null,
     opacity: el ? getComputedStyle(el).opacity : null,
   };
   ```

### Pass criteria
For every route: `present === false` OR `display === 'none'`.

### On failure
If any route shows the badge visible, report the route and propose a stronger rule (e.g., add `visibility: hidden !important; opacity: 0 !important; pointer-events: none !important;` and/or an attribute selector fallback).

### Note
Switches to default mode only to run the browser checks. No code edits planned unless verification fails.

