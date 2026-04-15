
-- 1. Remove sensitive tables from Realtime publication
ALTER PUBLICATION supabase_realtime DROP TABLE public.security_events;
ALTER PUBLICATION supabase_realtime DROP TABLE public.education_profiles;
ALTER PUBLICATION supabase_realtime DROP TABLE public.certificates;
ALTER PUBLICATION supabase_realtime DROP TABLE public.subtitle_jobs;

-- 2. Fix generate_certificate_number function search_path
CREATE OR REPLACE FUNCTION public.generate_certificate_number()
 RETURNS text
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
DECLARE
  cert_number TEXT;
BEGIN
  cert_number := 'CERT-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 12));
  RETURN cert_number;
END;
$function$;

-- 3. Restrict public storage bucket listing
DROP POLICY IF EXISTS "Public can view media" ON storage.objects;

CREATE POLICY "Public can view media files by path"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'media' AND name IS NOT NULL AND name != '');
