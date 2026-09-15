/**
 * Supabase Environment Configuration Helper (2026+ Dual Compatibility)
 * Mendukung standar API Key baru (sb_publishable_ / sb_secret_) dan standar lama (anon / service_role).
 */

function cleanEnvValue(value?: string): string {
  if (!value) return "";
  let clean = value.trim();
  // Hapus tanda petik ganda atau tunggal jika pengguna tidak sengaja menyalinnya di Dashboard Vercel
  if (
    (clean.startsWith('"') && clean.endsWith('"')) ||
    (clean.startsWith("'") && clean.endsWith("'"))
  ) {
    clean = clean.slice(1, -1).trim();
  }
  return clean;
}

export function getSupabaseUrl(): string {
  const url = cleanEnvValue(
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  );
  if (!url) {
    return "https://placeholder-project.supabase.co";
  }
  return url;
}

export function getSupabasePublishableKey(): string {
  const key = cleanEnvValue(
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.SUPABASE_PUBLISHABLE_KEY ||
      process.env.SUPABASE_ANON_KEY
  );
  if (!key) {
    return "placeholder-anon-key";
  }
  return key;
}

export function getSupabaseSecretKey(): string {
  const secret = cleanEnvValue(
    process.env.SUPABASE_SECRET_KEY ||
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_SERVICE_KEY
  );
  return secret;
}

export function isSupabaseConfigured(): boolean {
  const url = getSupabaseUrl();
  const key = getSupabasePublishableKey();

  if (!url || !key) return false;
  if (
    url.includes("placeholder-project.supabase.co") ||
    key === "placeholder-anon-key"
  ) {
    return false;
  }
  if (process.env.NODE_ENV === "production" && url.includes("localhost")) {
    return false;
  }
  return true;
}
