import { Badge, Button, Card } from "@superapp/ui";
import Link from "next/link";

export default function PublicHomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <div className="inline-block">
          <Badge variant="default" className="px-3.5 py-1 text-xs">
            Enterprise Boilerplate • Next.js + Supabase + RBAC
          </Badge>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-main tracking-tight leading-tight">
          Super-App Portal <span className="text-primary">Layanan Terpadu</span>
        </h1>

        <p className="text-muted text-base sm:text-xl max-w-2xl mx-auto leading-relaxed">
          Fondasi sistem informasi modular berstandar enterprise. Terpadu dengan sistem keamanan 3-lapis, dual-bucket storage, dan semantic token rebranding.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link href="/berita">
            <Button size="lg" variant="primary">
              Kabar & Informasi
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline">
              Masuk Portal / Admin
            </Button>
          </Link>
          <Link href="/akun">
            <Button size="lg" variant="secondary">
              Portal Pengguna
            </Button>
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-10 text-left">
          <Card className="p-5 space-y-2">
            <div className="text-primary font-bold text-sm">🛡️ 3-Layer Defense</div>
            <p className="text-xs text-muted leading-relaxed">
              Keamanan berlapis mulai dari Middleware, Server Guard, hingga Row Level Security di database.
            </p>
          </Card>
          <Card className="p-5 space-y-2">
            <div className="text-primary font-bold text-sm">🎨 Rebrandable Tokens</div>
            <p className="text-xs text-muted leading-relaxed">
              Ubah identitas warna klien baru hanya lewat 2 baris variabel CSS tanpa menyentuh ratusan kode UI.
            </p>
          </Card>
          <Card className="p-5 space-y-2">
            <div className="text-primary font-bold text-sm">📦 Modular Turborepo</div>
            <p className="text-xs text-muted leading-relaxed">
              Paket kode terpisah rapi (@superapp/ui, types, validations, utils) untuk skalabilitas jangka panjang.
            </p>
          </Card>
        </div>
      </div>
    </main>
  );
}
