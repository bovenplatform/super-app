import { guardAdminPage } from "@/lib/rbac";
import { Button, Card, PageHeader } from "@superapp/ui";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const user = await guardAdminPage("dashboard.read");

  return (
    <div className="space-y-8">
      {/* 1. Page Header */}
      <PageHeader
        title="Dashboard Ringkasan"
        description={`Selamat datang kembali, ${user.name}. Berikut adalah ringkasan operasional portal hari ini.`}
        action={
          <div className="flex gap-2.5">
            <Link href="/admin/berita/create">
              <Button size="sm">+ Tulis Berita</Button>
            </Link>
            <Link href="/admin/users">
              <Button size="sm" variant="outline">Kelola User</Button>
            </Link>
          </div>
        }
      />

      {/* 2. KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="p-6 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-muted">
            Total Publikasi Berita
          </div>
          <div className="text-3xl font-extrabold text-main">12</div>
          <p className="text-xs text-muted flex items-center gap-1">
            <span className="text-success font-semibold">Aktif</span> di portal publik
          </p>
        </Card>

        <Card className="p-6 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-muted">
            Pengguna Terdaftar
          </div>
          <div className="text-3xl font-extrabold text-main">84</div>
          <p className="text-xs text-muted flex items-center gap-1">
            <span className="text-primary font-semibold">Masyarakat & Staff</span>
          </p>
        </Card>

        <Card className="p-6 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-muted">
            Status Keamanan RBAC
          </div>
          <div className="text-3xl font-extrabold text-success">Lapis 3</div>
          <p className="text-xs text-muted">RLS & Guard Aktif</p>
        </Card>

        <Card className="p-6 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-muted">
            Penyimpanan Dokumen
          </div>
          <div className="text-3xl font-extrabold text-main">Dual-Bucket</div>
          <p className="text-xs text-muted">Publik & Privat Terisolasi</p>
        </Card>
      </div>

      {/* 3. System Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-bold text-main">Aksi Cepat Modul</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/admin/berita"
              className="p-4 rounded-lg border border-border hover:bg-subtle transition flex flex-col justify-between"
            >
              <span className="font-semibold text-main text-sm">Kelola Berita</span>
              <span className="text-xs text-muted mt-1">Draf, publikasi & arsip</span>
            </Link>
            <Link
              href="/admin/users"
              className="p-4 rounded-lg border border-border hover:bg-subtle transition flex flex-col justify-between"
            >
              <span className="font-semibold text-main text-sm">Hak Akses User</span>
              <span className="text-xs text-muted mt-1">Aktivasi & role pengurus</span>
            </Link>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-bold text-main">Info Arsitektur Proyek</h2>
          <div className="space-y-2.5 text-xs text-muted leading-relaxed">
            <div className="flex justify-between py-1.5 border-b border-border">
              <span>Framework</span>
              <span className="font-semibold text-main">Next.js 16 (App Router) + Turborepo</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-border">
              <span>Database & Auth</span>
              <span className="font-semibold text-main">Supabase PostgreSQL (Row Level Security)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-border">
              <span>Design System</span>
              <span className="font-semibold text-main">Semantic CSS Variables (@superapp/ui)</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
