

## Replace hero videos with new high-res versions

### Mapping (by aspect ratio)

| Uploaded file | Likely target | Reason |
|---|---|---|
| `hf_20260304_042253_561d7c06...3.mp4` | `public/videos/hero-cube.mp4` (desktop) | Landscape/widescreen master |
| `UTAAB_HERO_600x839-2.mp4` | `public/videos/hero-tablet.mp4` | 600×839 portrait-ish — tablet |
| `UTAAB_Mobile-2.mp4` | `public/videos/hero-mobile.mp4` | Explicitly named "Mobile" |

I'll verify dimensions with `ffprobe` once in default mode and confirm the mapping before overwriting; if any file's aspect doesn't match the slot it's named for, I'll re-route accordingly (e.g. swap tablet/desktop).

### Steps

1. Copy the 3 uploaded videos into `public/videos/`, overwriting:
   - `hero-cube.mp4` (desktop)
   - `hero-tablet.mp4`
   - `hero-mobile.mp4`
2. Run `ffprobe` to confirm resolution/duration on each replaced file and log it.
3. Verify file sizes are still reasonable for hero preload (the inline `<link rel="preload" as="video">` in `index.html` already auto-skips on Save-Data / 2g, so no code changes needed).
4. No changes to `Hero.tsx`, `index.html`, paths, breakpoints, or autoplay/muted/loop logic — same filenames means existing preload + crossfade keeps working.

### Files changed

- `public/videos/hero-cube.mp4` (replaced)
- `public/videos/hero-tablet.mp4` (replaced)
- `public/videos/hero-mobile.mp4` (replaced)

### Does NOT change

- `Hero.tsx`, `index.html`, viewport detection, preload script, crossfade timing
- Skeleton, layout, animations, captions
- Other videos (`hero-bg.mp4`, `hero-cube-poster.jpg`) untouched

### Risk: very low
Pure asset swap. If a new file is heavier and feels slow on first load, we can re-encode (H.264 high profile, CRF 26, faststart) in a follow-up — file names and code stay the same.

### Note on caching
Browsers/CDN may cache the old files. After deploy, a hard refresh shows the new clips. No code change is needed for cache busting since these are direct `/videos/*.mp4` references.

