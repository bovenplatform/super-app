import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Super-App Template",
    short_name: "SuperApp",
    description: "Enterprise Modular Super-App Portal",
    start_url: "/",
    display: "standalone",
    background_color: "#004229",
    theme_color: "#004229",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
