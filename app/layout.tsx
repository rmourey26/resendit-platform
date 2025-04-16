import type React from "react"
import type { Metadata, Viewport } from "next"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

export const metadata: Metadata = {
  title: "ShipIQ",
  description: "Smart reusable packaging as a service powered by Multi-Context AI and Web 3.0 embedded finance technologies.",
  generator: "NextJS",
  manifest: "/manifest",
  applicationName: "ShipIQ",
  appleWebApp: {
    capable: true,
    title: "ShipIQ",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "ShipIQ",
    title: "ShipIQ - Smart Reususable Packaging as a Service",
    description: "Smart reusable packaging as a service powered by Multi-Context AI and Web 3.0 embedded finance technologies.",
  },
}

export const viewport: Viewport = {
  themeColor: "#3b82f6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ShipIQ" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="ShipIQ" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}


import './globals.css'