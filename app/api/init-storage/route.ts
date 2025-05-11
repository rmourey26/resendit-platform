import { NextResponse } from "next/server"
import { configureStorageBuckets } from "@/lib/storage-config"

export async function GET() {
  try {
    const result = await configureStorageBuckets()

    if (result.success) {
      return NextResponse.json({ success: true, message: "Storage buckets configured successfully" })
    } else {
      console.error("Failed to configure storage buckets:", result.error)
      return NextResponse.json(
        {
          success: false,
          message: "Failed to configure storage buckets",
          error: result.error instanceof Error ? result.error.message : String(result.error),
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error in init-storage API route:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error configuring storage buckets",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
