CREATE OR REPLACE FUNCTION public.guard_trainer_publish()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_team boolean;
BEGIN
  is_team := auth.uid() IS NULL
    OR private.has_role(auth.uid(), 'admin'::app_role)
    OR private.has_role(auth.uid(), 'staff'::app_role);

  IF NOT is_team THEN
    NEW.is_published := OLD.is_published;
    NEW.sort_index := OLD.sort_index;
  END IF;

  NEW.user_id := OLD.user_id;
  NEW.email := OLD.email;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.guard_trainer_publish() FROM PUBLIC, anon, authenticated;