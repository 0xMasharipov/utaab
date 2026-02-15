
-- Blog categories
CREATE TABLE public.blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en text NOT NULL,
  name_tr text,
  name_ru text,
  name_ar text,
  slug text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Blog categories viewable by everyone" ON public.blog_categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage blog categories" ON public.blog_categories FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Blog posts
CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title_en text NOT NULL,
  title_tr text,
  title_ru text,
  title_ar text,
  excerpt_en text,
  excerpt_tr text,
  excerpt_ru text,
  excerpt_ar text,
  content jsonb DEFAULT '[]'::jsonb,
  cover_image text,
  gallery jsonb DEFAULT '[]'::jsonb,
  video_type text,
  video_url text,
  attachments jsonb DEFAULT '[]'::jsonb,
  tags text[] DEFAULT '{}',
  author_name text,
  status text NOT NULL DEFAULT 'draft',
  publish_date timestamptz,
  scheduled_at timestamptz,
  meta_title text,
  meta_description text,
  og_image text,
  featured boolean DEFAULT false,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published blog posts viewable by everyone" ON public.blog_posts FOR SELECT
  USING (status = 'published' AND (publish_date IS NULL OR publish_date <= now()));
CREATE POLICY "Admins can view all blog posts" ON public.blog_posts FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert blog posts" ON public.blog_posts FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update blog posts" ON public.blog_posts FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete blog posts" ON public.blog_posts FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Blog post categories junction
CREATE TABLE public.blog_post_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES public.blog_categories(id) ON DELETE CASCADE,
  UNIQUE(post_id, category_id)
);

ALTER TABLE public.blog_post_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Blog post categories viewable by everyone" ON public.blog_post_categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage blog post categories" ON public.blog_post_categories FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
