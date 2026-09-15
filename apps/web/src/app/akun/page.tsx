import { getRbacUser } from "@/lib/rbac";
import { createServerSupabase } from "@/lib/supabase";
import { Badge, Button, Card, PageHeader } from "@superapp/ui";
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
    <main className="min-h-screen max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
      {/* 1. Page Header */}
      <PageHeader
        title="Portal Akun & Profil"
        description="Kelola informasi akun Anda, pengaturan kata sandi, dan akses ke layanan terpadu."
        backHref="/"
        backLabel="Kembali ke Beranda"
        action={
          <form action="/login/logout" method="POST">
            <Button type="submit" variant="destructive" size="sm">
              Keluar Sesi
            </Button>
          </form>
        }
      />

      {error === "account_not_active" && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 rounded-lg text-sm">
          <strong>Pemberitahuan:</strong> Akun Anda berstatus Tamu dan belum diaktifkan sebagai Administrator oleh Superadmin.
        </div>
      )}

      {message === "password_updated" && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 rounded-lg text-sm">
          Kata sandi Anda berhasil diperbarui.
        </div>
      )}

      {/* 2. User Profile Card */}
      <Card className="p-6 sm:p-8 space-y-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-border text-center sm:text-left">
          <div className="h-20 w-20 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-2xl font-black uppercase shadow-sm">
            {displayName.charAt(0)}
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-main">{displayName}</h2>
            <p className="text-sm text-muted">{displayEmail}</p>
            <div className="flex items-center justify-center sm:justify-start gap-2 pt-2">
              <Badge variant={user?.role ? "brand" : "secondary"}>
                {roleLabel}
              </Badge>
              {user?.role && (
                <Badge variant={isActive ? "success" : "warning"}>
                  {isActive ? "Aktif" : "Menunggu Aktivasi"}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Action Grid */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-main">Menu Akses Mandiri</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {user?.role && isActive && (
              <Link
                href="/admin"
                className="p-5 rounded-xl border border-primary/30 bg-primary/5 hover:bg-primary/10 transition flex flex-col justify-between"
              >
                <div>
                  <div className="font-bold text-primary text-base">
                    Panel Admin CMS →
                  </div>
                  <p className="text-xs text-muted mt-1 leading-relaxed">
                    Masuk ke dasbor kelola berita, data, dan operasional internal.
                  </p>
                </div>
              </Link>
            )}

            <Link
              href="/update-password"
              className="p-5 rounded-xl border border-border hover:bg-subtle transition flex flex-col justify-between"
            >
              <div>
                <div className="font-bold text-main text-base">
                  Ubah Kata Sandi
                </div>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  Perbarui password akun Anda untuk menjaga keamanan akses.
                </p>
              </div>
            </Link>

            <Link
              href="/berita"
              className="p-5 rounded-xl border border-border hover:bg-subtle transition flex flex-col justify-between"
            >
              <div>
                <div className="font-bold text-main text-base">
                  Portal Berita
                </div>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  Jelajahi siaran pers, pengumuman, dan artikel publik.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </Card>
    </main>
  );
}
