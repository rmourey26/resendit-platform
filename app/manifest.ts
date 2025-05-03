import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Resend-It",
    short_name: "Resend-It",
    description: "Pioneering reusable smart packaging platform powered by cutting-edge multi-context AI and secure blockchain technology for sustainable business growth",
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
