import { getRbacUser } from "@/lib/rbac";
import { createServerSupabase } from "@/lib/supabase";
import { Button } from "@superapp/ui";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AkunPortalPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const { error, message } = await searchParams;
  const user = await getRbacUser();

  if (!user) {
    const supabase = await createServerSupabase();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      redirect("/login");
    }
  }

  const displayName = user?.name || "Pengguna";
  const displayEmail = user?.email || "";
  const roleLabel = user?.role
    ? `Staff (${user.role.toUpperCase()})`
    : "Tamu / Masyarakat Umum";
  const isActive = user?.isActive ?? false;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href="/"
              className="text-sm font-medium text-brand-emerald dark:text-emerald-400 hover:underline"
            >
              ← Kembali ke Beranda
            </Link>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
              Portal Akun & Profil
            </h1>
          </div>

          <form action="/login/logout" method="POST">
            <Button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Keluar
            </Button>
          </form>
        </div>

        {error === "account_not_active" && (
          <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 rounded-lg text-sm">
            <strong>Pemberitahuan:</strong> Akun Anda belum memiliki hak akses Administrator atau sedang menunggu verifikasi oleh Superadmin.
          </div>
        )}

        {message === "password_updated" && (
          <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-lg text-sm">
            Password Anda berhasil diperbarui.
          </div>
        )}

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden divide-y divide-slate-200 dark:divide-slate-700">
          <div className="p-6 sm:p-8 flex items-center space-x-6">
            <div className="h-20 w-20 rounded-full bg-brand-emerald text-brand-gold flex items-center justify-center text-2xl font-bold uppercase shadow">
              {displayName.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {displayName}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {displayEmail}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200">
                  {roleLabel}
                </span>
                {user?.role && (
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      isActive
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300"
                    }`}
                  >
                    {isActive ? "Aktif" : "Menunggu Aktivasi"}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Menu & Aksi
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {user?.role && isActive && (
                <Link
                  href="/admin"
                  className="p-4 rounded-lg border border-brand-emerald/30 bg-brand-emerald/5 hover:bg-brand-emerald/10 transition flex flex-col justify-between"
                >
                  <span className="font-semibold text-brand-emerald dark:text-emerald-400">
                    Panel Admin CMS
                  </span>
                  <span className="text-xs text-slate-500 mt-1">
                    Buka dasbor manajemen internal
                  </span>
                </Link>
              )}

              <Link
                href="/update-password"
                className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition flex flex-col justify-between"
              >
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Ubah Kata Sandi
                </span>
                <span className="text-xs text-slate-500 mt-1">
                  Perbarui kredensial keamanan akun
                </span>
              </Link>

              <Link
                href="/berita"
                className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition flex flex-col justify-between"
              >
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Portal Berita
                </span>
                <span className="text-xs text-slate-500 mt-1">
                  Lihat publikasi dan informasi terbaru
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
