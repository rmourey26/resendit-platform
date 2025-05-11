"use server"

import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/database.types"

// This function should be run once to set up the storage buckets
export async function configureStorageBuckets() {
  try {
    console.log("Configuring storage buckets...")

    // Create a Supabase client with the service role key for admin operations
    const supabaseAdmin = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    )

    // Configure avatars bucket
    try {
      // Check if bucket exists
      const { data: avatarsBucket, error: avatarsCheckError } = await supabaseAdmin.storage.getBucket("avatars")

      if (avatarsCheckError && avatarsCheckError.message.includes("does not exist")) {
        console.log("Creating avatars bucket...")
        // Create bucket if it doesn't exist
        const { error: createError } = await supabaseAdmin.storage.createBucket("avatars", {
          public: true,
          fileSizeLimit: 5 * 1024 * 1024, // 5MB
          allowedMimeTypes: ["image/png", "image/jpeg", "image/gif", "image/webp"],
        })

        if (createError) {
          console.error("Error creating avatars bucket:", createError)
          throw createError
        }

        // Set bucket to public
        const { error: updateError } = await supabaseAdmin.storage.updateBucket("avatars", {
          public: true,
        })

        if (updateError) {
          console.error("Error updating avatars bucket:", updateError)
          throw updateError
        }

        console.log("Successfully created avatars bucket")
      } else if (avatarsBucket) {
        console.log("Avatars bucket already exists, ensuring it's public...")
        // Update existing bucket to ensure it's public
        const { error: updateError } = await supabaseAdmin.storage.updateBucket("avatars", {
          public: true,
        })

        if (updateError) {
          console.error("Error updating avatars bucket:", updateError)
          throw updateError
        }
      }

      // Configure company-logos bucket
      const { data: logosBucket, error: logosCheckError } = await supabaseAdmin.storage.getBucket("company-logos")

      if (logosCheckError && logosCheckError.message.includes("does not exist")) {
        console.log("Creating company-logos bucket...")
        // Create bucket if it doesn't exist
        const { error: createError } = await supabaseAdmin.storage.createBucket("company-logos", {
          public: true,
          fileSizeLimit: 5 * 1024 * 1024, // 5MB
          allowedMimeTypes: ["image/png", "image/jpeg", "image/gif", "image/webp", "image/svg+xml"],
        })

        if (createError) {
          console.error("Error creating company-logos bucket:", createError)
          throw createError
        }

        // Set bucket to public
        const { error: updateError } = await supabaseAdmin.storage.updateBucket("company-logos", {
          public: true,
        })

        if (updateError) {
          console.error("Error updating company-logos bucket:", updateError)
          throw updateError
        }

        console.log("Successfully created company-logos bucket")
      } else if (logosBucket) {
        console.log("Company-logos bucket already exists, ensuring it's public...")
        // Update existing bucket to ensure it's public
        const { error: updateError } = await supabaseAdmin.storage.updateBucket("company-logos", {
          public: true,
        })

        if (updateError) {
          console.error("Error updating company-logos bucket:", updateError)
          throw updateError
        }
      }

      return { success: true }
    } catch (error) {
      console.error("Error configuring storage buckets:", error)
      return { success: false, error }
    }
  } catch (error) {
    console.error("Error in configureStorageBuckets:", error)
    return { success: false, error }
  }
}
