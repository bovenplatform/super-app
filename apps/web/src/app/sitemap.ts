import { createPublicSupabase, isSupabaseConfigured } from "@/lib/supabase";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://super-app-web-gray.vercel.app";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/berita`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  if (isSupabaseConfigured()) {
    try {
      const supabase = createPublicSupabase();
      const { data } = await supabase
        .from("berita")
        .select("slug, updated_at")
        .eq("status", "published");

      const beritaList = data as { slug: string; updated_at: string }[] | null;

      if (beritaList && beritaList.length > 0) {
        const beritaRoutes: MetadataRoute.Sitemap = beritaList.map((item) => ({
          url: `${siteUrl}/berita/${item.slug}`,
          lastModified: new Date(item.updated_at),
          changeFrequency: "weekly",
          priority: 0.8,
        }));
        return [...staticRoutes, ...beritaRoutes];
      }
    } catch {
      // Fallback
    }
  }

  return staticRoutes;
}
