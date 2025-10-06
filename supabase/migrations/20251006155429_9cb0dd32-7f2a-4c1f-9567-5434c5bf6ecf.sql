-- Fix search_path for generate_certificate_number function
CREATE OR REPLACE FUNCTION public.generate_certificate_number()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
DECLARE
  cert_number TEXT;
BEGIN
  cert_number := 'CERT-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 12));
  RETURN cert_number;
END;
$$;