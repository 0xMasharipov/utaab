
-- Public SELECT for media bucket (bucket is already marked public; this aligns RLS with that)
CREATE POLICY "Public can read media objects"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'media');

-- Owners can read their own certificate files (path convention: <user_id>/...)
CREATE POLICY "Users can read their own certificate objects"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'certificates'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
