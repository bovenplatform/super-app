-- Trigger saat user baru mendaftar di Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Masukkan ke tabel admin_users sebagai Guest (is_active = FALSE, role_id = NULL)
  INSERT INTO public.admin_users (id, full_name, is_active)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Pengguna Baru'), 
    FALSE
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
