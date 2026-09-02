# Remove button-style boxes from text badges and tags

## Goal
Strip the "button-like" boxed styling (`rounded-full`, `bg-*`, `border`, `px-* py-*` padding) from text labels across the site so they read as plain text/metadata instead of clickable chips.

## Scope
Update every instance where a non-interactive text label is rendered inside a pill/badge box. Keep the text and any semantic color; remove the box shape.

## Files and changes

1. **UBpoint page** (`src/pages/projects/UBpointPage.tsx`)
   - Hero/top "Beta — Live" / category eyebrow (line ~535): remove box, keep as plain uppercase text or a small dot + text.
   - Sponsor CTA chips (lines ~626, ~635): remove `rounded-full bg-* border px-* py-*`.
   - Floating reward pill (line ~684): de-box or keep only minimal text styling.
   - Section eyebrows (lines ~881, ~955): convert to plain text eyebrows.

2. **Projects grid** (`src/components/Projects.tsx`)
   - Status badge (line ~134): remove emerald/muted pill background and ring; keep colored text only.
   - Tags (line ~158): remove `rounded-full bg-white/[0.06] border` pill styling; keep text as muted metadata.

3. **Blog cards** (`src/components/blog/BlogCard.tsx`)
   - Tags (line ~60): remove `rounded-full bg-accent/10 border` pill; keep accent-colored text.

4. **TonRa page** (`src/pages/projects/TonRaPage.tsx`)
   - Hero status eyebrow (line ~126): keep as plain text in the eyebrow row.
   - Tech chips (line ~164): remove `rounded-full border bg-white/[0.02]` pill styling.

5. **Resources page** (`src/pages/ResourcesPage.tsx`)
   - "Coming soon" badge (line ~123): remove amber pill box; keep amber text only.

6. **Team page** (`src/pages/TeamPage.tsx`)
   - Hero eyebrow badge (line ~80): remove accent pill box; keep accent text.

7. **Verify certificate page** (`src/pages/VerifyCertificate.tsx`)
   - Status badge (line ~164): remove primary pill box; keep primary text + icon.

8. **Lesson navigation** (`src/components/learning/LessonNavigation.tsx`)
   - Progress badge (line ~107): remove green pill box; keep green text.

## Design rule
- Non-interactive metadata should not look like buttons.
- Replace pills with one of:
  - Plain colored text (`text-emerald-400`, `text-accent`, `text-muted-foreground`).
  - Text preceded by a small dot (`•`) or divider when grouping multiple items.
  - Comma-separated tag lists for blog/project tags.
- Preserve interactive buttons (CTAs, nav links, filters) unchanged.

## Verification
- Build passes.
- Visual check on `/`, `/blog`, `/projects/ubpoint`, `/projects/tonra`, `/team`, `/resources`, certificate verification, and education lesson navigation.
- Confirm no pill/box styling remains on non-interactive text labels.
