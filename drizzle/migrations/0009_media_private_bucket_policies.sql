-- Admin-only access to the private media bucket.
DROP POLICY IF EXISTS "Admins can read private media" ON storage.objects;
CREATE POLICY "Admins can read private media"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'media-private' AND public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can upload private media" ON storage.objects;
CREATE POLICY "Admins can upload private media"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media-private' AND public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can update private media" ON storage.objects;
CREATE POLICY "Admins can update private media"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'media-private' AND public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can delete private media" ON storage.objects;
CREATE POLICY "Admins can delete private media"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'media-private' AND public.has_role(auth.uid(), 'admin'::app_role));