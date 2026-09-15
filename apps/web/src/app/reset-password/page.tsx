import { Button, Card, FormField, Input } from "@superapp/ui";
import { resetPassword } from "./actions";
import Link from "next/link";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const { message } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-app px-4 py-8">
      <Card className="p-8 shadow-lg w-full max-w-md space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-extrabold text-main">
            Reset Kata Sandi
          </h1>
          <p className="text-xs text-muted">
            Masukkan email terdaftar untuk menerima tautan pembaruan kata sandi
          </p>
        </div>

        {message === "success" && (
          <div className="p-4 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 text-sm rounded-lg border border-emerald-500/30">
            Tautan untuk mereset password telah dikirim ke email Anda. Silakan periksa kotak masuk atau folder spam.
          </div>
        )}

        {message === "error" && (
          <div className="p-4 bg-red-500/10 text-red-800 dark:text-red-300 text-sm rounded-lg border border-red-500/30">
            Gagal mengirim tautan reset. Pastikan email terdaftar dengan benar.
          </div>
        )}

        <form action={resetPassword} className="space-y-4">
          <FormField label="Email Anda" required htmlFor="email">
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="nama@domain.com"
            />
          </FormField>

          <Button type="submit" variant="primary" className="w-full">
            Kirim Tautan Reset
          </Button>
        </form>

        <div className="text-center pt-2">
          <Link
            href="/login"
            className="text-xs font-semibold text-primary hover:underline"
          >
            ← Kembali ke Halaman Login
          </Link>
        </div>
      </Card>
    </div>
  );
}
