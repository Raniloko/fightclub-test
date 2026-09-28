CREATE TABLE public.trainer_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL UNIQUE,
  display_name text NOT NULL DEFAULT '',
  role_title text NOT NULL DEFAULT '',
  disciplines text[] NOT NULL DEFAULT '{}',
  short_bio text NOT NULL DEFAULT '',
  bio text NOT NULL DEFAULT '',
  achievements text[] NOT NULL DEFAULT '{}',
  avatar_path text,
  instagram_url text,
  sort_index integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT false,
  submitted_for_review boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX trainer_profiles_published_idx ON public.trainer_profiles (is_published, sort_index);

GRANT SELECT ON public.trainer_profiles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.trainer_profiles TO authenticated;
GRANT ALL ON public.trainer_profiles TO service_role;

ALTER TABLE public.trainer_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "trainer_profiles_public_read"
  ON public.trainer_profiles FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "trainer_profiles_own_read"
  ON public.trainer_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "trainer_profiles_own_insert"
  ON public.trainer_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id AND is_published = false);

CREATE POLICY "trainer_profiles_own_update"
  ON public.trainer_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "trainer_profiles_team_read"
  ON public.trainer_profiles FOR SELECT
  TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role) OR private.has_role(auth.uid(), 'staff'::app_role));

CREATE POLICY "trainer_profiles_team_update"
  ON public.trainer_profiles FOR UPDATE
  TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role) OR private.has_role(auth.uid(), 'staff'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role) OR private.has_role(auth.uid(), 'staff'::app_role));

CREATE POLICY "trainer_profiles_team_delete"
  ON public.trainer_profiles FOR DELETE
  TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role) OR private.has_role(auth.uid(), 'staff'::app_role));

-- Trainers must never be able to publish themselves.
CREATE OR REPLACE FUNCTION public.guard_trainer_publish()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.is_published IS DISTINCT FROM OLD.is_published
     AND NOT (private.has_role(auth.uid(), 'admin'::app_role) OR private.has_role(auth.uid(), 'staff'::app_role)) THEN
    NEW.is_published := OLD.is_published;
  END IF;
  IF NEW.sort_index IS DISTINCT FROM OLD.sort_index
     AND NOT (private.has_role(auth.uid(), 'admin'::app_role) OR private.has_role(auth.uid(), 'staff'::app_role)) THEN
    NEW.sort_index := OLD.sort_index;
  END IF;
  NEW.user_id := OLD.user_id;
  NEW.email := OLD.email;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trainer_profiles_guard
  BEFORE UPDATE ON public.trainer_profiles
  FOR EACH ROW EXECUTE FUNCTION public.guard_trainer_publish();