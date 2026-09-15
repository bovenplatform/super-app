import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Jika environment variable belum di-set di Vercel, jangan crash (hindari 500 MIDDLEWARE_INVOCATION_FAILED)
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Middleware: NEXT_PUBLIC_SUPABASE_URL atau NEXT_PUBLIC_SUPABASE_ANON_KEY belum dikonfigurasi di Environment Variables.");
    return supabaseResponse;
  }

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
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

    // Verifikasi token JWT pengguna aktif
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");

    // PROTEKSI LAPIS 1: Cek otorisasi untuk area /admin
    if (isAdminRoute && !user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  } catch (error) {
    console.error("Error in Supabase middleware updateSession:", error);
  }

  return supabaseResponse;
}
