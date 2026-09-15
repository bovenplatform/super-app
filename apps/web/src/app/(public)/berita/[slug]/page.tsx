import Link from "next/link";

export default function PublicBeritaDetailPage({ params }: { params: { slug: string } }) {
  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/berita" className="text-brand-emerald hover:underline font-medium">
          ← Kembali ke Indeks Berita
        </Link>
      </div>

      <article className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="mb-8 border-b border-slate-200 dark:border-slate-700 pb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Contoh Judul Artikel Detail ({params.slug})</h1>
          <div className="flex items-center text-sm text-slate-500 gap-4">
            <span>Dipublikasikan pada: 15 Sep 2026</span>
            <span>Kategori: Pengumuman</span>
          </div>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <p>
            Ini adalah simulasi halaman detail artikel berita. Nantinya konten akan ditarik langsung dari database Supabase berdasarkan parameter slug yang dikirimkan.
          </p>
          <p>
            Struktur ini disiapkan agar Anda bisa dengan mudah mengintegrasikan konten Markdown atau HTML (WYSIWYG) di masa depan.
          </p>
        </div>
      </article>
    </main>
  );
}
