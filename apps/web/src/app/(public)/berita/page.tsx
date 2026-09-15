import Link from "next/link";

export default function PublicBeritaPage() {
  return (
    <main className="min-h-screen p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-brand-emerald dark:text-emerald-400 mb-8">Kabar Terkini</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Placeholder Card */}
        <Link href="/berita/demo-artikel" className="group block bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition">
          <div className="aspect-video bg-slate-200 dark:bg-slate-700 w-full relative">
            <div className="absolute inset-0 flex items-center justify-center text-slate-400">Gambar Cover</div>
          </div>
          <div className="p-6">
            <div className="text-sm text-brand-gold font-medium mb-2">Pengumuman</div>
            <h2 className="text-xl font-bold mb-2 group-hover:text-brand-emerald transition-colors">Contoh Artikel Berita Pertama</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3">
              Ini adalah contoh deskripsi singkat dari artikel berita yang akan ditampilkan di portal publik.
            </p>
          </div>
        </Link>
      </div>
    </main>
  );
}
