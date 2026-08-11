export default function manifest() {
  return {
    id: "/",
    name: "Thay Art",
    short_name: "Thay Art",
    description: "Artesanías únicas modeladas a mano.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0f1a0d",
    theme_color: "#4e6b3e",
    lang: "es",
    dir: "ltr",
    categories: ["art", "lifestyle", "shopping"],
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/maskable-icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/maskable-icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  }
}
