import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function guardAdminPage(requiredPermission?: string) {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  // LAPIS 2: Pengecekan Profil Admin & Role
  const { data: adminProfile } = await supabase
    .from("admin_users")
    .select("role_id, is_active")
    .eq("id", user.id)
    .single();

  // Jika profil tidak ada atau dikunci (Auto-Guest Lockdown)
  if (!adminProfile || !adminProfile.is_active) {
    redirect("/login?error=account_locked");
  }

  // Jika ada spesifik permission yang dicek
  if (requiredPermission) {
    const { data: hasPerm } = await supabase.rpc("has_permission", { required_action: requiredPermission });
    if (!hasPerm) {
      redirect("/admin?error=forbidden");
    }
  }

  return { user, adminProfile };
}
