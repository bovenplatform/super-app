-- 0003_seed_roles.sql

-- 1. Insert Default Roles
INSERT INTO public.roles (name, description) VALUES 
('superadmin', 'Akses penuh ke seluruh sistem dan manajemen pengguna'),
('admin', 'Administrator dengan akses ke fitur operasional utama'),
('editor', 'Hanya mengelola publikasi konten (berita, dokumen)'),
('readonly', 'Hanya dapat melihat data, tidak bisa melakukan perubahan')
ON CONFLICT (name) DO NOTHING;

-- 2. Insert Basic System Permissions
INSERT INTO public.permissions (action, description) VALUES 
('dashboard.read', 'Akses dasar ke halaman dashboard admin'),
('system.manage', 'Mengelola pengaturan sistem, role, dan akun admin')
ON CONFLICT (action) DO NOTHING;

-- 3. Associate Permissions with Roles
DO $$
DECLARE
    v_superadmin_id UUID;
    v_admin_id UUID;
    v_editor_id UUID;
    v_readonly_id UUID;
    
    v_dashboard_id UUID;
    v_berita_id UUID;
    v_system_id UUID;
BEGIN
    -- Get Role IDs
    SELECT id INTO v_superadmin_id FROM public.roles WHERE name = 'superadmin';
    SELECT id INTO v_admin_id FROM public.roles WHERE name = 'admin';
    SELECT id INTO v_editor_id FROM public.roles WHERE name = 'editor';
    SELECT id INTO v_readonly_id FROM public.roles WHERE name = 'readonly';
    
    -- Get Permission IDs
    SELECT id INTO v_dashboard_id FROM public.permissions WHERE action = 'dashboard.read';
    SELECT id INTO v_system_id FROM public.permissions WHERE action = 'system.manage';
    SELECT id INTO v_berita_id FROM public.permissions WHERE action = 'berita.manage';

    -- SUPERADMIN: Gets everything
    IF v_superadmin_id IS NOT NULL THEN
        INSERT INTO public.role_permissions (role_id, permission_id) VALUES 
        (v_superadmin_id, v_dashboard_id),
        (v_superadmin_id, v_system_id),
        (v_superadmin_id, v_berita_id)
        ON CONFLICT DO NOTHING;
    END IF;

    -- ADMIN: Dashboard & Berita
    IF v_admin_id IS NOT NULL THEN
        INSERT INTO public.role_permissions (role_id, permission_id) VALUES 
        (v_admin_id, v_dashboard_id),
        (v_admin_id, v_berita_id)
        ON CONFLICT DO NOTHING;
    END IF;

    -- EDITOR: Dashboard & Berita
    IF v_editor_id IS NOT NULL THEN
        INSERT INTO public.role_permissions (role_id, permission_id) VALUES 
        (v_editor_id, v_dashboard_id),
        (v_editor_id, v_berita_id)
        ON CONFLICT DO NOTHING;
    END IF;

    -- READONLY: Dashboard only
    IF v_readonly_id IS NOT NULL THEN
        INSERT INTO public.role_permissions (role_id, permission_id) VALUES 
        (v_readonly_id, v_dashboard_id)
        ON CONFLICT DO NOTHING;
    END IF;

END $$;
