import { login, loginWithGoogle, signupDev } from "./actions";
import { Button } from "@superapp/ui";
import Link from "next/link";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 px-4 py-8">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-xs text-slate-500 hover:underline block mb-2">
            ← Kembali ke Beranda
          </Link>
          <h1 className="text-2xl font-bold text-brand-emerald dark:text-emerald-400">
            Login Portal
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Masuk ke dasbor manajemen atau portal pengguna
          </p>
        </div>

        {error === "config_missing" && (
          <div className="mb-6 p-3 bg-amber-50 text-amber-800 text-xs rounded border border-amber-200">
            <strong>Pemberitahuan Sistem:</strong> Kredensial Supabase belum dikonfigurasi di Environment Variables. Silakan lengkapi pengaturan di file <code>.env.local</code>.
          </div>
        )}
        {error === "account_locked" && (
          <div className="mb-6 p-3 bg-red-50 text-red-700 text-xs rounded border border-red-200">
            <strong>Akses Ditolak:</strong> Akun Anda berstatus Guest/Terkunci. Hubungi Superadmin.
          </div>
        )}
        {error === "invalid_credentials" && (
          <div className="mb-6 p-3 bg-red-50 text-red-700 text-xs rounded border border-red-200">
            Email atau kata sandi yang Anda masukkan tidak sesuai.
          </div>
        )}
        {error === "auth_callback_failed" && (
          <div className="mb-6 p-3 bg-red-50 text-red-700 text-xs rounded border border-red-200">
            Autentikasi gagal atau dibatalkan.
          </div>
        )}

        {/* Login Email Tradisional */}
        <form action={login} className="space-y-4 mb-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full p-2.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent focus:ring-2 focus:ring-brand-emerald focus:outline-none"
              placeholder="nama@domain.com"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="password" className="block text-sm font-medium">
                Kata Sandi
              </label>
              <Link
                href="/reset-password"
                className="text-xs text-brand-emerald dark:text-emerald-400 hover:underline"
              >
                Lupa Password?
              </Link>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full p-2.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent focus:ring-2 focus:ring-brand-emerald focus:outline-none"
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" className="w-full">
            Masuk via Email
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-white dark:bg-slate-800 text-slate-500">
              Atau masuk dengan
            </span>
          </div>
        </div>

        {/* Login Google */}
        <form action={loginWithGoogle}>
          <Button
            type="submit"
            className="w-full bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 dark:bg-slate-700 dark:text-white dark:border-slate-600 dark:hover:bg-slate-600"
          >
            Google Account
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-500 text-center mb-3">
            AREA PENGEMBANGAN (DEV TESTING)
          </p>
          <form action={signupDev}>
            <Button
              type="submit"
              className="w-full bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 text-xs"
            >
              Uji Coba Daftar Akun Tamu
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
