
-- ROLES
CREATE TYPE public.app_role AS ENUM ('admin', 'staff');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE POLICY "users can read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "admins can read all roles" ON public.user_roles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins can insert roles" ON public.user_roles
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins can delete roles" ON public.user_roles
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- SCHEDULE
CREATE TYPE public.weekday AS ENUM ('MON','TUE','WED','THU','FRI','SAT','SUN');

CREATE TABLE public.schedule_classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day public.weekday NOT NULL,
  start_time text NOT NULL,
  end_time text NOT NULL,
  discipline text NOT NULL,
  age text NOT NULL DEFAULT '',
  note text,
  cancelled_today boolean NOT NULL DEFAULT false,
  sort_index int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);
GRANT SELECT ON public.schedule_classes TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.schedule_classes TO authenticated;
GRANT ALL ON public.schedule_classes TO service_role;
ALTER TABLE public.schedule_classes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public can read schedule" ON public.schedule_classes
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "staff/admin can insert" ON public.schedule_classes
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));
CREATE POLICY "staff/admin can update" ON public.schedule_classes
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));
CREATE POLICY "staff/admin can delete" ON public.schedule_classes
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.updated_at = now();
  NEW.updated_by = auth.uid();
  RETURN NEW;
END; $$;
CREATE TRIGGER schedule_classes_touch BEFORE UPDATE ON public.schedule_classes
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- BRUTE FORCE PROTECTION
CREATE TABLE public.auth_attempts (
  id bigserial PRIMARY KEY,
  email text NOT NULL,
  ip text,
  success boolean NOT NULL DEFAULT false,
  attempted_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.auth_attempts TO service_role;
ALTER TABLE public.auth_attempts ENABLE ROW LEVEL SECURITY;
CREATE INDEX auth_attempts_email_time_idx ON public.auth_attempts (email, attempted_at DESC);
CREATE INDEX auth_attempts_ip_time_idx ON public.auth_attempts (ip, attempted_at DESC);

-- SEED SCHEDULE
INSERT INTO public.schedule_classes (day, start_time, end_time, discipline, age, sort_index) VALUES
('MON','16:00','16:40','Mini-Thaiboxen','3–6 Jahre',1),
('MON','16:50','17:50','Kids-Thaiboxen','7–10 Jahre',2),
('MON','18:00','19:00','Teens-Thaiboxen','11–15 Jahre',3),
('MON','19:00','20:30','K1 / Kickboxen','ab 16 Jahre',4),
('MON','19:00','20:30','Thaiboxen','ab 16 Jahre',5),
('TUE','16:00','16:40','Mini-Wing-Fight','3–6 Jahre',1),
('TUE','16:50','17:50','Kids-Wing-Fight','7–10 Jahre',2),
('TUE','18:00','19:00','Teens-Wing-Fight','11–15 Jahre',3),
('TUE','18:00','19:00','Boxen-Teens','11–15 Jahre',4),
('TUE','19:00','20:30','Self-Defense / Wing-Fight','ab 16 Jahre',5),
('TUE','19:30','21:00','MMA-Grappling','ab 16 Jahre',6),
('TUE','19:45','21:15','Boxen','ab 16 Jahre',7),
('WED','16:00','16:40','Mini-Kickboxen','3–6 Jahre',1),
('WED','16:50','17:50','Kids-Kickboxen','7–10 Jahre',2),
('WED','18:00','19:00','Teens-Kickboxen','11–15 Jahre',3),
('WED','19:00','20:30','K1 / Kickboxen','ab 16 Jahre',4),
('WED','19:00','20:30','Fighter-Fitness','ab 16 Jahre',5),
('THU','16:00','16:40','Mini-Wing-Fight','3–6 Jahre',1),
('THU','16:50','17:50','Kids-Wing-Fight','7–10 Jahre',2),
('THU','18:00','19:00','Teens-Wing-Fight','11–15 Jahre',3),
('THU','19:00','20:30','Self-Defense / Wing-Fight','ab 16 Jahre',4),
('THU','19:00','20:30','Thaiboxen','ab 16 Jahre',5),
('THU','19:30','21:00','MMA-Grappling','ab 16 Jahre',6),
('FRI','16:00','16:40','Mini-Kickboxen','3–6 Jahre',1),
('FRI','16:50','17:50','Kids-Kickboxen','7–10 Jahre',2),
('FRI','18:00','19:00','Teens-Kickboxen','11–15 Jahre',3),
('FRI','19:00','20:30','K1 / Kickboxen','ab 16 Jahre',4),
('FRI','19:45','21:15','Boxen (Wettkampf)','ab 16 Jahre',5),
('SAT','11:00','12:30','Kick-Boxen Frauen','ab 14 Jahre',1),
('SAT','11:00','13:00','Boxen','ab 16 Jahre',2),
('SAT','13:00','22:00','Personal Training (Termin*)','ab 16 Jahre',3),
('SUN','11:00','12:30','Personal Training (Termin*)','ab 14 Jahre',1),
('SUN','11:00','13:00','Personal Training (Termin*)','ab 16 Jahre',2),
('SUN','13:00','22:00','Personal Training (Termin*)','',3);
