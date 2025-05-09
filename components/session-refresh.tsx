"use client"

import { useEffect } from "react"
import { createClientSupabaseClient } from "@/lib/supabase/client"

export function SessionRefresh() {
  useEffect(() => {
    const supabase = createClientSupabaseClient()

    // Check and refresh session if needed
    const refreshSession = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        console.error("Session refresh error:", error)
        // If there's an error, try to refresh the session
        await supabase.auth.refreshSession()
      }
    }

    refreshSession()

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "TOKEN_REFRESHED") {
        console.log("Token has been refreshed")
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return null
}
