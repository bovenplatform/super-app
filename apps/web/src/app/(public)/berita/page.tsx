import { createPublicSupabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Berita } from "@superapp/types";
import { Badge, Button, Card, EmptyState, PageHeader } from "@superapp/ui";
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
    <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* 1. Standard Page Header */}
      <PageHeader
        title="Kabar & Publikasi Terkini"
        description="Portal informasi resmi, pengumuman kegiatan, dan berita seputar layanan organisasi."
        backHref="/"
        backLabel="Kembali ke Beranda"
        action={
          <Link href="/admin/berita/create">
            <Button variant="outline" size="sm">
              + Tulis Berita (Pengurus)
            </Button>
          </Link>
        }
      />

      {/* 2. Content Grid */}
      {beritaList.length === 0 ? (
        <div className="space-y-6">
          <EmptyState
            title="Belum Ada Berita Terpublikasi"
            description="Saat ini belum ada artikel berita aktif di database. Di bawah ini ditampilkan contoh pratinjau kartu berita publik."
            action={
              <Link href="/admin/berita/create">
                <Button>Mulai Tulis Berita Pertama</Button>
              </Link>
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/berita/demo-artikel" className="group block">
              <Card className="h-full overflow-hidden hover:shadow-md hover:border-primary/40 transition flex flex-col">
                <div className="aspect-video bg-subtle w-full relative flex items-center justify-center text-muted text-sm overflow-hidden">
                  Gambar Cover Berita
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="mb-2.5">
                      <Badge variant="default">Pengumuman</Badge>
                    </div>
                    <h2 className="text-lg font-bold group-hover:text-primary transition-colors text-main line-clamp-2 mb-2">
                      Contoh Artikel Berita Pertama
                    </h2>
                    <p className="text-muted text-sm line-clamp-3 leading-relaxed">
                      Ini adalah contoh deskripsi singkat dari artikel berita yang akan ditampilkan di portal publik.
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs text-muted">
                    <span>15 September 2026</span>
                    <span className="font-semibold text-primary group-hover:underline">Baca Selengkapnya →</span>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {beritaList.map((berita) => {
            const kategoriName =
              (berita.kategori as unknown as { name?: string })?.name || "Informasi";
            const formattedDate = new Date(berita.created_at).toLocaleDateString(
              "id-ID",
              { day: "numeric", month: "long", year: "numeric" }
            );

            return (
              <Link
                key={berita.id}
                href={`/berita/${berita.slug}`}
                className="group block"
              >
                <Card className="h-full overflow-hidden hover:shadow-md hover:border-primary/40 transition flex flex-col">
                  <div className="aspect-video bg-subtle w-full relative flex items-center justify-center text-muted text-sm overflow-hidden">
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
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="mb-2.5">
                        <Badge variant="default">{kategoriName}</Badge>
                      </div>
                      <h2 className="text-lg font-bold group-hover:text-primary transition-colors text-main line-clamp-2 mb-2 leading-snug">
                        {berita.title}
                      </h2>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs text-muted">
                      <span>{formattedDate}</span>
                      <span className="font-semibold text-primary group-hover:underline">Baca Selengkapnya →</span>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
