"use server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function resetPassword(formData: FormData) {
  const email = formData.get("email") as string;
  const supabase = createClient();
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/update-password`,
  });

  if (error) {
    redirect("/reset-password?message=error");
  }
  redirect("/reset-password?message=success");
}
