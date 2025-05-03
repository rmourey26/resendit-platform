"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { EmbeddingSystem } from "@/lib/embeddings/embedding-system"
import { revalidatePath } from "next/cache"

// Get embeddings settings for a user
export async function getEmbeddingsSettings(userId: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("user_settings")
    .select("settings")
    .eq("user_id", userId)
    .eq("settings_type", "embeddings")
    .single()

  if (error) {
    if (error.code === "PGRST116") {
      // No settings found
      return null
    }
    console.error("Error fetching embeddings settings:", error)
    throw new Error("Failed to fetch embeddings settings")
  }

  return data?.settings
}

// Save embeddings settings for a user
export async function saveEmbeddingsSettings(userId: string, settings: any) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("user_settings")
    .upsert({
      user_id: userId,
      settings_type: "embeddings",
      settings: settings,
    })
    .select()

  if (error) {
    console.error("Error saving embeddings settings:", error)
    throw new Error("Failed to save embeddings settings")
  }

  revalidatePath("/ai-suite/embeddings")
  return data
}

// Get RAG settings for a specific agent
export async function getRagSettings(userId: string, agentId: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("ai_agent_settings")
    .select("settings")
    .eq("user_id", userId)
    .eq("agent_id", agentId)
    .eq("settings_type", "rag")
    .single()

  if (error) {
    if (error.code === "PGRST116") {
      // No settings found
      return null
    }
    console.error("Error fetching RAG settings:", error)
    throw new Error("Failed to fetch RAG settings")
  }

  return data?.settings
}

// Save RAG settings for a specific agent
export async function saveRagSettings(userId: string, agentId: string, settings: any) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("ai_agent_settings")
    .upsert({
      user_id: userId,
      agent_id: agentId,
      settings_type: "rag",
      settings: settings,
    })
    .select()

  if (error) {
    console.error("Error saving RAG settings:", error)
    throw new Error("Failed to save RAG settings")
  }

  // Update the agent to include RAG capability if enabled
  if (settings.enabled) {
    const { error: agentError } = await supabase
      .from("ai_agents")
      .update({
        tools: supabase.rpc("append_tool_if_not_exists", {
          agent_tools: [],
          new_tool: { type: "retrieval", enabled: true },
        }),
      })
      .eq("id", agentId)
      .eq("user_id", userId)

    if (agentError) {
      console.error("Error updating agent tools:", agentError)
    }
  }

  revalidatePath("/ai-suite/embeddings")
  return data
}

