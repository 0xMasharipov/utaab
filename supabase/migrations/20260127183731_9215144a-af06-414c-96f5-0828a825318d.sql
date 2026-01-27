-- Add approval workflow columns to community_applications
ALTER TABLE public.community_applications 
ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS approved_at timestamptz,
ADD COLUMN IF NOT EXISTS approved_by uuid,
ADD COLUMN IF NOT EXISTS converted_user_id uuid,
ADD COLUMN IF NOT EXISTS invite_token text,
ADD COLUMN IF NOT EXISTS invite_expires_at timestamptz;

-- Add index for status filtering
CREATE INDEX IF NOT EXISTS idx_community_applications_status 
ON public.community_applications(status);

-- Add constraint for valid statuses (using a trigger instead of CHECK for flexibility)
CREATE OR REPLACE FUNCTION public.validate_application_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status NOT IN ('pending', 'approved', 'rejected', 'converted') THEN
    RAISE EXCEPTION 'Invalid application status: %', NEW.status;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_application_status_trigger ON public.community_applications;
CREATE TRIGGER validate_application_status_trigger
BEFORE INSERT OR UPDATE ON public.community_applications
FOR EACH ROW
EXECUTE FUNCTION public.validate_application_status();

-- Add RLS policy for admins to update applications
DROP POLICY IF EXISTS "Admins can update application status" ON public.community_applications;
CREATE POLICY "Admins can update application status"
ON public.community_applications FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));