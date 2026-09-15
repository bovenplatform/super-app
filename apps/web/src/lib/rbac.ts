import { createServerSupabase, isSupabaseConfigured } from "@/lib/supabase";
import type { PermissionId, RBACUser } from "@superapp/types";
import { redirect } from "next/navigation";

interface RbacRpcRow {
  id: string;
  email: string;
  full_name: string;
  role: string | null;
  is_active: boolean;
  permissions: string[];
}

interface AdminProfileRow {
  id: string;
  full_name: string;
  avatar_url: string | null;
  is_active: boolean;
  role: { name?: string } | null;
}

/**
 * Mendapatkan data user beserta peran dan permissions secara komprehensif
 */
export async function getRbacUser(): Promise<RBACUser | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const supabase = await createServerSupabase();
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser || !authUser.email) {
      return null;
    }

    // Panggil RPC get_rbac_user jika ada, atau fallback query manual
    try {
      const { data: rbacData, error: rpcError } = (await (supabase.rpc as any)(
        "get_rbac_user",
        { user_email: authUser.email }
      )) as { data: RbacRpcRow[] | null; error: unknown };

      if (!rpcError && rbacData && rbacData.length > 0) {
        const u = rbacData[0];
        const isSuperAdmin = u.role === "superadmin";
        return {
          id: authUser.id,
          email: authUser.email,
          name: u.full_name || authUser.user_metadata?.full_name || authUser.email,
          role: u.role,
          permissions: u.permissions || [],
          isSuperAdmin,
          isActive: u.is_active ?? false,
          avatar_url: authUser.user_metadata?.avatar_url || null,
        };
      }
    } catch {
      // Abaikan jika RPC belum dimigrasi di database tertentu
    }

    // Fallback: Query tabel admin_users langsung
    const { data: profile } = (await supabase
      .from("admin_users")
      .select("id, full_name, avatar_url, is_active, role:roles(name)")
      .eq("id", authUser.id)
      .single()) as unknown as { data: AdminProfileRow | null };

    if (!profile) {
      // User terdaftar sebagai Tamu / Guest (Belum memiliki profile admin)
      return {
        id: authUser.id,
        email: authUser.email,
        name: authUser.user_metadata?.full_name || authUser.email,
        role: null,
        permissions: [],
        isSuperAdmin: false,
        isActive: false,
        avatar_url: authUser.user_metadata?.avatar_url || null,
      };
    }

    const roleName = profile.role?.name || null;
    const isSuperAdmin = roleName === "superadmin";

    return {
      id: authUser.id,
      email: authUser.email,
      name: profile.full_name || authUser.email,
      role: roleName,
      permissions: [],
      isSuperAdmin,
      isActive: profile.is_active ?? false,
      avatar_url: profile.avatar_url || authUser.user_metadata?.avatar_url || null,
    };
  } catch (error) {
    console.error("Error in getRbacUser:", error);
    return null;
  }
}

/**
 * LAPIS 2: Server Component Guard untuk Rute Admin (/admin/*)
 */
export async function guardAdminPage(requiredPermission?: PermissionId): Promise<RBACUser> {
  const user = await getRbacUser();

  if (!user) {
    redirect("/login");
  }

  // Jika akun tidak aktif atau bukan admin
  if (!user.isActive || !user.role) {
    redirect("/akun?error=account_not_active");
  }

  // Superadmin memiliki akses universal
  if (user.isSuperAdmin) {
    return user;
  }

  // Cek spesifik permission
  if (requiredPermission && !user.permissions.includes(requiredPermission)) {
    redirect("/admin?error=forbidden");
  }

  return user;
}
