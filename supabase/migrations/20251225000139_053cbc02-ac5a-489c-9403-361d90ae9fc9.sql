-- Add token columns to utaab_verifications for server-side validation
ALTER TABLE public.utaab_verifications 
ADD COLUMN IF NOT EXISTS token TEXT,
ADD COLUMN IF NOT EXISTS used_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ DEFAULT (now() + interval '1 hour');

-- Add index for fast token lookups
CREATE INDEX IF NOT EXISTS idx_utaab_verifications_token 
ON public.utaab_verifications(token) 
WHERE token IS NOT NULL;