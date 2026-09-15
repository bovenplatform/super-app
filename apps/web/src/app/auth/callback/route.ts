import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // "next" mendeteksi ke mana user harus pergi setelah auth (misal: /update-password atau /admin)
  const next = searchParams.get("next") ?? "/admin";

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Jika gagal, kembalikan ke login dengan pesan error
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
