import { Button } from "@superapp/ui";
import { updatePassword } from "./actions";

export default async function UpdatePasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 px-4 py-8">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-2 text-slate-900 dark:text-white">
          Buat Password Baru
        </h1>
        <p className="text-center text-slate-500 text-sm mb-6">
          Silakan masukkan password baru untuk akun Anda.
        </p>

        {error === "mismatch" && (
          <div className="mb-6 p-3 bg-red-50 text-red-700 text-xs rounded border border-red-200">
            Password dan Konfirmasi Password tidak sama!
          </div>
        )}
        {error && error !== "mismatch" && (
          <div className="mb-6 p-3 bg-red-50 text-red-700 text-xs rounded border border-red-200">
            Terjadi kesalahan: {error}
          </div>
        )}

        <form action={updatePassword} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password Baru
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              className="w-full p-2.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent focus:ring-2 focus:ring-brand-emerald focus:outline-none"
              placeholder="Minimal 6 karakter"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
              Konfirmasi Password Baru
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              minLength={6}
              className="w-full p-2.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent focus:ring-2 focus:ring-brand-emerald focus:outline-none"
              placeholder="Ketik ulang password baru"
            />
          </div>
          <Button type="submit" className="w-full">
            Simpan Password Baru
          </Button>
        </form>
      </div>
    </div>
  );
}
