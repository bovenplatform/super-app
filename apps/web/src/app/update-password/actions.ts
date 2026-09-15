"use server";
import { createServerSupabase } from "@/lib/supabase";
import { redirect } from "next/navigation";

export async function updatePassword(formData: FormData) {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (password !== confirmPassword) {
    redirect("/update-password?error=mismatch");
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect(`/update-password?error=${error.message}`);
  }
  
  // Sukses ubah password, arahkan ke dasbor
  redirect("/admin");
}

