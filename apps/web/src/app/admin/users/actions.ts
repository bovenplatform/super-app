"use server";

import { guardAdminPage } from "@/lib/rbac";
import { createAdminSupabase, createServerSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function toggleUserStatusAction(userId: string, currentStatus: boolean) {
  await guardAdminPage("system.manage");

  if (!isSupabaseConfigured()) {
    return;
  }

  try {
    let supabase;
    try {
      supabase = createAdminSupabase();
    } catch {
      supabase = await createServerSupabase();
    }

    await (supabase.from("admin_users") as any)
      .update({ is_active: !currentStatus })
      .eq("id", userId);

    revalidatePath("/admin/users");
  } catch (err) {
    console.error("Error toggling user status:", err);
  }
}

export async function updateUserRoleAction(userId: string, roleId: string | null) {
  await guardAdminPage("system.manage");

  if (!isSupabaseConfigured()) {
    return;
  }

  try {
    let supabase;
    try {
      supabase = createAdminSupabase();
    } catch {
      supabase = await createServerSupabase();
    }

    await (supabase.from("admin_users") as any)
      .update({ role_id: roleId || null })
      .eq("id", userId);

    revalidatePath("/admin/users");
  } catch (err) {
    console.error("Error updating user role:", err);
  }
}
