

## Add TikTok social link to footer

### Change
Add a TikTok entry to the `socialLinks` array in `src/components/Footer.tsx` so it renders alongside LinkedIn, Telegram, Instagram, X, and GitHub.

- **URL:** `https://www.tiktok.com/@utaa_blockchain`
- **Icon:** `iconoir-react` doesn't ship a TikTok glyph, so use `MusicNote` from `iconoir-react` as the closest stylistic match — OR add `lucide-react`'s `Music2` icon. Recommended: import the official TikTok SVG inline as a small component to stay on-brand (a 5-point path), since the footer already uses brand-colored hovers.
- **Hover color:** TikTok brand cyan/magenta — `hover:text-white hover:border-white/40 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]` (matches X/GitHub neutral treatment) to avoid clashing dual-color brand.
- **aria-label / title:** `Visit UTAAB on TikTok`
- **Position:** Insert after Instagram, before X (visual flow: LinkedIn → Telegram → Instagram → TikTok → X → GitHub).

### Implementation
1. Add a small inline `TikTokIcon` functional component at the top of `Footer.tsx` that renders the official TikTok SVG path, accepting `className` and `strokeWidth` props to match the existing icon API.
2. Add the new entry to the `socialLinks` array using `TikTokIcon` as `icon`.

No other files touched. No config, route, or i18n changes needed (aria-label is English-only like the others).

### Files
- **Modified:** `src/components/Footer.tsx`

### Risk: trivial
Pure additive change to one array + one tiny inline icon component.

