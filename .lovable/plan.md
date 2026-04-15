

# Add GitHub to Footer Social Section & Rename to "Follow Us"

## Current State
The footer already has a "Social" section with 4 icons (LinkedIn, Telegram, Instagram, X) using Iconoir. The user wants to add GitHub and update the section to feel like a "Follow Us" section with brand-color hover effects.

## Changes

### `src/components/Footer.tsx`
1. Import `GitHub` from `iconoir-react` (add to existing import)
2. Add GitHub entry to `socialLinks` array:
   ```ts
   { name: 'GitHub', icon: GitHub, url: 'https://github.com/UTAA-Blockchain', ariaLabel: 'Visit UTAAB on GitHub', hoverColor: 'hover:text-white' }
   ```
3. Update Instagram URL to clean version: `https://www.instagram.com/utaa_blockchain`
4. Add per-icon brand-color hover effects via a `hoverClass` field on each social link:
   - LinkedIn: `hover:text-[#0A66C2]` (LinkedIn blue)
   - Telegram: `hover:text-[#26A5E4]` (Telegram blue)
   - Instagram: `hover:text-[#E4405F]` (Instagram pink)
   - X: `hover:text-white`
   - GitHub: `hover:text-white`
5. Apply the per-icon `hoverClass` instead of the generic `hover:text-accent` on the icon links
6. Keep existing border glow, scale, glass styling, and layout unchanged

### `src/i18n/locales/en.json`, `tr.json`, `ar.json`, `ru.json`
- Update `footer.social` key from current value to "Follow Us" (and translations: "Bizi Takip Edin", "تابعنا", "Подписывайтесь")

## What does NOT change
- Footer layout, grid, spacing, other columns
- Newsletter, Navigation, Brand sections
- No new dependencies — `GitHub` icon exists in `iconoir-react`

## Files Modified
- `src/components/Footer.tsx`
- `src/i18n/locales/en.json`, `tr.json`, `ar.json`, `ru.json` (one key each)

