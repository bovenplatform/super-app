import { Button } from "@superapp/ui";
import { resetPassword } from "./actions";
import Link from "next/link";

export default function ResetPasswordPage({ searchParams }: { searchParams: { message?: string } }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Reset Password</h1>
        
        {searchParams.message === "success" && (
          <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 text-sm rounded border border-emerald-200">
            Tautan untuk mereset password telah dikirim ke email Anda. Silakan cek inbox (atau folder spam).
          </div>
        )}
        
        {searchParams.message === "error" && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded border border-red-200">
            Gagal mengirim tautan reset. Pastikan email terdaftar.
          </div>
        )}

        <form action={resetPassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email Anda</label>
            <input name="email" type="email" required className="w-full p-2 border border-slate-300 rounded bg-transparent" placeholder="nama@email.com" />
          </div>
          <Button type="submit" className="w-full">Kirim Tautan Reset</Button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/login" className="text-sm text-slate-500 hover:underline">← Kembali ke Login</Link>
        </div>
      </div>
    </div>
  );
}
