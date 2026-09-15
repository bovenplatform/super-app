"use server";

import { createServerSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { LoginSchema } from "@superapp/validations";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface RbacRow {
  role: string | null;
  is_active: boolean;
}

export async function login(formData: FormData) {
  if (!isSupabaseConfigured()) {
    redirect("/login?error=config_missing");
  }

  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = LoginSchema.safeParse(rawData);
  if (!parsed.success) {
    redirect("/login?error=invalid_credentials");
  }

  const { email, password } = parsed.data;
  const supabase = await createServerSupabase();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    redirect("/login?error=invalid_credentials");
  }

  // Cek apakah user adalah admin aktif
  try {
    // @ts-expect-error - RPC arg types dynamically bound
    const { data: rbacData } = (await supabase.rpc("get_rbac_user", {
      user_email: data.user.email ?? email,
    })) as { data: RbacRow[] | null };

    const role = rbacData && rbacData[0]?.role;
    const isActive = rbacData && rbacData[0]?.is_active;

    revalidatePath("/", "layout");

    if (role && isActive) {
      redirect("/admin");
    }
  } catch {
    // Fallback
  }

  revalidatePath("/", "layout");
  redirect("/akun");
}

export async function loginWithGoogle() {
  if (!isSupabaseConfigured()) {
    redirect("/login?error=config_missing");
  }

  const supabase = await createServerSupabase();
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error || !data.url) {
    redirect("/login?error=auth_callback_failed");
  }

  redirect(data.url);
}

export async function signupDev() {
  // HANYA UNTUK KEPERLUAN TES DEVELOPER / AUTO-GUEST
  if (!isSupabaseConfigured()) {
    redirect("/login?error=config_missing");
  }

  const supabase = await createServerSupabase();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const email = `tamu${randomNum}@dev.local`;
  const password = "password123";

  const { error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: `Tamu Uji Coba #${randomNum}` },
    },
  });

  if (signUpError) {
    redirect("/login?error=invalid_credentials");
  }

  await supabase.auth.signInWithPassword({ email, password });
  revalidatePath("/", "layout");
  redirect("/akun");
}
