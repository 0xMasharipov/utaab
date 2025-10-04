-- Community applications table
CREATE TABLE public.community_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Step 1: Profile
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  telegram TEXT,
  department TEXT NOT NULL,
  country TEXT,
  city TEXT,
  
  -- Step 2: Experience & Interests
  experience_level TEXT NOT NULL CHECK (experience_level IN ('beginner', 'intermediate', 'advanced')),
  interests TEXT[] NOT NULL,
  
  -- Step 3: Portfolio & Availability
  github_url TEXT,
  portfolio_url TEXT,
  linkedin_url TEXT,
  availability_hours INTEGER NOT NULL,
  preferred_tracks TEXT[] NOT NULL,
  motivation TEXT NOT NULL CHECK (char_length(motivation) BETWEEN 300 AND 500),
  
  -- Step 4: Consent & Metadata
  kvkk_consent BOOLEAN NOT NULL DEFAULT false,
  kvkk_consent_version TEXT NOT NULL DEFAULT '1.0',
  kvkk_consent_timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Metadata
  locale TEXT NOT NULL DEFAULT 'en',
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  referrer TEXT,
  ip_address INET,
  user_agent TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Anti-spam
  honeypot TEXT,
  submission_count INTEGER DEFAULT 1
);

-- Education profiles (enhanced)
CREATE TABLE public.education_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  
  -- Account info
  full_name TEXT NOT NULL,
  preferred_language TEXT NOT NULL DEFAULT 'en',
  
  -- Profile info
  department TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'instructor')),
  focus_areas TEXT[] NOT NULL,
  
  -- Legal & preferences
  kvkk_consent BOOLEAN NOT NULL DEFAULT false,
  kvkk_consent_version TEXT NOT NULL DEFAULT '1.0',
  kvkk_consent_timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  email_course_updates BOOLEAN DEFAULT false,
  email_newsletters BOOLEAN DEFAULT false,
  email_marketing BOOLEAN DEFAULT false,
  
  -- Metadata
  locale TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- KVKK data requests
CREATE TABLE public.kvkk_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  request_type TEXT NOT NULL CHECK (request_type IN ('access', 'correction', 'deletion', 'portability', 'objection')),
  details TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'rejected')),
  admin_notes TEXT,
  locale TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.community_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kvkk_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for community_applications
CREATE POLICY "Admins can view all applications"
  ON public.community_applications FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can submit applications"
  ON public.community_applications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can update applications"
  ON public.community_applications FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for education_profiles
CREATE POLICY "Users can view their own profile"
  ON public.education_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.education_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.education_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
  ON public.education_profiles FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for kvkk_requests
CREATE POLICY "Anyone can submit KVKK requests"
  ON public.kvkk_requests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all KVKK requests"
  ON public.kvkk_requests FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update KVKK requests"
  ON public.kvkk_requests FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- Triggers for updated_at
CREATE TRIGGER update_community_applications_updated_at
  BEFORE UPDATE ON public.community_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_education_profiles_updated_at
  BEFORE UPDATE ON public.education_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_kvkk_requests_updated_at
  BEFORE UPDATE ON public.kvkk_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_community_applications_email ON public.community_applications(email);
CREATE INDEX idx_community_applications_created_at ON public.community_applications(created_at DESC);
CREATE INDEX idx_education_profiles_user_id ON public.education_profiles(user_id);
CREATE INDEX idx_kvkk_requests_status ON public.kvkk_requests(status);
CREATE INDEX idx_kvkk_requests_created_at ON public.kvkk_requests(created_at DESC);