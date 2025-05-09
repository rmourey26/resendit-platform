"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { createClientSupabaseClient } from "@/lib/supabase/client"

export default function EmbeddingsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()
  const supabase = createClientSupabaseClient()

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Embeddings page error:", error)
  }, [error])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 text-center">
      <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
      <p className="mb-6 text-gray-600 max-w-md">
        {error.message || "An error occurred while loading this page. This might be due to an authentication issue."}
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={reset} variant="outline">
          Try again
        </Button>
        <Button onClick={handleSignOut}>Sign out and log in again</Button>
      </div>
    </div>
  )
}
