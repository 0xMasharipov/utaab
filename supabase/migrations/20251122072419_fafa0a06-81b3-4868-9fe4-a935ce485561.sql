-- Create subtitle_jobs table for tracking generation progress
CREATE TABLE IF NOT EXISTS public.subtitle_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lecture_id INTEGER NOT NULL,
  lecture_title TEXT NOT NULL,
  video_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  progress INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  generated_files JSONB DEFAULT '{"en": null, "tr": null, "ru": null, "ar": null}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID
);

-- Create lecture_subtitles table for storing subtitle file paths
CREATE TABLE IF NOT EXISTS public.lecture_subtitles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lecture_id INTEGER NOT NULL UNIQUE,
  subtitle_en TEXT,
  subtitle_tr TEXT,
  subtitle_ru TEXT,
  subtitle_ar TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_subtitle_jobs_status ON public.subtitle_jobs(status);
CREATE INDEX IF NOT EXISTS idx_subtitle_jobs_lecture_id ON public.subtitle_jobs(lecture_id);
CREATE INDEX IF NOT EXISTS idx_lecture_subtitles_lecture_id ON public.lecture_subtitles(lecture_id);

-- Enable RLS
ALTER TABLE public.subtitle_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lecture_subtitles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subtitle_jobs (admin only)
CREATE POLICY "Admin users can view subtitle jobs"
  ON public.subtitle_jobs FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin users can insert subtitle jobs"
  ON public.subtitle_jobs FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin users can update subtitle jobs"
  ON public.subtitle_jobs FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin users can delete subtitle jobs"
  ON public.subtitle_jobs FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for lecture_subtitles (everyone can read, admin can write)
CREATE POLICY "Everyone can view lecture subtitles"
  ON public.lecture_subtitles FOR SELECT
  USING (true);

CREATE POLICY "Admin users can manage lecture subtitles"
  ON public.lecture_subtitles FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Enable realtime for subtitle_jobs table
ALTER PUBLICATION supabase_realtime ADD TABLE public.subtitle_jobs;

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION public.update_subtitle_jobs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_subtitle_jobs_updated_at
  BEFORE UPDATE ON public.subtitle_jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_subtitle_jobs_updated_at();