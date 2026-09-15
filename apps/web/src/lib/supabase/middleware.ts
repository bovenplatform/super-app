import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabasePublishableKey, getSupabaseUrl, isSupabaseConfigured } from "./env";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");

  if (!isSupabaseConfigured()) {
    // Jika belum dikonfigurasi dan mencoba akses admin, arahkan ke login dengan info konfigurasi
    if (isAdminRoute) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("error", "config_missing");
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  const supabaseUrl = getSupabaseUrl();
  const supabaseKey = getSupabasePublishableKey();

  try {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });

    // Verifikasi token JWT pengguna aktif secara aman
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    // PROTEKSI LAPIS 1: Cek otorisasi untuk area /admin
    if (isAdminRoute && (error || !user)) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  } catch (error) {
    console.error("Error in Supabase middleware updateSession:", error);
    if (isAdminRoute) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("error", "session_error");
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
