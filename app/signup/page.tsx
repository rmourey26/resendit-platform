import type { Metadata } from "next"
import SignupPageClient from "./pageClient"

export const metadata: Metadata = {
  title: "Sign Up - ShipIQ",
  description: "Create your ShipIQ shareable digital contact card to get started",
}

export default async function SignupPage() {
  return <SignupPageClient />
}
