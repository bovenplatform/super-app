import { login, signupDev } from "./actions";
import { GoogleLoginButton } from "./GoogleLoginButton";
import { isSupabaseConfigured } from "@/lib/supabase";
import { Button, Card, FormField, Input } from "@superapp/ui";
import Link from "next/link";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const isConfigured = isSupabaseConfigured();

  const isCustomError =
    error &&
    error !== "config_missing" &&
    error !== "account_locked" &&
    error !== "invalid_credentials" &&
    error !== "auth_callback_failed";

  return (
    <div className="min-h-screen flex items-center justify-center bg-app px-4 py-8">
      <Card className="p-8 shadow-lg w-full max-w-md space-y-6">
        <div className="text-center space-y-1">
          <Link href="/" className="text-xs font-semibold text-primary hover:underline block mb-2">
            ← Kembali ke Beranda
          </Link>
          <h1 className="text-2xl font-extrabold text-main">
            Login Portal
          </h1>
          <p className="text-xs text-muted">
            Masuk ke dasbor manajemen atau portal pengguna
          </p>
        </div>

        {!isConfigured && (
          <div className="p-3 bg-amber-500/10 text-amber-800 dark:text-amber-300 text-xs rounded-lg border border-amber-500/30">
            <strong>Pemberitahuan Sistem:</strong> Kredensial Supabase belum terdeteksi aktif di server ini. Pastikan Environment Variables di Vercel sudah disimpan dan dilakukan <strong>Redeploy</strong>.
          </div>
        )}

        {error === "account_locked" && (
          <div className="p-3 bg-red-500/10 text-red-700 dark:text-red-400 text-xs rounded-lg border border-red-500/30">
            <strong>Akses Ditolak:</strong> Akun Anda berstatus Guest/Terkunci. Hubungi Superadmin.
          </div>
        )}
        {error === "invalid_credentials" && (
          <div className="p-3 bg-red-500/10 text-red-700 dark:text-red-400 text-xs rounded-lg border border-red-500/30">
            Email atau kata sandi yang Anda masukkan tidak sesuai.
          </div>
        )}
        {error === "auth_callback_failed" && (
          <div className="p-3 bg-red-500/10 text-red-700 dark:text-red-400 text-xs rounded-lg border border-red-500/30">
            Autentikasi gagal atau dibatalkan.
          </div>
        )}
        {isCustomError && (
          <div className="p-3 bg-red-500/10 text-red-700 dark:text-red-400 text-xs rounded-lg border border-red-500/30 break-words">
            <strong>Info Autentikasi:</strong> {error}
          </div>
        )}

        {/* Login Email Tradisional */}
        <form action={login} className="space-y-4">
          <FormField label="Email" required htmlFor="email">
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="nama@domain.com"
            />
          </FormField>

          <FormField
            label="Kata Sandi"
            required
            htmlFor="password"
            description={
              <Link
                href="/reset-password"
                className="text-xs text-primary hover:underline float-right -mt-5"
              >
                Lupa Password?
              </Link>
            }
          >
            <Input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
            />
          </FormField>

          <Button type="submit" variant="primary" className="w-full">
            Masuk via Email
          </Button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-surface text-muted">
              Atau masuk dengan
            </span>
          </div>
        </div>

        {/* Login Google dengan Client-Side PKCE */}
        <GoogleLoginButton />

        <div className="pt-4 border-t border-border">
          <p className="text-[11px] text-muted text-center mb-2 font-semibold">
            AREA PENGEMBANGAN (DEV TESTING)
          </p>
          <form action={signupDev}>
            <Button
              type="submit"
              variant="secondary"
              size="sm"
              className="w-full text-xs"
            >
              Uji Coba Daftar Akun Tamu
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
