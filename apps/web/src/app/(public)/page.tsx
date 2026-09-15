import { Button } from "@superapp/ui";

export default function PublicHomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 text-center space-y-6">
      <h1 className="text-4xl font-bold text-brand-emerald dark:text-emerald-400">
        Super-App Public Portal
      </h1>
      <p className="max-w-md">
        Selamat datang di Portal Publik. Boilerplate ini menggunakan Turborepo, Next.js 16, dan Supabase.
      </p>
      <div className="flex gap-4">
        <Button>Layanan Kami</Button>
        <Button className="bg-transparent text-brand-emerald border border-brand-emerald hover:bg-brand-emerald/10">Masuk Admin</Button>
      </div>
    </main>
  );
}
