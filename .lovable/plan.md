

# Refine Hero: Bigger Text, Better Mobile/Tablet, New Tags

## Changes (all in `src/components/Hero.tsx`)

### 1. Replace pill tags
Remove `['Academic Infrastructure', 'Blockchain', 'Research Innovation']` array. Replace with a single line of spaced words: **CONNECT · LEARN · BUILD** — styled as a tracking-widest uppercase tagline, not pill badges. Uses `#0B3C6D` color, `letter-spacing: 0.25em`, font-weight 600, font-size 13px.

### 2. Bigger desktop text
- Headline: change clamp from `clamp(36px, 5vw, 64px)` → `clamp(32px, 5.5vw, 72px)` for larger desktop size
- Description: 18px → 20px on desktop

### 3. Mobile/tablet refinements
- **Mobile** (< 640px): min-h `100svh`, padding 80px top / 60px bottom, headline ~32px, description 16px, buttons full-width stacked
- **Tablet** (640px–1024px): padding 100px top/bottom, headline ~44px, center-aligned layout
- Gradient overlay on mobile: make it more opaque so text is readable over the 3D cube — change to a center-radial white overlay on small screens using a responsive approach
- Mobile overlay: `linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.75) 60%, rgba(255,255,255,0.5) 100%)` — vertical gradient for portrait orientation

### 4. Video visibility
The 3D logo in the video isn't visible because the white overlay is too strong on the right side. On desktop this is fine (right column shows video). On mobile the vertical overlay will be lighter at the bottom, letting the cube peek through beneath the text.

## Single file change

| File | Change |
|------|--------|
| `src/components/Hero.tsx` | Replace pills with "CONNECT · LEARN · BUILD" tagline, increase headline size, add responsive breakpoint styles for mobile/tablet, adjust mobile overlay gradient |

