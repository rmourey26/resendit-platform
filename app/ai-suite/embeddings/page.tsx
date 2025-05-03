import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { EmbeddingsClient } from "./embeddings-client"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI Embeddings Management",
  description: "Manage your AI embeddings and RAG settings",
}

export default async function EmbeddingsPage() {
  const supabase = createServerSupabaseClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch user's embeddings
  const { data: embeddings, error: embeddingsError } = await supabase
    .from("data_embeddings")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (embeddingsError) {
    console.error("Error fetching embeddings:", embeddingsError)
  }

  // Fetch all AI models
  const { data: aiModels, error: aiModelsError } = await supabase
    .from("ai_models")
    .select("*")
    .order("name", { ascending: true })

  if (aiModelsError) {
    console.error("Error fetching AI models:", aiModelsError)
  }

  // Fetch user's AI agents
  const { data: aiAgents, error: aiAgentsError } = await supabase
    .from("ai_agents")
    .select("*")
    .eq("user_id", user.id)
    .order("name", { ascending: true })

  if (aiAgentsError) {
    console.error("Error fetching AI agents:", aiAgentsError)
  }

  // Fetch embedding jobs
  const { data: embeddingJobs, error: jobsError } = await supabase
    .from("embedding_jobs")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10)

  if (jobsError) {
    console.error("Error fetching embedding jobs:", jobsError)
  }

  // Fetch user settings
  const { data: userSettings, error: settingsError } = await supabase
    .from("user_settings")
    .select("*")
    .eq("user_id", user.id)
    .eq("settings_type", "embeddings")
    .single()

  if (settingsError && settingsError.code !== "PGRST116") {
    console.error("Error fetching user settings:", settingsError)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Embeddings Management</h1>

      <EmbeddingsClient
        user={user}
        embeddings={embeddings || []}
        aiModels={aiModels || []}
        aiAgents={aiAgents || []}
        embeddingJobs={embeddingJobs || []}
        userSettings={userSettings?.settings || null}
      />
    </div>
  )
}
