import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://super-app-web-gray.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/berita", "/berita/*"],
        disallow: ["/admin", "/admin/*", "/akun", "/akun/*", "/auth/*", "/login", "/reset-password", "/update-password"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
