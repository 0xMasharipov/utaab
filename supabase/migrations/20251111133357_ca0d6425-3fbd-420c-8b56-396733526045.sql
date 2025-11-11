-- Phase 2: Communities & User Management
-- 1. Create communities table
CREATE TABLE public.communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  whatsapp_invite_url TEXT,
  member_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Add community_admin role to enum (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role' AND 'community_admin' = ANY(enum_range(NULL::app_role)::text[])) THEN
    ALTER TYPE app_role ADD VALUE 'community_admin';
  END IF;
END $$;

-- 3. Create community_admins junction table
CREATE TABLE public.community_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID REFERENCES public.communities(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  assigned_at TIMESTAMPTZ DEFAULT now(),
  assigned_by UUID REFERENCES auth.users(id),
  UNIQUE(community_id, user_id)
);

-- 4. Create admin_invitations table
CREATE TABLE public.admin_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  role app_role NOT NULL,
  token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  invited_by UUID REFERENCES auth.users(id),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '48 hours'),
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Enable RLS on all tables
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_invitations ENABLE ROW LEVEL SECURITY;

-- 6. Communities RLS Policies
CREATE POLICY "Communities are viewable by everyone"
ON public.communities FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage all communities"
ON public.communities FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- 7. Community Admins RLS Policies
CREATE POLICY "Users can view community admins"
ON public.community_admins FOR SELECT
USING (
  user_id = auth.uid() 
  OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can manage community admins"
ON public.community_admins FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- 8. Admin Invitations RLS Policies
CREATE POLICY "Admins can view all invitations"
ON public.admin_invitations FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage invitations"
ON public.admin_invitations FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- 9. Create trigger for updated_at on communities
CREATE TRIGGER update_communities_updated_at
BEFORE UPDATE ON public.communities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 10. Create index for faster lookups
CREATE INDEX idx_communities_slug ON public.communities(slug);
CREATE INDEX idx_community_admins_user ON public.community_admins(user_id);
CREATE INDEX idx_community_admins_community ON public.community_admins(community_id);
CREATE INDEX idx_admin_invitations_email ON public.admin_invitations(email);
CREATE INDEX idx_admin_invitations_token ON public.admin_invitations(token);