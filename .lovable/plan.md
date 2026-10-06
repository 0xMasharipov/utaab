# Remove perks column from the Join section

## What changes
- In `src/components/Join.tsx`, remove the left-hand intro column entirely: the eyebrow ("UTAAB · Join"), the section title/subtitle, and the four benefit items ("Free blockchain education", "Build real Web3 projects", "Student-led community", "Cross-border collaboration") all go away.
- The section becomes a single centered layout: the modernized glass join form on its own, centered on the page (max-width container), same spacing/rhythm on phones and computers.
- The `#join` and `#join-form` anchors stay in place so every "Join UTAAB" button still lands directly on the form.

## What stays untouched
- The redesigned form itself (`CommunityJoinForm`): glass styling, grouped steps, validation, captcha, saving, WhatsApp redirect — all unchanged.
- No new text is added; nothing else on the page changes.

## Technical details
- Edit only `src/components/Join.tsx`; drop the `GraduationCap/Users/Rocket/Globe` imports and the `perks` array with them (no dead code).
- Centering via the existing `section-container` plus a `mx-auto max-w-2xl` wrapper for the form.
