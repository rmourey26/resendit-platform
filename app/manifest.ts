import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Resend-It",
    short_name: "Resend-It",
    description: "Smart, sustainable, eco-friendly WAIQ platform for the circular economy.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#34A853",
    icons: [
      {
        src: "/images/resendit-icon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/images/resendit-icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}
