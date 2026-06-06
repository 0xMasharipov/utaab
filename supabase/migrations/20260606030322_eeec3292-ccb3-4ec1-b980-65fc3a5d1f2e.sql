ALTER TABLE public.cert_records ALTER COLUMN chain_id SET DEFAULT 84532;

ALTER TABLE public.cert_records
  ADD COLUMN IF NOT EXISTS token_id NUMERIC,
  ADD COLUMN IF NOT EXISTS holder_address TEXT,
  ADD COLUMN IF NOT EXISTS voucher JSONB,
  ADD COLUMN IF NOT EXISTS voucher_signature TEXT;

CREATE INDEX IF NOT EXISTS idx_cert_records_holder ON public.cert_records (holder_address);
CREATE INDEX IF NOT EXISTS idx_cert_records_chain ON public.cert_records (chain_id);