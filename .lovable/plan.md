

# Add LinkedIn Profile Links to Team Members

## Summary
Add real LinkedIn URLs to the team member data and convert the placeholder `<button>` elements in the modal/drawer into actual `<a>` links that open in new tabs.

## Changes

### File: `src/pages/TeamPage.tsx` (lines 28-37)
Add `linkedin` property to each team member that has one. Members without a provided URL (abdulbaki, umut, ibrahim) keep `linkedin` undefined.

```
{ key: 'zinurbek', ..., linkedin: 'https://linkedin.com/in/masharipov' },
{ key: 'yunus', ..., linkedin: 'https://linkedin.com/in/yunus-emre-e-80921034b' },
{ key: 'abdulla', ..., linkedin: 'https://linkedin.com/in/abdulla-hamzali-59b5a5229' },
{ key: 'anar', ..., linkedin: 'https://linkedin.com/in/anar-malikov-0430203b6' },
{ key: 'yana', ..., linkedin: 'https://linkedin.com/in/yanina-isak-a62191367' },
{ key: 'shuayb', ..., linkedin: 'https://linkedin.com/in/shuayb-allahverdiyev-933813291' },
{ key: 'burak', ..., linkedin: 'https://linkedin.com/in/burak-deniz-yaman-63aa263b3' },
```

### File: `src/components/team/TeamProfileModal.tsx` (lines 66-71)
Replace `<button>` with `<a>` tag:
- `href={member.linkedin}`, `target="_blank"`, `rel="noopener noreferrer"`
- Dynamic `aria-label` using member name
- Only render when `member.linkedin` exists

### File: `src/components/team/TeamProfileDrawer.tsx` (lines 55-61)
Same change — replace `<button>` with `<a>` tag with proper attributes. Only render when `member.linkedin` exists.

## Files modified
- `src/pages/TeamPage.tsx` — add linkedin URLs to data
- `src/components/team/TeamProfileModal.tsx` — button → link
- `src/components/team/TeamProfileDrawer.tsx` — button → link

