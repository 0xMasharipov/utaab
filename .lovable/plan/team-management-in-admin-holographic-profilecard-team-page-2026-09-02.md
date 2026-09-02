# Team management in admin + holographic ProfileCard team page

Nothing existing is removed: the current admin sections, routes, styling and translations all stay. This adds a Team Members section to the admin panel, connects the public team page to it, and upgrades the team cards to the React Bits ProfileCard look.

## 1. Admin: Team Members section

A new "Team Members" entry in the admin sidebar (added after Communities, using a new obfuscated route id in the central route config, matching the existing pattern).

The page lists all team members as rows with avatar, name, role, department, published/featured badges and display order, plus search and drag-free ordering via an order number field. Actions: Add member, Edit, Duplicate, Delete (with the existing confirm dialog).

The add/edit dialog covers everything already available on the members table:
- Photo upload through the existing ImageUpload component into the `team/` folder of the media bucket, with preview and remove
- Full name, role title, department
- Bio in EN / TR / RU / AR via the existing translation editor tabs
- Socials: LinkedIn, X/Twitter, Instagram, Telegram, Website, plus contact email and phone (contact fields stay admin-only and are never sent to the public page)
- Display order, Featured toggle, Published toggle

Everything runs against the existing `team_members` table with its admin-only policy — no schema changes, no new tables.

## 2. Public team page reads from the database

`/team` and the homepage team section load published members from the public team view, ordered by display order, with the bio picked for the active language. If the query returns nothing (or fails), the current hardcoded roster renders exactly as it does today, so the page can never come up empty.

The section tag shown above the name (Founder, Engineering, Operations…) comes from the member's department.

## 3. Founder card: no doubled "FOUNDER"

The founder's card currently shows the tag "Founder" and the role "Founder" one under the other. The tag is hidden whenever it matches the role text, so the founder shows a single "Founder" line and every other member keeps both lines.

## 4. Holographic UTAAB corner mark

A small UTAAB icon sits in the top-left corner of every team card: transparent, holographic (soft iridescent sheen that shifts with the pointer) and grainy, low opacity so it reads as a watermark and never competes with the photo. It uses the existing UTAAB logo asset and respects reduced-motion.

## 5. ProfileCard replaces the grid cards

The React Bits ProfileCard (TypeScript + Tailwind variant) is added as a new component and becomes the team grid card: 3D tilt on pointer move, holographic shine and glare layers, cursor-following behind-glow, avatar, name, role, handle line and a Contact action.

Adapted to this project: the glow and inner gradient use the site's blue/navy palette (no purple), the grain and icon pattern layers use the UTAAB mark, tilt is disabled under reduced-motion and on mobile by default, and the Contact button opens the member's primary social link. Clicking the card still opens the existing profile modal (desktop) / drawer (mobile), which is left untouched.

## Technical notes

- New files: `src/components/team/ProfileCard.tsx`, `src/pages/admin/AdminTeam.tsx`, `src/components/admin/TeamMemberFormDialog.tsx`, `src/hooks/useTeamMembers.ts`
- Edited: `src/config/routes.ts`, `src/App.tsx`, `src/components/admin/AdminLayout.tsx`, `src/pages/TeamPage.tsx`, `src/components/Team.tsx`, `src/components/team/TeamOverlapCard.tsx`
- No database migration, no new dependencies; reads go through the existing public team view and writes through the admin-only policy on `team_members`
- Verified with a typecheck and Playwright screenshots of `/team` at 1280px and 390px
