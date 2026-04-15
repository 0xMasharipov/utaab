

# Fix Navbar Resources Navigation + Add About Us to Footer

## Problem
The navbar has items (Resources, Learn, Community) that try to scroll to sections not present on the Index page. The "Resources" click does nothing. Footer is also missing an "About Us" link.

## Solution

### 1. Add missing sections to Index page (`src/pages/Index.tsx`)
Add `<Community />`, `<Learn />`, and `<Resources />` components to the Index page inside `<BackgroundGrid>`, restoring the scroll targets:

```
<AboutBlurb />
<Community />    ← add
<Learn />        ← add
<Resources />    ← add
<Projects />
<Events />
<BlogSection />
<Join />
<Footer />
```

### 2. Add "About Us" link to Footer (`src/components/Footer.tsx`)
Add an "About Us" entry to the `navLinks` array, linking to `/about`:

```ts
{ label: t('footer.aboutLink', 'About Us'), href: '/about' },
```

Place it after "Home" and before "Projects".

## Files Modified
- `src/pages/Index.tsx` — Import and render Community, Learn, Resources sections
- `src/components/Footer.tsx` — Add About Us nav link

