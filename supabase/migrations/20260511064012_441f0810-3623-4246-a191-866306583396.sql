
-- ============================================================
-- 1. TEAM MEMBERS — hide email & phone from public
-- ============================================================
DROP POLICY IF EXISTS "Published team members viewable by everyone" ON public.team_members;

CREATE OR REPLACE VIEW public.team_members_public
WITH (security_invoker = true) AS
SELECT
  id, full_name, role_title, department,
  bio_en, bio_tr, bio_ru, bio_ar,
  image_url,
  linkedin_url, twitter_url, instagram_url, telegram_url, website_url,
  display_order, is_featured, is_published,
  created_at, updated_at
FROM public.team_members
WHERE is_published = true;

GRANT SELECT ON public.team_members_public TO anon, authenticated;

-- ============================================================
-- 2. QUIZZES — restrict to enrolled users + admins; safe view for previews
-- ============================================================
DROP POLICY IF EXISTS "Quizzes are viewable by everyone" ON public.quizzes;

CREATE POLICY "Enrolled users can view quizzes"
ON public.quizzes
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (
    SELECT 1
    FROM public.lessons l
    JOIN public.enrollments e ON e.course_id = l.course_id
    WHERE l.id = quizzes.lesson_id
      AND e.user_id = auth.uid()
  )
);

CREATE OR REPLACE VIEW public.safe_quizzes
WITH (security_invoker = true) AS
SELECT
  id, lesson_id, title_en, title_tr, title_ru, title_ar,
  passing_score, created_at, updated_at,
  -- Strip correctness signals from each question
  (
    SELECT jsonb_agg(
      (q::jsonb)
        - 'correct'
        - 'correctAnswer'
        - 'correct_answer'
        - 'is_correct'
        - 'answer'
        - 'explanation'
    )
    FROM jsonb_array_elements(COALESCE(questions, '[]'::jsonb)) AS q
  ) AS questions
FROM public.quizzes;

GRANT SELECT ON public.safe_quizzes TO anon, authenticated;

-- ============================================================
-- 3. REALTIME — drop sensitive/public-broadcast tables
-- ============================================================
DO $$
BEGIN
  BEGIN ALTER PUBLICATION supabase_realtime DROP TABLE public.site_visits; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime DROP TABLE public.communities;  EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime DROP TABLE public.announcements; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime DROP TABLE public.enrollments;  EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime DROP TABLE public.courses;       EXCEPTION WHEN OTHERS THEN NULL; END;
END$$;

-- ============================================================
-- 4. COMMUNITIES — hide WhatsApp invite URL
-- ============================================================
DROP POLICY IF EXISTS "Communities are viewable by everyone" ON public.communities;

CREATE OR REPLACE VIEW public.communities_public
WITH (security_invoker = true) AS
SELECT
  id, name, slug, description, member_count, is_active,
  created_at, updated_at
FROM public.communities
WHERE is_active = true;

GRANT SELECT ON public.communities_public TO anon, authenticated;

-- ============================================================
-- 5. CERT_RECORDS — drop public direct read; make certificates bucket private
-- ============================================================
DROP POLICY IF EXISTS "Public sees issued/revoked cert records" ON public.cert_records;
-- (verify_certificate_by_hash RPC remains the sole public path)

UPDATE storage.buckets SET public = false WHERE id = 'certificates';

-- ============================================================
-- 6. SECURITY DEFINER FUNCTIONS — restrict EXECUTE
-- ============================================================
DO $$
DECLARE
  fn record;
  public_fns text[] := ARRAY['verify_certificate_by_hash', 'has_role'];
BEGIN
  FOR fn IN
    SELECT p.oid::regprocedure AS sig, p.proname
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.prosecdef
  LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC', fn.sig);
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM anon', fn.sig);
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM authenticated', fn.sig);
    IF fn.proname = ANY(public_fns) THEN
      EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO anon, authenticated', fn.sig);
    END IF;
    -- service_role retains access by default via the postgres role / explicit grant if needed
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO service_role', fn.sig);
  END LOOP;
END$$;

-- ============================================================
-- 7. STORAGE — drop broad SELECT policies (no listing)
-- Public bucket files remain reachable via direct CDN URLs.
-- ============================================================
DROP POLICY IF EXISTS "Public can view media files by path" ON storage.objects;
DROP POLICY IF EXISTS "Cert bucket public read" ON storage.objects;
