import ShippingPageClient from "./ShippingPageClient"
import { Navbar } from "@/components/navbar"

export const metadata = {
  title: "Shipping & Packages",
  description: "Manage your shipping and reusable packages",
}

export default function ShippingPage() {
  return (
    <>
      <Navbar showAuth={true} isLoggedIn={true} />
      <ShippingPageClient />
    </>
  )
}
