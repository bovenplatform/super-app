-- 0004_security_hardening.sql
-- Penguatan Keamanan RLS, RPC RBAC, Superadmin Bypass, dan Storage Dual-Bucket

-- 1. Enable RLS pada tabel inti RBAC
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 2. Kebijakan RLS untuk Roles & Permissions
CREATE POLICY "Roles Select Authenticated" ON public.roles
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Roles Manage Superadmin" ON public.roles
FOR ALL TO authenticated USING (public.has_permission('system.manage'));

CREATE POLICY "Permissions Select Authenticated" ON public.permissions
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Permissions Manage Superadmin" ON public.permissions
FOR ALL TO authenticated USING (public.has_permission('system.manage'));

CREATE POLICY "Role Permissions Select Authenticated" ON public.role_permissions
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Role Permissions Manage Superadmin" ON public.role_permissions
FOR ALL TO authenticated USING (public.has_permission('system.manage'));

-- 3. Kebijakan RLS untuk Admin Users
CREATE POLICY "Admin Users Self Select" ON public.admin_users
FOR SELECT TO authenticated USING (auth.uid() = id OR public.has_permission('system.manage'));

CREATE POLICY "Admin Users Self Update" ON public.admin_users
FOR UPDATE TO authenticated USING (auth.uid() = id OR public.has_permission('system.manage'));

CREATE POLICY "Admin Users Manage Superadmin" ON public.admin_users
FOR ALL TO authenticated USING (public.has_permission('system.manage'));

-- 4. Perbaikan Fungsi has_permission dengan Superadmin Bypass & Null Safety
CREATE OR REPLACE FUNCTION public.has_permission(required_action TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_role_id UUID;
    user_role_name TEXT;
    has_perm BOOLEAN;
BEGIN
    IF auth.uid() IS NULL THEN
        RETURN FALSE;
    END IF;

    -- Ambil role_id dan status aktif dari user yang sedang login
    SELECT au.role_id, r.name INTO user_role_id, user_role_name 
    FROM public.admin_users au
    LEFT JOIN public.roles r ON r.id = au.role_id
    WHERE au.id = auth.uid() AND au.is_active = TRUE;
    
    IF user_role_id IS NULL THEN
        RETURN FALSE;
    END IF;

    -- Superadmin by-pass: superadmin memiliki akses penuh ke seluruh permission
    IF user_role_name = 'superadmin' THEN 
        RETURN TRUE; 
    END IF;

    -- Cek apakah role tersebut memiliki permission yang diminta
    SELECT EXISTS (
        SELECT 1 
        FROM public.role_permissions rp
        JOIN public.permissions p ON p.id = rp.permission_id
        WHERE rp.role_id = user_role_id AND p.action = required_action
    ) INTO has_perm;

    RETURN COALESCE(has_perm, FALSE);
END;
$$;

-- 5. RPC Helper: get_rbac_user untuk Server Resolving Cepat
CREATE OR REPLACE FUNCTION public.get_rbac_user(user_email TEXT)
RETURNS TABLE (
    id UUID,
    email TEXT,
    full_name TEXT,
    role TEXT,
    is_active BOOLEAN,
    permissions TEXT[]
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT
        au.id,
        u.email::TEXT,
        au.full_name,
        r.name AS role,
        au.is_active,
        COALESCE(
            array_agg(p.action) FILTER (WHERE p.action IS NOT NULL),
            ARRAY[]::TEXT[]
        ) AS permissions
    FROM
        public.admin_users au
    JOIN
        auth.users u ON u.id = au.id
    LEFT JOIN
        public.roles r ON r.id = au.role_id
    LEFT JOIN
        public.role_permissions rp ON rp.role_id = r.id
    LEFT JOIN
        public.permissions p ON p.id = rp.permission_id
    WHERE
        u.email = user_email
    GROUP BY
        au.id, u.email, au.full_name, r.name, au.is_active;
END;
$$;

-- 6. Dual-Bucket Storage Setup (Bucket secure-docs untuk file privat)
INSERT INTO storage.buckets (id, name, public) VALUES ('secure-docs', 'secure-docs', false)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies untuk Dokumen Privat
CREATE POLICY "Admin Read Secure Docs" ON storage.objects
FOR SELECT TO authenticated USING (
    bucket_id = 'secure-docs' AND (
        public.has_permission('system.manage') OR 
        public.has_permission('berita.manage')
    )
);

CREATE POLICY "Admin Insert Secure Docs" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (
    bucket_id = 'secure-docs' AND public.has_permission('system.manage')
);
