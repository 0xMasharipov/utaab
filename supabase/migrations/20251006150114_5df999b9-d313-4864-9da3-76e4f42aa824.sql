-- Create announcements table for education platform
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en TEXT NOT NULL,
  title_tr TEXT,
  title_ru TEXT,
  title_ar TEXT,
  body_en TEXT NOT NULL,
  body_tr TEXT,
  body_ru TEXT,
  body_ar TEXT,
  audience_type TEXT NOT NULL DEFAULT 'global', -- global, course, tag, locale
  target_courses UUID[], -- array of course IDs
  target_tags TEXT[],
  target_locales TEXT[],
  visibility TEXT NOT NULL DEFAULT 'draft', -- draft, scheduled, published, expired
  delivery_channels TEXT[] NOT NULL DEFAULT ARRAY['banner'], -- banner, in_app, email
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  attachments JSONB DEFAULT '[]'::jsonb,
  cta_text TEXT,
  cta_link TEXT,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  email_opens INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create site_messages table for static content and broadcasts
CREATE TABLE IF NOT EXISTS public.site_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_key TEXT NOT NULL UNIQUE, -- e.g., hero.title, footer.disclaimer
  message_type TEXT NOT NULL DEFAULT 'static', -- static, broadcast
  content_en TEXT NOT NULL,
  content_tr TEXT,
  content_ru TEXT,
  content_ar TEXT,
  version INTEGER DEFAULT 1,
  is_published BOOLEAN DEFAULT false,
  category TEXT, -- e.g., hero, footer, toast, empty_state
  broadcast_channels TEXT[], -- for broadcasts: in_app, modal, email
  target_audience TEXT, -- All, role:student, role:instructor, locale:en, etc.
  schedule_start TIMESTAMP WITH TIME ZONE,
  schedule_end TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create media_library table
CREATE TABLE IF NOT EXISTS public.media_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_type TEXT NOT NULL, -- image, video, document
  mime_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_path TEXT NOT NULL,
  storage_bucket TEXT NOT NULL,
  dimensions JSONB, -- {width, height} for images/videos
  duration_seconds INTEGER, -- for videos
  file_hash TEXT,
  folder TEXT,
  tags TEXT[],
  description TEXT,
  alt_text TEXT,
  is_public BOOLEAN DEFAULT false,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create audit_log table for tracking all admin actions
CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT,
  action TEXT NOT NULL, -- create, update, delete, publish, etc.
  entity_type TEXT NOT NULL, -- course, announcement, user, etc.
  entity_id UUID,
  entity_name TEXT,
  changes JSONB, -- before/after diff
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_announcements_visibility ON public.announcements(visibility);
CREATE INDEX idx_announcements_start_time ON public.announcements(start_time);
CREATE INDEX idx_announcements_created_by ON public.announcements(created_by);
CREATE INDEX idx_site_messages_key ON public.site_messages(message_key);
CREATE INDEX idx_site_messages_type ON public.site_messages(message_type);
CREATE INDEX idx_media_library_type ON public.media_library(file_type);
CREATE INDEX idx_media_library_uploaded_by ON public.media_library(uploaded_by);
CREATE INDEX idx_audit_log_user_id ON public.audit_log(user_id);
CREATE INDEX idx_audit_log_entity_type ON public.audit_log(entity_type);
CREATE INDEX idx_audit_log_created_at ON public.audit_log(created_at DESC);

-- Enable RLS on all tables
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for announcements
CREATE POLICY "Published announcements viewable by everyone"
  ON public.announcements FOR SELECT
  USING (visibility = 'published' AND (start_time IS NULL OR start_time <= now()) AND (end_time IS NULL OR end_time >= now()));

CREATE POLICY "Admins can manage all announcements"
  ON public.announcements FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for site_messages
CREATE POLICY "Published site messages viewable by everyone"
  ON public.site_messages FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage site messages"
  ON public.site_messages FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for media_library
CREATE POLICY "Public media viewable by everyone"
  ON public.media_library FOR SELECT
  USING (is_public = true);

CREATE POLICY "Admins can manage all media"
  ON public.media_library FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for audit_log
CREATE POLICY "Admins can view audit log"
  ON public.audit_log FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can insert audit log"
  ON public.audit_log FOR INSERT
  WITH CHECK (true);

-- Create triggers for updated_at
CREATE TRIGGER update_announcements_updated_at
  BEFORE UPDATE ON public.announcements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_messages_updated_at
  BEFORE UPDATE ON public.site_messages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_media_library_updated_at
  BEFORE UPDATE ON public.media_library
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();