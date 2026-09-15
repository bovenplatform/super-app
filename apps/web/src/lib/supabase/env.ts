/**
 * Supabase Environment Configuration Helper (2026+ Dual Compatibility)
 * Mendukung standar API Key baru (sb_publishable_ / sb_secret_) dan standar lama (anon / service_role).
 */

export function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url || url.trim() === "") {
    return "https://placeholder-project.supabase.co";
  }
  return url.trim();
}

export function getSupabasePublishableKey(): string {
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key || key.trim() === "") {
    return "placeholder-anon-key";
  }
  return key.trim();
}

export function getSupabaseSecretKey(): string {
  const secret =
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret || secret.trim() === "") {
    return "";
  }
  return secret.trim();
}

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return false;
  if (url.includes("placeholder") || url === "http://localhost:3000") {
    // Jika di production Vercel tapi URL mengarah ke localhost
    if (process.env.NODE_ENV === "production" && url.includes("localhost")) {
      return false;
    }
  }
  return true;
}
