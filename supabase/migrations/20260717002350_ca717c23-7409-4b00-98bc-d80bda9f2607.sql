
-- Move has_role() out of the public (Data API) schema so it can't be RPC'd by signed-in users.
CREATE SCHEMA IF NOT EXISTS private;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;

-- Rewrite policies to reference the private function.
DROP POLICY IF EXISTS "staff/admin can delete" ON public.schedule_classes;
DROP POLICY IF EXISTS "staff/admin can insert" ON public.schedule_classes;
DROP POLICY IF EXISTS "staff/admin can update" ON public.schedule_classes;
DROP POLICY IF EXISTS "admins can delete roles" ON public.user_roles;
DROP POLICY IF EXISTS "admins can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "admins can read all roles" ON public.user_roles;

CREATE POLICY "staff/admin can delete" ON public.schedule_classes
  FOR DELETE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role) OR private.has_role(auth.uid(), 'staff'::public.app_role));

CREATE POLICY "staff/admin can insert" ON public.schedule_classes
  FOR INSERT TO authenticated
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role) OR private.has_role(auth.uid(), 'staff'::public.app_role));

CREATE POLICY "staff/admin can update" ON public.schedule_classes
  FOR UPDATE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role) OR private.has_role(auth.uid(), 'staff'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role) OR private.has_role(auth.uid(), 'staff'::public.app_role));

CREATE POLICY "admins can delete roles" ON public.user_roles
  FOR DELETE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "admins can insert roles" ON public.user_roles
  FOR INSERT TO authenticated
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "admins can read all roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

-- Drop the exposed public function now that nothing references it.
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);
