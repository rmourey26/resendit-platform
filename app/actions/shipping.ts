"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// Import the shipping and reusable package schemas
import { shippingSchema, reusablePackageSchema } from "@/lib/schemas/shipping"

// Fetch all shipping records for a user
export async function getShippingData() {
  const cookieStore = cookies()
  const supabase = createServerSupabaseClient(cookieStore)

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      redirect("/login")
    }

    // Fetch shipping data
    const { data: shippingData, error: shippingError } = await supabase
      .from("shipping")
      .select("*")
      .order("created_at", { ascending: false })

    if (shippingError) {
      console.error("Error fetching shipping data:", shippingError)
      return { success: false, error: shippingError.message }
    }

    return { success: true, data: shippingData }
  } catch (error) {
    console.error("Error in getShippingData:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// Fetch all reusable packages
export async function getReusablePackages() {
  const cookieStore = cookies()
  const supabase = createServerSupabaseClient(cookieStore)

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      redirect("/login")
    }

    // Fetch reusable packages data
    const { data: packagesData, error: packagesError } = await supabase
      .from("reusable_packages")
      .select("*")
      .order("created_at", { ascending: false })

    if (packagesError) {
      console.error("Error fetching reusable packages:", packagesError)
      return { success: false, error: packagesError.message }
    }

    return { success: true, data: packagesData }
  } catch (error) {
    console.error("Error in getReusablePackages:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// Update a reusable package
export async function updateReusablePackage(packageId: string, updates: Partial<any>) {
  const cookieStore = cookies()
  const supabase = createServerSupabaseClient(cookieStore)

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      redirect("/login")
    }

    // Validate the updates against the reusablePackageSchema
    const validatedUpdates = reusablePackageSchema.partial().parse(updates)

    // Update the package
    const { data, error } = await supabase
      .from("reusable_packages")
      .update(validatedUpdates)
      .eq("id", packageId)
      .select()
      .single()

    if (error) {
      console.error("Error updating reusable package:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/shipping")
    return { success: true, data }
  } catch (error) {
    console.error("Error in updateReusablePackage:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// Create a new shipping record
export async function createShippingRecord(shippingData: any) {
  const cookieStore = cookies()
  const supabase = createServerSupabaseClient(cookieStore)

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      redirect("/login")
    }

    // Validate the shipping data against the shippingSchema
    const validatedData = shippingSchema.parse(shippingData)

    // Create the shipping record
    const { data, error } = await supabase.from("shipping").insert(validatedData).select().single()

    if (error) {
      console.error("Error creating shipping record:", error)
      return { success: false, error: error.message }
    }

    // Update the status of the packages to "in_use"
    if (shippingData.package_ids && shippingData.package_ids.length > 0) {
      const { error: updateError } = await supabase
        .from("reusable_packages")
        .update({ status: "in_use" })
        .in("id", shippingData.package_ids)

      if (updateError) {
        console.error("Error updating package status:", updateError)
      }
    }

    revalidatePath("/shipping")
    return { success: true, data }
  } catch (error) {
    console.error("Error in createShippingRecord:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// Update a shipping record
export async function updateShippingRecord(shippingId: string, updates: Partial<any>) {
  const cookieStore = cookies()
  const supabase = createServerSupabaseClient(cookieStore)

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      redirect("/login")
    }

    // Validate the updates against the shippingSchema
    const validatedUpdates = shippingSchema.partial().parse(updates)

    // Get the current shipping record to check for status changes
    const { data: currentShipping, error: fetchError } = await supabase
      .from("shipping")
      .select("status, package_ids")
      .eq("id", shippingId)
      .single()

    if (fetchError) {
      console.error("Error fetching current shipping record:", fetchError)
      return { success: false, error: fetchError.message }
    }

    // Update the shipping record
    const { data, error } = await supabase
      .from("shipping")
      .update(validatedUpdates)
      .eq("id", shippingId)
      .select()
      .single()

    if (error) {
      console.error("Error updating shipping record:", error)
      return { success: false, error: error.message }
    }

    // If the status changed to "delivered", update the packages to "available"
    if (
      updates.status === "delivered" &&
      currentShipping.status !== "delivered" &&
      currentShipping.package_ids &&
      currentShipping.package_ids.length > 0
    ) {
      const { error: updateError } = await supabase
        .from("reusable_packages")
        .update({
          status: "available",
          reuse_count: supabase.rpc("increment_reuse_count"),
        })
        .in("id", currentShipping.package_ids)

      if (updateError) {
        console.error("Error updating package status:", updateError)
      }
    }

    revalidatePath("/shipping")
    return { success: true, data }
  } catch (error) {
    console.error("Error in updateShippingRecord:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// Get shipping analytics
export async function getShippingAnalytics() {
  const cookieStore = cookies()
  const supabase = createServerSupabaseClient(cookieStore)

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      redirect("/login")
    }

    // Fetch shipping analytics
    const { data, error } = await supabase
      .from("shipping_analytics")
      .select("*")
      .order("shipping_day", { ascending: false })

    if (error) {
      console.error("Error fetching shipping analytics:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in getShippingAnalytics:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// Get package utilization data
export async function getPackageUtilization() {
  const cookieStore = cookies()
  const supabase = createServerSupabaseClient(cookieStore)

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      redirect("/login")
    }

    // Fetch package utilization
    const { data, error } = await supabase
      .from("package_utilization")
      .select("*")
      .order("reuses_per_day", { ascending: false })

    if (error) {
      console.error("Error fetching package utilization:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in getPackageUtilization:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
