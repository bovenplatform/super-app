import { createServerSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { NextResponse } from "next/server";

interface RbacRow {
  role: string | null;
  is_active: boolean;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const explicitNext = searchParams.get("next");

  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(`${origin}/login?error=config_missing`);
  }

  if (code) {
    try {
      const supabase = await createServerSupabase();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        if (explicitNext) {
          return NextResponse.redirect(`${origin}${explicitNext}`);
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
              return NextResponse.redirect(`${origin}/admin`);
            }
          } catch {
            // Abaikan jika RPC belum ada
          }
        }

        // Default redirect untuk Tamu/Masyarakat
        return NextResponse.redirect(`${origin}/akun`);
      }
    } catch (err) {
      console.error("Error in auth callback:", err);
    }
  }

  // Jika gagal, kembalikan ke login dengan pesan error
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
