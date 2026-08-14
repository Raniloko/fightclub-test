CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  image_path TEXT,
  published BOOLEAN NOT NULL DEFAULT true,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  author_id UUID REFERENCES auth.users ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.posts TO authenticated;
GRANT ALL ON public.posts TO service_role;

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "posts_public_read" ON public.posts FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "posts_team_read" ON public.posts FOR SELECT TO authenticated USING (private.has_role(auth.uid(),'admin'::public.app_role) OR private.has_role(auth.uid(),'staff'::public.app_role));
CREATE POLICY "posts_team_insert" ON public.posts FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(),'admin'::public.app_role) OR private.has_role(auth.uid(),'staff'::public.app_role));
CREATE POLICY "posts_team_update" ON public.posts FOR UPDATE TO authenticated USING (private.has_role(auth.uid(),'admin'::public.app_role) OR private.has_role(auth.uid(),'staff'::public.app_role)) WITH CHECK (private.has_role(auth.uid(),'admin'::public.app_role) OR private.has_role(auth.uid(),'staff'::public.app_role));
CREATE POLICY "posts_team_delete" ON public.posts FOR DELETE TO authenticated USING (private.has_role(auth.uid(),'admin'::public.app_role) OR private.has_role(auth.uid(),'staff'::public.app_role));

CREATE TRIGGER touch_posts_updated_at BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE POLICY "post_images_team_read" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'post-images' AND (private.has_role(auth.uid(),'admin'::public.app_role) OR private.has_role(auth.uid(),'staff'::public.app_role)));
CREATE POLICY "post_images_team_insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'post-images' AND (private.has_role(auth.uid(),'admin'::public.app_role) OR private.has_role(auth.uid(),'staff'::public.app_role)));
CREATE POLICY "post_images_team_delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'post-images' AND (private.has_role(auth.uid(),'admin'::public.app_role) OR private.has_role(auth.uid(),'staff'::public.app_role)));