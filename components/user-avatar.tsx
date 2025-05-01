"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClientSupabaseClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import { Skeleton } from "@/components/ui/skeleton"

interface UserAvatarProps {
  user: User | null
  className?: string
}

export function UserAvatar({ user, className }: UserAvatarProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [initials, setInitials] = useState("")
  const supabase = createClientSupabaseClient()

  useEffect(() => {
    async function fetchProfile() {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("avatar_url, full_name")
          .eq("user_id", user.id)
          .single()

        if (error) {
          console.error("Error fetching profile:", error)
        } else if (profile) {
          setAvatarUrl(profile.avatar_url)

          // Generate initials from full name or email
          if (profile.full_name) {
            const names = profile.full_name.split(" ")
            const firstInitial = names[0] ? names[0][0] : ""
            const lastInitial = names.length > 1 ? names[names.length - 1][0] : ""
            setInitials((firstInitial + lastInitial).toUpperCase())
          } else if (user.email) {
            setInitials(user.email[0].toUpperCase())
          }
        }
      } catch (error) {
        console.error("Error in fetchProfile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user, supabase])

  if (loading) {
    return <Skeleton className={`h-10 w-10 rounded-full ${className}`} />
  }

  return (
    <Avatar className={className}>
      <AvatarImage src={avatarUrl || undefined} alt="User avatar" />
      <AvatarFallback className="bg-green-600 text-white">{initials || "U"}</AvatarFallback>
    </Avatar>
  )
}
