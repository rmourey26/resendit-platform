import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { AppInstallBanner } from "@/components/app-install-banner"
import { PWARegister } from "@/components/pwa-register"
import { PlatformFeatures } from "@/components/platform-features"

export const metadata: Metadata = {
  title: "Home | Resend-It",
  description: "Smart, sustainable, eco-friendly WAIQ platform for the circular economy",
}

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header 
      <Navbar showAuth={true} isLoggedIn={false} />
      */}

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-12 md:py-24 lg:py-32">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2 max-w-[600px]">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Smart Packaging as-a Service
                  </h1>
                  <p className="text-gray-500 md:text-xl dark:text-gray-400 mt-4">
                    Amplify revenue 40% with our eco-friendly, easy to use, robotic ready, WAIQ platform.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <Link href="/signup">
                    <Button size="lg" className="inline-flex items-center">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#features">
                    <Button size="lg" variant="outline">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center lg:justify-end">
                <div className="relative w-full max-w-[500px] aspect-[4/3] rounded-lg overflow-hidden shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 z-10 rounded-lg"></div>
                  <Image
                    src="https://quantumone.b-cdn.net/card0/open-graph.svg?height=600&width=800"
                    alt="Business Card Preview"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 z-20">
                    <h3 className="text-white font-bold text-xl">Multi Context AI Powered Ops</h3>
                    <p className="text-white/80 text-sm mt-1">Sustainable high tech embedded into your business </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-1/4 right-0 w-32 h-32 bg-blue-200 rounded-full blur-3xl opacity-30 dark:bg-blue-900"></div>
          <div className="absolute bottom-1/4 left-0 w-32 h-32 bg-purple-200 rounded-full blur-3xl opacity-30 dark:bg-purple-900"></div>
        </section>

        {/* First Feature Animations Section 
        <section id="platform-capabilities" className="w-full">
          <FeatureAnimations />
        </section>
        */}

        {/* Second Feature Animations Section */}
        <section id="platform-features" className="w-full">
          <PlatformFeatures />
        </section>
      </main>

      {/* PWA Components */}
      <AppInstallBanner />
      <PWARegister />
    </div>
  )
}
