import { guardAdminPage } from "@/lib/rbac";
import { Button } from "@superapp/ui";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Mengeksekusi Lapis 2 Keamanan
  const { user } = await guardAdminPage();

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      <aside className="w-64 bg-brand-emerald text-white p-6 hidden md:flex flex-col">
        <div className="font-bold text-xl mb-8 text-brand-gold">SUPER APP</div>
        <nav className="space-y-4 flex-1">
          <a href="/admin" className="block hover:text-brand-gold transition-colors">Dashboard</a>
          <a href="/admin/berita" className="block hover:text-brand-gold transition-colors">Berita</a>
        </nav>
        <div className="mt-auto border-t border-white/20 pt-4">
          <div className="text-sm font-medium mb-2 truncate">{user.email}</div>
          <form action="/login/logout" method="POST">
             <button type="submit" className="text-red-300 text-sm hover:text-red-200">Logout</button>
          </form>
        </div>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
