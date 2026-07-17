
-- lock down has_role: only signed-in users can call it
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- auth_attempts: no client access at all, service_role only
CREATE POLICY "no client access" ON public.auth_attempts
  FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
