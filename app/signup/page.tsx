import type { Metadata } from "next"
import SignupSimplePageClient from "./pageClient"

export const metadata: Metadata = {
  title: "Simple Sign Up - CardChain",
  description: "Create your account with image URLs",
}

export default async function SignupSimplePage() {
  return <SignupSimplePageClient />
}
