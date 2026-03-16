

# Team Members Management + Contributor Icon Refinement

## Overview
Add a full Team Members admin CRUD module backed by a new `team_members` database table, convert the public Team pages to render dynamically from the database, and refine the Contributor Match icon across the app.

## 1. Database Migration

Create `team_members` table:

```sql
CREATE TABLE public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  role_title text NOT NULL,
  department text NOT NULL DEFAULT 'Operations',
  bio_en text,
  bio_tr text,
  bio_ru text,
  bio_ar text,
  image_url text,
  email text,
  phone text,
  linkedin_url text,
  twitter_url text,
  instagram_url text,
  telegram_url text,
  website_url text,
  display_order integer NOT NULL DEFAULT 0,
  is_featured boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Public can view published members
CREATE POLICY "Published team members viewable by everyone"
  ON public.team_members FOR SELECT TO public
  USING (is_published = true);

-- Admins can do everything
CREATE POLICY "Admins can manage team members"
  ON public.team_members FOR ALL TO public
  USING (has_role(auth.uid(), 'admin'::app_role));
```

Seed existing 10 team members with an INSERT migration so current data is preserved.

## 2. Admin Panel — Team Members Page

**New file**: `src/pages/admin/AdminTeamMembers.tsx`

Follows the same pattern as `AdminBlog.tsx`:
- Searchable list with department filter and published/unpublished tabs
- Table with thumbnail, name, role, department, order, featured badge, publish toggle
- Edit/Delete buttons per row
- "Add Team Member" button opens form dialog
- Delete uses `DeleteConfirmDialog`
- Reorder via numeric `display_order` field (inline editable)

**New file**: `src/components/admin/TeamMemberFormDialog.tsx`

Dialog with fields:
- Full Name, Role/Position, Department (select), Bio (textarea, multi-lang tabs)
- Image upload via existing `ImageUpload` component (folder: `team`)
- Email, Phone, LinkedIn, Twitter, Instagram, Telegram, Website
- Display Order (number), Featured toggle, Published toggle

## 3. Admin Sidebar & Routing

**`src/components/admin/AdminLayout.tsx`**: Add sidebar item `{ icon: UsersRound, label: 'Team Members', path: '/admin/team' }` after Communities.

**`src/App.tsx`**: Add route `<Route path="team" element={<AdminTeamMembers />} />` inside the admin routes.

## 4. Public Website Integration

**`src/pages/TeamPage.tsx`** and **`src/components/Team.tsx`**: Replace hardcoded `teamMembers` array with a query to `team_members` table filtered by `is_published = true`, ordered by `display_order`.

The `TeamOverlapCard` component will receive data from the database instead of i18n keys. Update its interface to accept database fields directly (name, role, bio, image_url, department, social links) while keeping the same visual design.

**`src/components/team/TeamOverlapCard.tsx`**: Extend `TeamMember` interface to support both legacy i18n keys and direct database fields. Cards will show social icons when URLs are present.

## 5. Contributor Match Icon Refinement

Replace `Sparkles` with `GitMerge` (from lucide-react) across:
- `src/components/admin/AdminLayout.tsx` — sidebar icon for Contributors
- `src/components/contributor/ContributorHero.tsx` — hero badge icon
- `src/components/Navbar.tsx` — no icon currently used in nav text, no change needed

`GitMerge` represents merging/matching of branches (contributors), fits the Web3 collaboration concept, and is visually clean and consistent with the existing lucide icon style.

## Files Summary

| File | Action |
|------|--------|
| Migration SQL | Create `team_members` table + seed data |
| `src/pages/admin/AdminTeamMembers.tsx` | New — admin CRUD page |
| `src/components/admin/TeamMemberFormDialog.tsx` | New — add/edit form dialog |
| `src/components/admin/AdminLayout.tsx` | Add sidebar item + icon update |
| `src/App.tsx` | Add admin route |
| `src/pages/TeamPage.tsx` | Fetch from database |
| `src/components/Team.tsx` | Fetch from database |
| `src/components/team/TeamOverlapCard.tsx` | Accept DB fields |
| `src/components/contributor/ContributorHero.tsx` | Icon swap |

No new dependencies. No new environment variables. Reuses existing `ImageUpload`, `DeleteConfirmDialog`, `media` storage bucket, and admin auth patterns.