// Upload file and create embeddings
export async function uploadFileForEmbedding(formData: FormData) {
  const supabase = createServerSupabaseClient()

  // Get environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase configuration")
  }

  // Extract form data
  const files = formData.getAll("files") as File[]
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const modelId = formData.get("modelId") as string
  const chunkSize = Number.parseInt(formData.get("chunkSize") as string)
  const chunkOverlap = Number.parseInt(formData.get("chunkOverlap") as string)
  const userId = formData.get("userId") as string

  // Create embedding job
  const { data: jobData, error: jobError } = await supabase
    .from("embedding_jobs")
    .insert({
      job_type: "file_upload",
      status: "processing",
      parameters: {
        name,
        description,
        modelId,
        chunkSize,
        chunkOverlap,
        fileCount: files.length,
      },
      user_id: userId,
    })
    .select()

  if (jobError) {
    console.error("Error creating embedding job:", jobError)
    throw new Error("Failed to create embedding job")
  }

  const jobId = jobData[0].id

  try {
    // Get the model details
    const { data: modelData, error: modelError } = await supabase
      .from("ai_models")
      .select("*")
      .eq("id", modelId)
      .single()

    if (modelError) {
      throw new Error("Failed to fetch embedding model")
    }

    // Upload files to storage
    const fileIds = []
    for (const file of files) {
      const fileName = `${userId}/${Date.now()}-${file.name}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("embedding_files")
        .upload(fileName, file)

      if (uploadError) {
        throw new Error(`Failed to upload file: ${uploadError.message}`)
      }

      // Record file in database
      const { data: fileData, error: fileError } = await supabase
        .from("embedding_files")
        .insert({
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          file_path: uploadData.path,
          user_id: userId,
        })
        .select()

      if (fileError) {
        throw new Error(`Failed to record file: ${fileError.message}`)
      }

      fileIds.push(fileData[0].id)
    }

    // Update job with file IDs
    await supabase
      .from("embedding_jobs")
      .update({
        file_ids: fileIds,
      })
      .eq("id", jobId)

    // Initialize the embedding system
    const embeddingSystem = new EmbeddingSystem(supabaseUrl, supabaseServiceKey, modelData.model_id)

    // Process each file
    for (const file of files) {
      // Read file content
      const fileContent = await file.text()

      // Create document chunks
      const chunks = await embeddingSystem.processDocumentFile(fileContent, file.name, { chunkSize, chunkOverlap })

      // Create embeddings
      await embeddingSystem.createEmbeddings(chunks, userId, name, description)
    }

    // Update job status to completed
    await supabase
      .from("embedding_jobs")
      .update({
        status: "completed",
        result: {
          message: "Successfully processed files and created embeddings",
          fileCount: files.length,
          chunkCount: files.length * 5, // Approximate
        },
      })
      .eq("id", jobId)
  } catch (error: any) {
    console.error("Error processing files:", error)

    // Update job status to failed
    await supabase
      .from("embedding_jobs")
      .update({
        status: "failed",
        error: error.message,
      })
      .eq("id", jobId)

    throw error
  }

  revalidatePath("/ai-suite/embeddings")
  return { success: true }
}

// Create embeddings from text
export async function createEmbeddingFromText(data: {
  name: string
  description: string
  modelId: string
  chunkSize: number
  chunkOverlap: number
  textContent: string
  userId: string
}) {
  const supabase = createServerSupabaseClient()

  // Get environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase configuration")
  }

  // Create embedding job
  const { data: jobData, error: jobError } = await supabase
    .from("embedding_jobs")
    .insert({
      job_type: "text_input",
      status: "processing",
      parameters: {
        name: data.name,
        description: data.description,
        modelId: data.modelId,
        chunkSize: data.chunkSize,
        chunkOverlap: data.chunkOverlap,
        textLength: data.textContent.length,
      },
      user_id: data.userId,
    })
    .select()

  if (jobError) {
    console.error("Error creating embedding job:", jobError)
    throw new Error("Failed to create embedding job")
  }

  const jobId = jobData[0].id

  try {
    // Get the model details
    const { data: modelData, error: modelError } = await supabase
      .from("ai_models")
      .select("*")
      .eq("id", data.modelId)
      .single()

    if (modelError) {
      throw new Error("Failed to fetch embedding model")
    }

    // Initialize the embedding system
    const embeddingSystem = new EmbeddingSystem(supabaseUrl, supabaseServiceKey, modelData.model_id)

    // Create document chunks
    const chunks = await embeddingSystem.processDocumentFile(data.textContent, "text-input.txt", {
      chunkSize: data.chunkSize,
      chunkOverlap: data.chunkOverlap,
    })

    // Create embeddings
    await embeddingSystem.createEmbeddings(chunks, data.userId, data.name, data.description)

    // Update job status to completed
    await supabase
      .from("embedding_jobs")
      .update({
        status: "completed",
        result: {
          message: "Successfully processed text and created embeddings",
          chunkCount: chunks.length,
        },
      })
      .eq("id", jobId)
  } catch (error: any) {
    console.error("Error processing text:", error)

    // Update job status to failed
    await supabase
      .from("embedding_jobs")
      .update({
        status: "failed",
        error: error.message,
      })
      .eq("id", jobId)

    throw error
  }

  revalidatePath("/ai-suite/embeddings")
  return { success: true }
}

// Update an embedding
export async function updateEmbedding(embeddingId: string, userId: string, updates: any) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("data_embeddings")
    .update(updates)
    .eq("id", embeddingId)
    .eq("user_id", userId)
    .select()

  if (error) {
    console.error("Error updating embedding:", error)
    throw new Error("Failed to update embedding")
  }

  revalidatePath("/ai-suite/embeddings")
  return data
}

// Delete an embedding
export async function deleteEmbedding(embeddingId: string, userId: string) {
  const supabase = createServerSupabaseClient()

  // First, check if there are any files associated with this embedding
  const { data: files, error: filesError } = await supabase
    .from("embedding_files")
    .select("id, file_path")
    .eq("embedding_id", embeddingId)

  if (filesError) {
    console.error("Error fetching embedding files:", filesError)
  } else if (files && files.length > 0) {
    // Delete files from storage
    for (const file of files) {
      await supabase.storage.from("embedding_files").remove([file.file_path])
    }

    // Delete file records
    await supabase.from("embedding_files").delete().eq("embedding_id", embeddingId)
  }

  // Delete the embedding
  const { error } = await supabase.from("data_embeddings").delete().eq("id", embeddingId).eq("user_id", userId)

  if (error) {
    console.error("Error deleting embedding:", error)
    throw new Error("Failed to delete embedding")
  }

  revalidatePath("/ai-suite/embeddings")
  return { success: true }
}
