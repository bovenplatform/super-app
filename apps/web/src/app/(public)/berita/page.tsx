import { createPublicSupabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Berita } from "@superapp/types";
import Link from "next/link";

export const revalidate = 60; // ISR 60 detik untuk performa tinggi

export default async function PublicBeritaPage() {
  let beritaList: Berita[] = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = createPublicSupabase();
      const { data, error } = await supabase
        .from("berita")
        .select("id, title, slug, cover_image_url, created_at, status, kategori:berita_kategori(name, slug)")
        .eq("status", "published")
        .order("created_at", { ascending: false });

      if (!error && data) {
        beritaList = data as unknown as Berita[];
      }
    } catch (err) {
      console.warn("Gagal mengambil data berita dari Supabase:", err);
    }
  }

  return (
    <main className="min-h-screen p-6 md:p-12 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <Link
            href="/"
            className="text-xs text-brand-emerald dark:text-emerald-400 font-medium hover:underline mb-2 block"
          >
            ← Kembali ke Beranda
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
            Kabar & Informasi Terkini
          </h1>
        </div>
        <div className="mt-4 md:mt-0">
          <Link
            href="/admin/berita/create"
            className="text-xs text-slate-500 hover:text-brand-emerald hover:underline"
          >
            Tulis Berita (Khusus Pengurus) →
          </Link>
        </div>
      </div>

      {beritaList.length === 0 ? (
        <div className="space-y-6">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 text-center">
            Menampilkan contoh artikel pratinjau (Belum ada berita terpublikasi di database).
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/berita/demo-artikel"
              className="group block bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition"
            >
              <div className="aspect-video bg-slate-100 dark:bg-slate-700 w-full relative flex items-center justify-center text-slate-400 text-sm">
                Cover Berita
              </div>
              <div className="p-6">
                <div className="text-xs text-brand-gold font-semibold uppercase tracking-wider mb-2">
                  Pengumuman
                </div>
                <h2 className="text-lg font-bold mb-2 group-hover:text-brand-emerald transition-colors text-slate-900 dark:text-white">
                  Contoh Artikel Berita Pertama
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3">
                  Ini adalah contoh deskripsi singkat dari artikel berita yang akan ditampilkan di portal publik.
                </p>
                <div className="mt-4 text-xs text-slate-400">15 Sep 2026</div>
              </div>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {beritaList.map((berita) => {
            const kategoriName =
              (berita.kategori as unknown as { name?: string })?.name || "Umum";
            const formattedDate = new Date(berita.created_at).toLocaleDateString(
              "id-ID",
              { day: "numeric", month: "short", year: "numeric" }
            );

            return (
              <Link
                key={berita.id}
                href={`/berita/${berita.slug}`}
                className="group block bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition"
              >
                <div className="aspect-video bg-slate-100 dark:bg-slate-700 w-full relative flex items-center justify-center text-slate-400 text-sm overflow-hidden">
                  {berita.cover_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={berita.cover_image_url}
                      alt={berita.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <span>Gambar Cover</span>
                  )}
                </div>
                <div className="p-6">
                  <div className="text-xs text-brand-gold font-semibold uppercase tracking-wider mb-2">
                    {kategoriName}
                  </div>
                  <h2 className="text-lg font-bold mb-2 group-hover:text-brand-emerald dark:group-hover:text-emerald-400 transition-colors text-slate-900 dark:text-white line-clamp-2">
                    {berita.title}
                  </h2>
                  <div className="mt-4 text-xs text-slate-400">{formattedDate}</div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
