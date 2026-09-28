CREATE POLICY "trainer_avatars_own_read"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'trainer-avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "trainer_avatars_own_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'trainer-avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "trainer_avatars_own_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'trainer-avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "trainer_avatars_own_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'trainer-avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "trainer_avatars_team_all"
  ON storage.objects FOR ALL
  TO authenticated
  USING (bucket_id = 'trainer-avatars' AND (private.has_role(auth.uid(), 'admin'::app_role) OR private.has_role(auth.uid(), 'staff'::app_role)))
  WITH CHECK (bucket_id = 'trainer-avatars' AND (private.has_role(auth.uid(), 'admin'::app_role) OR private.has_role(auth.uid(), 'staff'::app_role)));