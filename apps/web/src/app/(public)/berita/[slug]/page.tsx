import { createPublicSupabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Berita } from "@superapp/types";
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
    "Ini adalah konten artikel berita. Nantinya konten akan ditarik langsung dari database Supabase berdasarkan parameter slug yang dikirimkan.";
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
    <main className="min-h-screen p-6 md:p-12 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          href="/berita"
          className="text-brand-emerald dark:text-emerald-400 hover:underline font-medium text-sm flex items-center gap-1"
        >
          ← Kembali ke Indeks Berita
        </Link>
      </div>

      <article className="bg-white dark:bg-slate-800 p-6 sm:p-10 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="mb-8 border-b border-slate-200 dark:border-slate-700 pb-8">
          <div className="text-xs text-brand-gold font-bold uppercase tracking-wider mb-3">
            {kategoriName}
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
            {title}
          </h1>
          <div className="flex items-center text-xs sm:text-sm text-slate-500 gap-4">
            <span>Dipublikasikan: {formattedDate}</span>
          </div>
        </div>

        {berita?.cover_image_url && (
          <div className="mb-8 rounded-xl overflow-hidden aspect-video bg-slate-100 dark:bg-slate-700">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={berita.cover_image_url}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line text-base">
          {content}
        </div>
      </article>
    </main>
  );
}
