import { Button, Card, FormField, Input } from "@superapp/ui";
import { updatePassword } from "./actions";

export default async function UpdatePasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-app px-4 py-8">
      <Card className="p-8 shadow-lg w-full max-w-md space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-extrabold text-main">
            Buat Password Baru
          </h1>
          <p className="text-xs text-muted">
            Silakan masukkan password baru untuk mengamankan akun Anda
          </p>
        </div>

        {error === "mismatch" && (
          <div className="p-3 bg-red-500/10 text-red-700 dark:text-red-400 text-xs rounded-lg border border-red-500/30">
            Password dan Konfirmasi Password tidak sama!
          </div>
        )}
        {error && error !== "mismatch" && (
          <div className="p-3 bg-red-500/10 text-red-700 dark:text-red-400 text-xs rounded-lg border border-red-500/30 break-words">
            Terjadi kesalahan: {error}
          </div>
        )}

        <form action={updatePassword} className="space-y-4">
          <FormField
            label="Password Baru"
            required
            description="Minimal 6 karakter kombinasi huruf dan angka"
            htmlFor="password"
          >
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="Minimal 6 karakter"
            />
          </FormField>

          <FormField
            label="Konfirmasi Password Baru"
            required
            htmlFor="confirmPassword"
          >
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              minLength={6}
              placeholder="Ketik ulang password baru"
            />
          </FormField>

          <Button type="submit" variant="primary" className="w-full">
            Simpan Password Baru
          </Button>
        </form>
      </Card>
    </div>
  );
}
