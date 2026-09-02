-- No policy allows anonymous reads of certificates; remove the grant too.
REVOKE ALL ON public.certificates FROM anon;