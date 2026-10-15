# Smooth iPhone menu opening and closing

## Scope
- Repair the public bottom menu’s opening and closing motion on iOS without redesigning it.
- Keep the supplied logos, UTAAB glass styling, links, languages and existing scroll/footer visibility rules. Leave education/admin navigation and footer artwork unchanged.

## Findings
- The menu currently combines a CSS width transition with a separate animation from zero to automatic panel height. These animations use different durations.
- Reduced Motion currently makes the panel and shell transitions almost instantaneous; link entrance motion still uses a separate duration.
- These are confirmed implementation details, not a confirmed diagnosis of the reported iPhone failure. First check normal and Reduced Motion behavior to distinguish suppressed motion from layout or rendering issues.

## Changes
- Coordinate the shell expansion, panel reveal, icon transition and link entrances so opening and closing feel like one continuous motion.
- Replace automatic-height animation with stable, explicitly measured panel dimensions if the checks confirm sizing instability. Account for narrow screens, translated content, rotation and Safari’s changing browser bars.
- Keep the panel mounted until closing finishes; prevent collapsing-width text reflow from causing jumps or clipping during exit.
- Make repeated taps reverse the current transition cleanly, without flicker, stuck states or duplicated actions.
- Use the same motion behavior on desktop and iOS. For Reduced Motion, retain a brief, gentle fade rather than an abrupt snap, without forcing the full expansion effect.
- Retain supported Safari glass blur and a readable fallback; avoid animating blur or experimental filters.
- Preserve touch dismissal, Escape, focus handling and non-focusable hidden links, including during closing.

## Technical details
- Limit the repair to the local floating-menu component and its stylesheet, with visibility-hook changes only if reproduction establishes they are necessary.
- Use one coordinated animation timing system and measured geometry where needed; clean up animation frames, observers and pending completion callbacks.
- Record any changed animation convention in the existing architecture guidance during implementation.

## Verification
- Test phone-sized and desktop views with normal and Reduced Motion settings.
- Capture collapsed, mid-opening, fully open, mid-closing and closed states; sample dimensions and opacity across frames to verify actual motion rather than only final appearance.
- Exercise rapid repeated taps, both close controls, outside dismissal, reopening, internal scrolling, language changes and navigation.
- Verify scroll-down hiding, scroll-up reveal and footer-triggered closing still work, with no overflow or invisible clickable links.
- Check preview errors and Safari/WebKit behavior where available. Browser emulation cannot prove physical iPhone behavior; final device confirmation requires checking the updated menu on your iPhone.