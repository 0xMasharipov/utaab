
-- Create team_members table
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

-- Enable RLS
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Public can view published members
CREATE POLICY "Published team members viewable by everyone"
  ON public.team_members FOR SELECT TO public
  USING (is_published = true);

-- Admins can do everything
CREATE POLICY "Admins can manage team members"
  ON public.team_members FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Auto-update updated_at trigger
CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON public.team_members
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
