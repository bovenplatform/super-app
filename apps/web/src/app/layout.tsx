import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://super-app-web-gray.vercel.app";

export const viewport: Viewport = {
  themeColor: "#004229",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Super-App Template - Enterprise Modular Portal",
    template: "%s | Super-App",
  },
  description: "Boilerplate sistem informasi dan portal layanan publik enterprise berbasis Turborepo, Next.js, dan Supabase.",
  openGraph: {
    title: "Super-App Template",
    description: "Enterprise Modular Super-App Portal",
    url: siteUrl,
    siteName: "Super-App",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Super-App Template",
    description: "Enterprise Modular Super-App Portal",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
