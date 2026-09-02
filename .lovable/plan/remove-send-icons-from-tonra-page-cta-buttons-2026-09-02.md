# Remove Send icons from TonRa page CTA buttons

## Goal
Remove the Telegram-style `Send` icons from both CTA buttons on the `/projects/tonra` page because they look out of place.

## Scope
- `src/pages/projects/TonRaPage.tsx` only.

## Changes
1. Remove the `<Send className="w-4 h-4" />` icon from the hero primary CTA button (currently next to "Try the beta" text).
2. Remove the `<Send className="w-4 h-4" />` icon from the bottom primary CTA button (currently next to "Open @TonRa_Robot" text).
3. Keep the button text, links, styling and all surrounding layout unchanged.
4. Remove the now-unused `Send` import from `lucide-react`.

## Verification
- Typecheck passes.
- Playwright screenshot confirms both CTA buttons no longer show the paper-plane icon.
