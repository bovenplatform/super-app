"use server";

import { createServerSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { UpdatePasswordSchema } from "@superapp/validations";
import { redirect } from "next/navigation";

export async function updatePassword(formData: FormData) {
  if (!isSupabaseConfigured()) {
    redirect("/update-password?error=Konfigurasi+database+belum+lengkap");
  }

  const rawData = {
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const parsed = UpdatePasswordSchema.safeParse(rawData);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues[0]?.message || "Input tidak valid";
    redirect(`/update-password?error=${encodeURIComponent(errorMsg)}`);
  }

  const { password } = parsed.data;
  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect(`/update-password?error=${encodeURIComponent(error.message)}`);
  }

  // Sukses ubah password, arahkan ke portal akun
  redirect("/akun?message=password_updated");
}
