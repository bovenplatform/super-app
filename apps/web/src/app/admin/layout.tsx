import { guardAdminPage } from "@/lib/rbac";
import { Badge } from "@superapp/ui";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Mengeksekusi Lapis 2 Keamanan
  const user = await guardAdminPage();

  return (
    <div className="flex min-h-screen bg-app text-main">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-surface border-r border-border p-6 hidden md:flex flex-col shrink-0">
        <div className="flex items-center gap-2 mb-8">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-black text-base">
            S
          </div>
          <div>
            <div className="font-extrabold text-base tracking-tight text-main">SUPER-APP</div>
            <div className="text-[10px] font-bold text-accent uppercase tracking-wider">Command Center</div>
          </div>
        </div>

        <nav className="space-y-1.5 flex-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-muted px-3 py-1">
            Menu Utama
          </div>
          <Link
            href="/admin"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-subtle text-main hover:text-primary transition-colors text-sm font-semibold"
          >
            <span>📊</span>
            <span>Dashboard</span>
          </Link>
          <Link
            href="/admin/berita"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-subtle text-main hover:text-primary transition-colors text-sm font-semibold"
          >
            <span>📰</span>
            <span>Kelola Berita</span>
          </Link>

          <div className="text-[11px] font-bold uppercase tracking-wider text-muted px-3 pt-4 py-1">
            Sistem & Otoritas
          </div>
          <Link
            href="/admin/users"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-subtle text-main hover:text-primary transition-colors text-sm font-semibold"
          >
            <span>👥</span>
            <span>Manajemen User</span>
          </Link>
          <Link
            href="/akun"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-subtle text-main hover:text-primary transition-colors text-sm font-semibold"
          >
            <span>👤</span>
            <span>Portal Akun</span>
          </Link>

          <div className="text-[11px] font-bold uppercase tracking-wider text-muted px-3 pt-4 py-1">
            Navigasi Luar
          </div>
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-subtle text-muted hover:text-main transition-colors text-sm font-medium"
          >
            <span>🌐</span>
            <span>Lihat Website</span>
          </Link>
        </nav>

        {/* User profile footer */}
        <div className="mt-auto border-t border-border pt-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-bold truncate text-main">{user.name}</div>
            <Badge variant="brand" className="text-[10px] uppercase">
              {user.role || "Admin"}
            </Badge>
          </div>
          <div className="text-xs text-muted truncate mb-3">{user.email}</div>
          <form action="/login/logout" method="POST">
            <button
              type="submit"
              className="w-full text-left text-xs font-semibold text-destructive hover:underline py-1"
            >
              Keluar Sesi
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
