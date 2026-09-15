import { createBrowserClient, createServerClient } from "@supabase/ssr";
import type { Database } from "@superapp/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** Singleton browser client — menghindari multiple instances di sisi client */
let browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function getSupabaseBrowser() {
  if (!browserClient) {
    browserClient = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey, {
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
 * Server client — per-request instance
 * Cocok untuk Next.js 14/15 karena cookies() kini dikelola secara asynchronous (await cookies())
 */
export async function createServerSupabase() {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  
  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
        // Blok try-catch untuk kasus pemanggilan pada Server Component
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch (error) {
          // Abaikan, biasanya ditangani oleh middleware
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
