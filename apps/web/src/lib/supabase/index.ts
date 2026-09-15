import { createBrowserClient, createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@superapp/types";
import {
  getSupabasePublishableKey,
  getSupabaseSecretKey,
  getSupabaseUrl,
  isSupabaseConfigured,
} from "./env";

export * from "./env";

/** Singleton browser client — menghindari multiple instances di sisi client */
let browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function getSupabaseBrowser() {
  if (!browserClient) {
    const supabaseUrl = getSupabaseUrl();
    const supabaseKey = getSupabasePublishableKey();

    browserClient = createBrowserClient<Database>(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return browserClient;
}

/**
 * 1. Public Stateless Supabase Client
 * Untuk query data publik pada SSG/ISR tanpa memicu dynamic server usage (cookies).
 */
export function createPublicSupabase() {
  const supabaseUrl = getSupabaseUrl();
  const supabaseKey = getSupabasePublishableKey();

  return createSupabaseClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/** 
 * 2. Server Supabase Client (Cookie-based)
 * Untuk Server Components, Route Handlers, dan Server Actions yang memerlukan sesi aktif.
 */
export async function createServerSupabase() {
  const supabaseUrl = getSupabaseUrl();
  const supabaseKey = getSupabasePublishableKey();

  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        try {
          return cookieStore.getAll();
        } catch {
          return [];
        }
      },
      setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Mengabaikan error jika dipanggil dari Server Component murni
        }
      },
    },
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
}

/**
 * 3. Privileged Admin / Service Role Client
 * HANYA untuk eksekusi server-side backend khusus (Bypass RLS).
 */
export function createAdminSupabase() {
  const supabaseUrl = getSupabaseUrl();
  const secretKey = getSupabaseSecretKey();

  if (!secretKey) {
    throw new Error(
      "SUPABASE_SECRET_KEY atau SUPABASE_SERVICE_ROLE_KEY belum dikonfigurasi di Environment Variables."
    );
  }

  return createSupabaseClient<Database>(supabaseUrl, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
