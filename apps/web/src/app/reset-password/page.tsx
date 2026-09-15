import { Button } from "@superapp/ui";
import { resetPassword } from "./actions";
import Link from "next/link";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const { message } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 px-4 py-8">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-slate-900 dark:text-white">
          Reset Password
        </h1>

        {message === "success" && (
          <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-sm rounded-lg border border-emerald-200 dark:border-emerald-800">
            Tautan untuk mereset password telah dikirim ke email Anda. Silakan periksa kotak masuk atau folder spam.
          </div>
        )}

        {message === "error" && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 text-sm rounded-lg border border-red-200 dark:border-red-800">
            Gagal mengirim tautan reset. Pastikan email terdaftar dengan benar.
          </div>
        )}

        <form action={resetPassword} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email Anda
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
          <Button type="submit" className="w-full">
            Kirim Tautan Reset
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-sm text-slate-500 hover:text-brand-emerald dark:hover:text-emerald-400 hover:underline"
          >
            ← Kembali ke Login
          </Link>
        </div>
      </div>
    </div>
  );
}
