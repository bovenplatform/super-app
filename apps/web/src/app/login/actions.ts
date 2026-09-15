"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const supabase = createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect("/login?error=invalid_credentials");
  }

  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function loginWithGoogle() {
  const supabase = createClient();
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback?next=/admin`,
    },
  });

  if (data.url) {
    redirect(data.url);
  }
}

export async function signupDev() {
  // HANYA UNTUK KEPERLUAN TES DEVELOPER
  const supabase = createClient();
  const randomNum = Math.floor(Math.random() * 1000);
  const email = `test${randomNum}@dev.com`;
  const password = "password123";

  await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: "Tester Auto-Guest" }
    }
  });

  await supabase.auth.signInWithPassword({ email, password });
  redirect("/admin");
}
