import { login, loginWithGoogle, signupDev } from "./actions";
import { Button } from "@superapp/ui";
import Link from "next/link";

export default function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-brand-emerald dark:text-emerald-400">Login Portal Admin</h1>
        </div>

        {searchParams.error === "account_locked" && (
          <div className="mb-6 p-3 bg-red-50 text-red-700 text-sm rounded border border-red-200">
            <strong>Akses Ditolak:</strong> Akun Anda berstatus Guest/Terkunci. Hubungi Superadmin.
          </div>
        )}
        {searchParams.error === "invalid_credentials" && (
          <div className="mb-6 p-3 bg-red-50 text-red-700 text-sm rounded border border-red-200">
            Kredensial salah.
          </div>
        )}
        {searchParams.error === "auth_callback_failed" && (
          <div className="mb-6 p-3 bg-red-50 text-red-700 text-sm rounded border border-red-200">
            Autentikasi OAuth gagal/dibatalkan.
          </div>
        )}

        {/* Login Email Tradisional */}
        <form action={login} className="space-y-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input name="email" type="email" required className="w-full p-2 border border-slate-300 rounded bg-transparent" />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium">Password</label>
              <Link href="/reset-password" className="text-xs text-brand-emerald hover:underline">Lupa Password?</Link>
            </div>
            <input name="password" type="password" required className="w-full p-2 border border-slate-300 rounded bg-transparent" />
          </div>
          <Button type="submit" className="w-full">Login via Email</Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-700"></div></div>
          <div className="relative flex justify-center text-sm"><span className="px-2 bg-white dark:bg-slate-800 text-slate-500">Atau</span></div>
        </div>

        {/* Login Google */}
        <form action={loginWithGoogle}>
          <Button type="submit" className="w-full bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 dark:bg-slate-700 dark:text-white dark:border-slate-600 dark:hover:bg-slate-600">
            Login dengan Google
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-500 text-center mb-4">DEV ENVIRONMENT ONLY</p>
          <form action={signupDev} className="flex flex-col gap-2">
             <Button type="submit" className="w-full bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600">
               Tes Daftar (Auto-Guest)
             </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
