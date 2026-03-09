

# Fix Remaining Line and Text Visibility

## Root Cause of the Line
The hero has a solid `background: '#fff'` that sits ON TOP of the global gradient. The bottom fade tries to bridge white → blue, but can never perfectly match the global gradient color at that exact scroll position (which varies by total page height). This creates a visible seam.

## Fix Strategy
Remove the hero's opaque white background entirely. Since the global gradient already starts at `#ffffff` at the top of the page, the hero doesn't need its own background — the gradient provides white naturally. With both hero and stats sections transparent on the same gradient, there's no possible seam.

## Changes

### 1. `src/components/Hero.tsx`
- Remove `style={{ background: '#fff' }}` from the section — let it be transparent
- Remove the bottom fade overlay div entirely (lines 192-200) — no longer needed since there's no background mismatch
- Keep the video and the left-to-right gradient overlay for text readability (these work fine on top of the global gradient)

### 2. `src/components/Community.tsx` — Text visibility
- Update `.glass` cards to use slightly darker, more opaque backgrounds for better text contrast
- Add inline styles: `background: rgba(8, 20, 40, 0.45)`, `backdropFilter: blur(16px)`, `border: 1px solid rgba(255,255,255,0.1)`
- Section headings: add subtle text-shadow for readability against the mid-blue gradient

### 3. `src/components/Learn.tsx`, `Events.tsx`, `Resources.tsx`, `Join.tsx` — Text visibility
- Same card treatment: replace `.glass` class with inline darker glass styles on cards
- These sections sit on deeper parts of the gradient so existing white text should be fine, but cards need more contrast from the background

### 4. `src/index.css` — New utility class
- Add `.glass-section` class: `background: rgba(8, 20, 40, 0.4); backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.1)`
- This provides a consistent darker glass for section cards that need more contrast against the blue gradient

## Result
- Zero seam between hero and stats — both float on the same gradient
- Text in all sections is clearly readable with balanced darker surfaces + white text
- The video and its overlay still work perfectly for hero readability

