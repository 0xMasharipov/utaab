

# Change Contributor Match Icon + Fix Hero Video Play Button & Fallback

## 1. Replace Sparkles with GitMerge icon

Replace `Sparkles` with `GitMerge` in all contributor-related files:

| File | Change |
|------|--------|
| `src/components/admin/AdminLayout.tsx` | Import `GitMerge` instead of `Sparkles`, use for Contributors sidebar item |
| `src/components/contributor/ContributorHero.tsx` | Import `GitMerge` instead of `Sparkles`, use in the badge |
| `src/pages/admin/AdminContributorAssessments.tsx` | Import `GitMerge` instead of `Sparkles`, use in avatar circles and empty state |

## 2. Fix Hero video play button appearing on some devices

The `<video>` element currently has `pointer-events-none` but some mobile browsers still show a native play button overlay. Fix by adding CSS to hide native controls:

**`src/components/Hero.tsx`**:
- Add `controls={false}` explicitly (redundant but helps some browsers)
- Add inline style `WebkitMediaControls` or use a CSS class to hide native video controls
- Add `x-webkit-airplay="deny"` attribute workaround

**`src/index.css`** (or `App.css`):
- Add CSS rules to suppress native video play buttons:
```css
video::-webkit-media-controls,
video::-webkit-media-controls-panel,
video::-webkit-media-controls-play-button,
video::-webkit-media-controls-start-playback-button {
  display: none !important;
  -webkit-appearance: none;
}
```

## 3. Remove poster image fallback — use solid color instead

When video hasn't loaded, instead of showing the poster image (`hero-cube-poster.jpg`), show the solid dark navy background (`#061224`). This avoids a static "dummy" image flash.

**`src/components/Hero.tsx`**:
- Remove `poster="/videos/hero-cube-poster.jpg"` from the `<video>` tag
- The existing `style={{ background: '#061224' }}` on the section already provides the fallback
- The video fades in via the existing `opacity: videoReady ? 1 : 0` transition

These changes apply to both desktop and mobile versions since the same `<video>` element handles both via the `isMobile` key switch.

## Files Modified

| File | Change |
|------|--------|
| `src/components/Hero.tsx` | Remove poster, add controls={false}, suppress native controls |
| `src/index.css` | Add CSS to hide native video controls |
| `src/components/admin/AdminLayout.tsx` | Sparkles → GitMerge |
| `src/components/contributor/ContributorHero.tsx` | Sparkles → GitMerge |
| `src/pages/admin/AdminContributorAssessments.tsx` | Sparkles → GitMerge |

