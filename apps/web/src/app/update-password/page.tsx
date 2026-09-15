import { Button } from "@superapp/ui";
import { updatePassword } from "./actions";

export default function UpdatePasswordPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-2">Buat Password Baru</h1>
        <p className="text-center text-slate-500 text-sm mb-6">Silakan ketikkan password baru untuk akun Anda.</p>
        
        {searchParams.error === "mismatch" && (
          <div className="mb-6 p-3 bg-red-50 text-red-700 text-sm rounded border border-red-200">
            Password dan Konfirmasi Password tidak sama!
          </div>
        )}
        {searchParams.error && searchParams.error !== "mismatch" && (
          <div className="mb-6 p-3 bg-red-50 text-red-700 text-sm rounded border border-red-200">
            Terjadi kesalahan: {searchParams.error}
          </div>
        )}

        <form action={updatePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Password Baru</label>
            <input name="password" type="password" required className="w-full p-2 border border-slate-300 rounded bg-transparent" minLength={6} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Konfirmasi Password Baru</label>
            <input name="confirmPassword" type="password" required className="w-full p-2 border border-slate-300 rounded bg-transparent" minLength={6} />
          </div>
          <Button type="submit" className="w-full">Simpan Password Baru</Button>
        </form>
      </div>
    </div>
  );
}
