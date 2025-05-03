import ShippingPageClient from "./ShippingPageClient"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI-Enhanced Shipping & Packages | Resend-It",
  description: "Manage your shipping and reusable packages with AI-powered optimization and analytics",
}

export default function ShippingPage() {
  return (
    <>
      <ShippingPageClient />
    </>
  )
}
