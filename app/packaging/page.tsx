import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getProfile } from "../actions/profile"
import PackagingPageClient from "./packaging-client"

export const dynamic = "force-dynamic"

export default async function PackagingPage() {
  const supabase = createServerSupabaseClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      redirect("/login")
    }

    // Get profile with error handling
    let profile
    try {
      profile = await getProfile(user.id)
    } catch (error) {
      console.error("Error fetching profile:", error)
      profile = {
        id: user.id,
        name: user.user_metadata?.name || "",
        email: user.email || "",
        company: user.user_metadata?.company || "",
        website: user.user_metadata?.website || "",
      }
    }

    return <PackagingPageClient userId={user.id} profileData={profile} />
  } catch (error) {
    console.error("Authentication error:", error)
    redirect("/login")
  }
}
