-- Create events table for admin event management
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_tr TEXT,
  title_ru TEXT,
  title_ar TEXT,
  subtitle_en TEXT,
  subtitle_tr TEXT,
  subtitle_ru TEXT,
  subtitle_ar TEXT,
  description_en TEXT,
  description_tr TEXT,
  description_ru TEXT,
  description_ar TEXT,
  slug TEXT NOT NULL UNIQUE,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  timezone TEXT NOT NULL DEFAULT 'UTC',
  location_type TEXT NOT NULL DEFAULT 'physical', -- physical, online, hybrid
  location_address TEXT,
  location_online_link TEXT,
  cover_image TEXT,
  promo_video TEXT,
  tags TEXT[] DEFAULT '{}',
  language TEXT NOT NULL DEFAULT 'en',
  capacity INTEGER,
  rsvp_link TEXT,
  visibility TEXT NOT NULL DEFAULT 'draft', -- draft, scheduled, published, archived
  publish_at TIMESTAMP WITH TIME ZONE,
  archive_at TIMESTAMP WITH TIME ZONE,
  attachments JSONB DEFAULT '[]',
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT[],
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Admins can manage all events
CREATE POLICY "Admins can manage all events"
ON public.events
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Published events viewable by everyone
CREATE POLICY "Published events viewable by everyone"
ON public.events
FOR SELECT
USING (
  visibility = 'published' 
  AND (publish_at IS NULL OR publish_at <= now())
  AND (archive_at IS NULL OR archive_at >= now())
);

-- Create index for performance
CREATE INDEX idx_events_visibility ON public.events(visibility);
CREATE INDEX idx_events_start_date ON public.events(start_date);
CREATE INDEX idx_events_slug ON public.events(slug);

-- Trigger for updated_at
CREATE TRIGGER update_events_updated_at
BEFORE UPDATE ON public.events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create admin_sessions table for separate admin authentication
CREATE TABLE public.admin_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE,
  ip_address INET,
  user_agent TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  last_activity TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  two_factor_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- Only admins can manage their sessions
CREATE POLICY "Admins can view own sessions"
ON public.admin_sessions
FOR SELECT
USING (auth.uid() = user_id AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete own sessions"
ON public.admin_sessions
FOR DELETE
USING (auth.uid() = user_id AND has_role(auth.uid(), 'admin'::app_role));

-- System can create sessions
CREATE POLICY "System can create admin sessions"
ON public.admin_sessions
FOR INSERT
WITH CHECK (has_role(user_id, 'admin'::app_role));

-- Create index for performance
CREATE INDEX idx_admin_sessions_user_id ON public.admin_sessions(user_id);
CREATE INDEX idx_admin_sessions_token ON public.admin_sessions(session_token);
CREATE INDEX idx_admin_sessions_expires ON public.admin_sessions(expires_at);

-- Function to cleanup expired sessions
CREATE OR REPLACE FUNCTION public.cleanup_expired_admin_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.admin_sessions
  WHERE expires_at < now();
END;
$$;