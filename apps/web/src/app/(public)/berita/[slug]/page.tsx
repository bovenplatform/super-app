import { createPublicSupabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Berita } from "@superapp/types";
import { Badge, Card } from "@superapp/ui";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  if (isSupabaseConfigured()) {
    try {
      const supabase = createPublicSupabase();
      const { data } = await supabase
        .from("berita")
        .select("title, content")
        .eq("slug", slug)
        .eq("status", "published")
        .single();

      const article = data as { title: string; content: string | null } | null;

      if (article) {
        return {
          title: `${article.title} - Super-App`,
          description:
            article.content?.slice(0, 160) || "Informasi dan berita terkini",
        };
      }
    } catch {
      // Fallback
    }
  }

  return {
    title: `Berita: ${slug} - Super-App`,
    description: "Portal berita dan publikasi informasi resmi.",
  };
}

export default async function PublicBeritaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let berita: Berita | null = null;

  if (isSupabaseConfigured()) {
    try {
      const supabase = createPublicSupabase();
      const { data } = await supabase
        .from("berita")
        .select("*, kategori:berita_kategori(name)")
        .eq("slug", slug)
        .eq("status", "published")
        .single();

      if (data) {
        berita = data as unknown as Berita;
      }
    } catch (err) {
      console.warn("Error fetching single berita:", err);
    }
  }

  // Jika demo-artikel atau tidak ada di database, tampilkan tampilan pratinjau yang ramah
  const isDemo = slug === "demo-artikel" || !berita;
  const title = berita?.title || `Contoh Artikel Detail (${slug})`;
  const content =
    berita?.content ||
    "Ini adalah konten artikel berita. Nantinya konten akan ditarik langsung dari database Supabase berdasarkan parameter slug yang dikirimkan.\n\nStruktur layout ini menggunakan standar lebar max-w-4xl (896px) yang dirancang khusus untuk kenyamanan membaca optimal (reading typography canvas), dilengkapi dengan cover featured image responsif, meta info publikasi, dan navigasi breadcrumb seragam.";
  const kategoriName =
    (berita?.kategori as unknown as { name?: string })?.name || "Pengumuman";
  const formattedDate = berita
    ? new Date(berita.created_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "15 September 2026";

  if (!isDemo && !berita) {
    notFound();
  }

  return (
    <main className="min-h-screen max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
      {/* 1. Breadcrumb / Back Navigation */}
      <nav className="flex items-center gap-2 text-xs text-muted">
        <Link href="/" className="hover:text-primary transition">
          Beranda
        </Link>
        <span>/</span>
        <Link href="/berita" className="hover:text-primary transition">
          Berita
        </Link>
        <span>/</span>
        <span className="text-main font-medium truncate max-w-[200px] sm:max-w-xs">
          {title}
        </span>
      </nav>

      {/* 2. Reading Canvas Card */}
      <Card className="p-6 sm:p-10 space-y-8 shadow-sm">
        <div className="space-y-4 border-b border-border pb-6">
          <div>
            <Badge variant="default">{kategoriName}</Badge>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-main tracking-tight leading-tight">
            {title}
          </h1>
          <div className="flex items-center text-xs sm:text-sm text-muted gap-4">
            <span>Dipublikasikan: {formattedDate}</span>
            <span>•</span>
            <span>Status: Terverifikasi</span>
          </div>
        </div>

        {berita?.cover_image_url && (
          <div className="rounded-xl overflow-hidden aspect-video bg-subtle border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={berita.cover_image_url}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="prose prose-slate dark:prose-invert max-w-none text-main leading-relaxed whitespace-pre-line text-base sm:text-lg">
          {content}
        </div>

        <div className="pt-8 border-t border-border flex items-center justify-between">
          <Link
            href="/berita"
            className="text-sm font-semibold text-primary hover:underline flex items-center gap-1"
          >
            ← Kembali ke Semua Berita
          </Link>
        </div>
      </Card>
    </main>
  );
}
