import { createServerSupabase, getSiteUrl, isSupabaseConfigured } from "@/lib/supabase";
import { NextResponse } from "next/server";

interface RbacRow {
  role: string | null;
  is_active: boolean;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const explicitNext = searchParams.get("next");
  const errorParam = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  const siteUrl = getSiteUrl();

  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(`${siteUrl}/login?error=config_missing`);
  }

  // Jika penyedia OAuth (Google / Supabase) mengembalikan pesan error langsung
  if (errorParam || errorDescription) {
    const errorMsg = errorDescription || errorParam || "oauth_error";
    console.error("OAuth error received at callback:", errorMsg);
    return NextResponse.redirect(
      `${siteUrl}/login?error=${encodeURIComponent(errorMsg)}`
    );
  }

  if (code) {
    try {
      const supabase = await createServerSupabase();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        const forwardedHost = request.headers.get("x-forwarded-host");
        const isLocalEnv = process.env.NODE_ENV === "development";
        const redirectBase = isLocalEnv
          ? origin
          : forwardedHost
          ? `https://${forwardedHost}`
          : siteUrl;

        if (explicitNext) {
          return NextResponse.redirect(`${redirectBase}${explicitNext}`);
        }

        // Smart Auth Routing: Cek apakah user memiliki role admin
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user?.email) {
          try {
            // @ts-expect-error - RPC arg types dynamically bound
            const { data: rbacData } = (await supabase.rpc("get_rbac_user", {
              user_email: user.email,
            })) as { data: RbacRow[] | null };

            const role = rbacData && rbacData[0]?.role;
            const isActive = rbacData && rbacData[0]?.is_active;

            if (role && isActive) {
              return NextResponse.redirect(`${redirectBase}/admin`);
            }
          } catch {
            // Abaikan jika RPC belum ada
          }
        }

        // Default redirect untuk Tamu/Masyarakat
        return NextResponse.redirect(`${redirectBase}/akun`);
      } else {
        console.error("Supabase exchangeCodeForSession error:", error.message);
        return NextResponse.redirect(
          `${siteUrl}/login?error=${encodeURIComponent(error.message)}`
        );
      }
    } catch (err) {
      console.error("Error in auth callback execution:", err);
    }
  }

  // Jika gagal, kembalikan ke login dengan pesan error
  return NextResponse.redirect(`${siteUrl}/login?error=auth_callback_failed`);
}
