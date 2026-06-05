## Problem
The TonRa project card description is too long, causing text to overflow or visually break out of the card box on mobile viewports.

## Fix
1. **Shorten TonRa descriptions** in all i18n locale files (`en.json`, `tr.json`, `ar.json`) to a more concise version that fits comfortably within 3 lines on narrow mobile screens.
2. **Add `overflow-hidden` safeguard** to the description `<p>` element in `src/components/Projects.tsx` to prevent any remaining text from spilling outside the card bounds.

## Files changed
- `src/i18n/locales/en.json`
- `src/i18n/locales/tr.json`
- `src/i18n/locales/ar.json`
- `src/components/Projects.tsx`