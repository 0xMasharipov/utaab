## Summary
Reorder the main page so Projects ("What We Build") appears before Community ("Community Projects"). Remove the Resources section from the homepage and place it on the `/learn/guides` (Educational Guides) page. Update the navbar to reflect that `resources` is no longer a homepage scroll target.

## Detailed Plan

### 1. Reorder homepage sections (`src/pages/Index.tsx`)
Current order: AboutBlurb → Community → Learn → Resources → Projects → Events → BlogSection → Join
New order: AboutBlurb → Projects → Community → Learn → Events → BlogSection → Join
- Remove `<Resources />` from the BackgroundGrid children
- Move `<Projects />` before `<Community />`

### 2. Move Resources to Educational Guides page (`src/pages/learn/EducationalGuides.tsx`)
- Import the `Resources` component
- Render `<Resources />` after the existing Learning Journey section (before Footer)
- Wrap it in the `section-container` for consistent padding

### 3. Update Navbar (`src/components/Navbar.tsx`)
- Remove `{ key: 'resources', id: 'resources' }` from `navItems` since `#resources` no longer exists on the homepage
- Keep the `/resources` page link in the mega menu unchanged (it already routes to the dedicated page)

### 4. Verify no broken links
- Check that the mega menu's "Resources" link under Explore still works (it uses `/resources`, not `#resources`)
- Confirm no other components reference `document.getElementById('resources')` for scrolling