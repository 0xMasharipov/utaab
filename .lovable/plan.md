

# Navbar Logo Animation + MIT Logo Fix

## 1. Navbar Logo Loading Animation

**Files:** `src/components/Navbar.tsx`, `src/components/education/EducationNavbar.tsx`

Add a loading state to the logo `<img>` element:
- Track `logoLoaded` state with `useState(false)`
- On the `<img>`, add `onLoad={() => setLogoLoaded(true)}`
- While loading: show a subtle skeleton/shimmer placeholder (a small rounded div with `animate-pulse` matching the logo dimensions)
- On load: fade the logo in using a CSS transition (`opacity-0 -> opacity-100` with `transition-opacity duration-500`)
- Also animate the `BrandText` to fade in alongside the logo using a slight delay

### Navbar.tsx changes (lines 177-185):
- Add `const [logoLoaded, setLogoLoaded] = useState(false);`
- Wrap the logo img with conditional opacity: `className={... ${logoLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500}`
- Add `onLoad={() => setLogoLoaded(true)}`
- Add a shimmer placeholder behind/before the img that hides when loaded

### EducationNavbar.tsx changes (similar pattern):
- Same `logoLoaded` state and fade-in animation on the logo img element

## 2. MIT Logo Fix

**File:** `src/pages/education/BlockchainAndMoney.tsx` (line 124)

The MIT logo URL (`https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_logo.svg/180px-MIT_logo.svg.png`) is an external hotlink to Wikipedia, which can be blocked or fail to load.

**Fix:** Replace the external URL with a locally stored SVG. Download/create a simple "MIT" text-based SVG and save it to `public/images/mit-logo.svg`, then reference it as `/images/mit-logo.svg`. Also add an `onError` fallback that shows a text "MIT" badge if the image still fails.

Alternatively, use the direct SVG source URL which is more reliable: `https://upload.wikimedia.org/wikipedia/commons/0/0c/MIT_logo.svg` (without the `/thumb/` path). But the most reliable approach is a local asset.

**Changes:**
- Create `public/images/mit-logo.svg` -- a simple MIT logo SVG
- Update line 124 in `BlockchainAndMoney.tsx`: change `src` to `/images/mit-logo.svg`
- Add `onError` handler to gracefully show a text fallback

## Files Summary

| File | Change |
|------|--------|
| `src/components/Navbar.tsx` | Add logoLoaded state, fade-in animation on logo |
| `src/components/education/EducationNavbar.tsx` | Same logo fade-in animation |
| `src/pages/education/BlockchainAndMoney.tsx` | Fix MIT logo src to local asset, add error fallback |
| `public/images/mit-logo.svg` | Create local MIT logo SVG |

