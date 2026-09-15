-- 0000_initial_schema.sql
-- Inisialisasi dasar RBAC & Settings untuk Super-App Template

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ROLES TABLE
CREATE TABLE public.roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PERMISSIONS TABLE
CREATE TABLE public.permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action TEXT NOT NULL UNIQUE, -- e.g. "berita.create", "surat.delete"
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ROLE PERMISSIONS (Many to Many)
CREATE TABLE public.role_permissions (
    role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- 4. ADMIN USERS / PROFILES
CREATE TABLE public.admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES public.roles(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    last_active_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. HELPER FUNCTION: has_permission
CREATE OR REPLACE FUNCTION public.has_permission(required_action TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_role_id UUID;
    has_perm BOOLEAN;
BEGIN
    -- Ambil role_id dari user yang sedang login
    SELECT role_id INTO user_role_id FROM public.admin_users WHERE id = auth.uid();
    
    -- Jika superadmin (asumsi role bernama superadmin punya by-pass, atau dicek manual)
    -- IF (SELECT name FROM roles WHERE id = user_role_id) = 'superadmin' THEN RETURN TRUE; END IF;

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

