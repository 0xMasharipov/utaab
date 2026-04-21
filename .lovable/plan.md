

## Add LinkedIn link to Mehmet BARUK

### Change
In `src/pages/TeamPage.tsx`, update Mehmet's entry in the `teamMembers` array to include a LinkedIn URL:

```ts
{ key: 'mehmetBaruk', image: mehmetBarukImg, tag: 'Advisory', linkedin: 'https://linkedin.com/in/mehmet-baruk' }
```

The `TeamOverlapCard`, `TeamProfileModal`, and `TeamProfileDrawer` components already conditionally render the LinkedIn button when `member.linkedin` is set — no component changes needed.

### Files touched
- **Modified:** `src/pages/TeamPage.tsx` (one line)

### Untouched
`src/components/Team.tsx` (homepage section doesn't render LinkedIn), i18n, asset, ordering, styles.

### Risk: trivial
Single property addition.

