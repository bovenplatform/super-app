import { guardAdminPage } from "@/lib/rbac";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Mengeksekusi Lapis 2 Keamanan
  const user = await guardAdminPage();

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      <aside className="w-64 bg-brand-emerald text-white p-6 hidden md:flex flex-col">
        <div className="font-bold text-xl mb-8 text-brand-gold flex items-center gap-2">
          <span>SUPER APP</span>
        </div>
        <nav className="space-y-2 flex-1">
          <Link
            href="/admin"
            className="block px-3 py-2 rounded-lg hover:bg-white/10 hover:text-brand-gold transition-colors text-sm font-medium"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/berita"
            className="block px-3 py-2 rounded-lg hover:bg-white/10 hover:text-brand-gold transition-colors text-sm font-medium"
          >
            Kelola Berita
          </Link>
          <Link
            href="/akun"
            className="block px-3 py-2 rounded-lg hover:bg-white/10 hover:text-brand-gold transition-colors text-sm font-medium text-emerald-200"
          >
            Portal Akun
          </Link>
          <Link
            href="/"
            className="block px-3 py-2 rounded-lg hover:bg-white/10 hover:text-brand-gold transition-colors text-sm font-medium text-emerald-200"
          >
            Lihat Website
          </Link>
        </nav>
        <div className="mt-auto border-t border-white/20 pt-4">
          <div className="text-sm font-medium truncate">{user.name}</div>
          <div className="text-xs text-emerald-300 truncate mb-3">{user.email}</div>
          <form action="/login/logout" method="POST">
            <button
              type="submit"
              className="text-red-300 text-sm hover:text-red-200 flex items-center gap-1 font-medium transition"
            >
              Keluar
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
