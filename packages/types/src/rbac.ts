export type PermissionId =
  | "dashboard.read"
  | "system.manage"
  | "berita.manage"
  | (string & {});

export type RoleName = "superadmin" | "admin" | "editor" | "readonly" | (string & {});

export interface Role {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface Permission {
  id: string;
  action: string;
  description: string | null;
  created_at: string;
}

export interface RolePermission {
  role_id: string;
  permission_id: string;
}

export interface AdminUser {
  id: string;
  role_id: string | null;
  full_name: string;
  avatar_url: string | null;
  is_active: boolean;
  last_active_at: string | null;
  created_at: string;
  updated_at: string;
  role?: Role | null;
}

export interface RBACUser {
  id: string;
  email: string;
  name: string;
  role: string | null;
  permissions: string[];
  isSuperAdmin: boolean;
  isActive: boolean;
  avatar_url: string | null;
}
