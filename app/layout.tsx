import { SessionRefresh } from "@/components/session-refresh"
import { ReactQueryClientProvider } from "@/components/providers/query-provider"
import { ClientProviders } from "@/components/client-providers"
import type React from "react"
import type { Metadata, Viewport } from "next"
import { Toaster } from "@/components/ui/toaster"
import { Footer } from "@/components/footer"
import { SiteHeader } from "@/components/site-header"
import "./globals.css"

export const metadata: Metadata = {
  title: "Resend-It",
  description: "Smart reusable packaging as a service powered by Multi-Context AI and blockchain technologies",
  generator: "resend-it.com",
  manifest: "/manifest",
  applicationName: "Resend-It",
  appleWebApp: {
    capable: true,
    title: "Resend-It",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Resend-It",
    title: "Resend-It - Optimization Engine",
    description: "Smart reusable packaging as a service powered by Multi-Context AI and blockchain technologies",
  },
  icons: {
    icon: [
      {
        url: "/images/resendit-icon.png",
        href: "/images/resendit-icon.png",
      },
    ],
  },
}

export const viewport: Viewport = {
  themeColor: "#34A853",
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
    <ReactQueryClientProvider>
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/images/resendit-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Resend-It" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Resend-It" />
        <meta name="msapplication-TileColor" content="#34A853" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className="min-h-screen flex flex-col">
        <SiteHeader />
        <SessionRefresh />{" "}
        {/* Inside the RootLayout component, add the SessionRefresh component right after the <Providers> component */}
        <div className="flex-grow">{children}</div>
        <Footer />
        <Toaster />
      </body>
    </html>
    </ReactQueryClientProvider>
  )
}
