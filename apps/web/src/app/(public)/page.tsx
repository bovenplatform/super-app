import { Button } from "@superapp/ui";
import Link from "next/link";

export default function PublicHomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 sm:p-12 text-center">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-brand-emerald dark:bg-emerald-950/60 dark:text-emerald-300">
          <span>Enterprise Template Next.js 16 + Supabase</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-emerald dark:text-emerald-400 tracking-tight leading-tight">
          Super-App Public Portal
        </h1>

        <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
          Boilerplate sistem informasi dan portal layanan publik enterprise. Dilengkapi arsitektur Turborepo monorepo, sistem RBAC 3-lapis, dan dual-bucket storage.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link href="/berita">
            <Button size="lg">Baca Kabar Berita</Button>
          </Link>
          <Link href="/login">
            <Button
              size="lg"
              variant="outline"
              className="border-brand-emerald text-brand-emerald hover:bg-brand-emerald/10 dark:text-emerald-400 dark:border-emerald-500"
            >
              Masuk Portal / Admin
            </Button>
          </Link>
          <Link href="/akun">
            <Button size="lg" variant="secondary">
              Profil Saya
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
