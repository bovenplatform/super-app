import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Super-App Template",
  description: "Modular Enterprise Boilerplate",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
