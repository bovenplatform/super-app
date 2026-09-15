"use server";

import { createServerSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { ResetPasswordSchema } from "@superapp/validations";
import { redirect } from "next/navigation";

export async function resetPassword(formData: FormData) {
  if (!isSupabaseConfigured()) {
    redirect("/reset-password?message=error");
  }

  const rawData = {
    email: formData.get("email"),
  };

  const parsed = ResetPasswordSchema.safeParse(rawData);
  if (!parsed.success) {
    redirect("/reset-password?message=error");
  }

  const { email } = parsed.data;
  const supabase = await createServerSupabase();
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/update-password`,
  });

  if (error) {
    redirect("/reset-password?message=error");
  }

  redirect("/reset-password?message=success");
}
