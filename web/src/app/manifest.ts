import type { MetadataRoute } from "next";

/**
 * Web App Manifest for PWA install and "Add to Home Screen".
 * Icons: add icon-192.png and icon-512.png to public/ (PNG, 192×192 and 512×512).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PixelMind",
    short_name: "PixelMind",
    description:
      "PixelMind – pixel habit tracking, night journaling, and AI memory in one place.",
    start_url: "/app",
    display: "standalone",
    background_color: "#161c24",
    theme_color: "#161c24",
    orientation: "portrait",
    scope: "/",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
  };
}
