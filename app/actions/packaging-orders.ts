"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { packagingOrderSchema } from "@/lib/schemas/packaging"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

// Create a new packaging order
export async function createPackagingOrder(orderData: any) {
  const cookieStore = cookies()
  const supabase = createServerSupabaseClient(cookieStore)

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      redirect("/login")
    }

    // Get the user's profile
    const { data: profile } = await supabase.from("profiles").select("*").eq("user_id", user.id).single()

    // Add user_id and profile_id to the order data
    const orderWithIds = {
      ...orderData,
      user_id: user.id,
      profile_id: profile?.id,
    }

    // Validate the order data
    const validatedData = packagingOrderSchema.parse(orderWithIds)

    // Calculate the total price (simplified for demo)
    let basePrice = 0
    if (validatedData.order_type === "standard") {
      basePrice = 25.99 * validatedData.quantity
    } else {
      basePrice = 39.99 * validatedData.quantity
    }

    // Add material price multiplier
    let materialMultiplier = 1.0
    switch (validatedData.material_type) {
      case "pp_woven":
        materialMultiplier = 1.0
        break
      case "pp_nonwoven":
        materialMultiplier = 1.2
        break
      case "laminated_rubber":
        materialMultiplier = 1.5
        break
      default:
        materialMultiplier = 1.0
    }

    // Add IoT sensor costs
    const iotSensorCost = validatedData.has_iot_sensors ? validatedData.iot_sensor_count * 12.99 : 0

    // Calculate total price
    const totalPrice = basePrice * materialMultiplier + iotSensorCost

    // Create the order with the calculated price
    const { data: order, error } = await supabase
      .from("packaging_orders")
      .insert({
        ...validatedData,
        total_price: totalPrice,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating packaging order:", error)
      return { success: false, error: error.message }
    }

    // Send confirmation email to user
    await sendOrderConfirmationEmail(user.email!, order)

    // Send notification email to support
    await sendOrderNotificationEmail(order)

    revalidatePath("/packaging")
    return { success: true, data: order }
  } catch (error) {
    console.error("Error in createPackagingOrder:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// Get all packaging orders for the current user
export async function getUserPackagingOrders() {
  const cookieStore = cookies()
  const supabase = createServerSupabaseClient(cookieStore)

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      redirect("/login")
    }

    // Fetch packaging orders
    const { data: orders, error } = await supabase
      .from("packaging_orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching packaging orders:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data: orders }
  } catch (error) {
    console.error("Error in getUserPackagingOrders:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// Get a specific packaging order by ID
export async function getPackagingOrderById(orderId: string) {
  const cookieStore = cookies()
  const supabase = createServerSupabaseClient(cookieStore)

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      redirect("/login")
    }

    // Fetch the packaging order
    const { data: order, error } = await supabase
      .from("packaging_orders")
      .select("*")
      .eq("id", orderId)
      .eq("user_id", user.id)
      .single()

    if (error) {
      console.error("Error fetching packaging order:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data: order }
  } catch (error) {
    console.error("Error in getPackagingOrderById:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// Update a packaging order
export async function updatePackagingOrder(orderId: string, updates: any) {
  const cookieStore = cookies()
  const supabase = createServerSupabaseClient(cookieStore)

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      redirect("/login")
    }

    // Validate the updates
    const validatedUpdates = packagingOrderSchema.partial().parse(updates)

    // Update the order
    const { data, error } = await supabase
      .from("packaging_orders")
      .update(validatedUpdates)
      .eq("id", orderId)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating packaging order:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/packaging")
    return { success: true, data }
  } catch (error) {
    console.error("Error in updatePackagingOrder:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// Cancel a packaging order
export async function cancelPackagingOrder(orderId: string) {
  const cookieStore = cookies()
  const supabase = createServerSupabaseClient(cookieStore)

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      redirect("/login")
    }

    // Update the order status to cancelled
    const { data, error } = await supabase
      .from("packaging_orders")
      .update({ status: "cancelled" })
      .eq("id", orderId)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) {
      console.error("Error cancelling packaging order:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/packaging")
    return { success: true, data }
  } catch (error) {
    console.error("Error in cancelPackagingOrder:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// Confirm a packaging order (for admin use)
export async function confirmPackagingOrder(orderId: string) {
  const cookieStore = cookies()
  const supabase = createServerSupabaseClient(cookieStore)

  try {
    // This should be protected by admin authentication in a real app
    // For demo purposes, we'll just update the status

    // Update the order status to confirmed
    const { data, error } = await supabase
      .from("packaging_orders")
      .update({ status: "confirmed" })
      .eq("id", orderId)
      .select()
      .single()

    if (error) {
      console.error("Error confirming packaging order:", error)
      return { success: false, error: error.message }
    }

    // Send confirmation email to the user
    const { data: userData } = await supabase.from("profiles").select("email").eq("id", data.profile_id).single()

    if (userData?.email) {
      await sendOrderStatusUpdateEmail(userData.email, data)
    }

    revalidatePath("/packaging")
    revalidatePath(`/packaging/orders/${orderId}`)
    return { success: true, data }
  } catch (error) {
    console.error("Error in confirmPackagingOrder:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// Helper functions for sending emails
async function sendOrderConfirmationEmail(email: string, order: any) {
  try {
    await resend.emails.send({
      from: "orders@resendit.com",
      to: email,
      subject: `Order Confirmation - #${order.id.substring(0, 8)}`,
      html: `
        <h1>Thank you for your order!</h1>
        <p>Your order #${order.id.substring(0, 8)} has been received and is being processed.</p>
        <p>Order Details:</p>
        <ul>
          <li>Order Type: ${order.order_type === "standard" ? "Standard" : "Custom"}</li>
          <li>Material: ${getMaterialName(order.material_type)}</li>
          <li>Quantity: ${order.quantity}</li>
          <li>Total Price: $${order.total_price.toFixed(2)}</li>
        </ul>
        <p>You can view your order status at any time by visiting your account dashboard.</p>
        <p>Thank you for choosing Resend-It for your sustainable packaging needs!</p>
      `,
    })
  } catch (error) {
    console.error("Error sending confirmation email:", error)
  }
}

async function sendOrderNotificationEmail(order: any) {
  try {
    const orderViewUrl = `${process.env.NEXT_PUBLIC_APP_URL}/admin/packaging/orders/${order.id}`

    await resend.emails.send({
      from: "orders@resendit.com",
      to: "support@resendit.com",
      subject: `New Packaging Order - #${order.id.substring(0, 8)}`,
      html: `
        <h1>New Packaging Order Received</h1>
        <p>A new packaging order has been submitted.</p>
        <p>Order Details:</p>
        <ul>
          <li>Order ID: ${order.id}</li>
          <li>Order Type: ${order.order_type === "standard" ? "Standard" : "Custom"}</li>
          <li>Material: ${getMaterialName(order.material_type)}</li>
          <li>Quantity: ${order.quantity}</li>
          <li>Total Price: $${order.total_price.toFixed(2)}</li>
        </ul>
        <p><a href="${orderViewUrl}">Click here to view and confirm the order</a></p>
      `,
    })
  } catch (error) {
    console.error("Error sending notification email:", error)
  }
}

async function sendOrderStatusUpdateEmail(email: string, order: any) {
  try {
    await resend.emails.send({
      from: "orders@resendit.com",
      to: email,
      subject: `Order Status Update - #${order.id.substring(0, 8)}`,
      html: `
        <h1>Your Order Status Has Been Updated</h1>
        <p>Your order #${order.id.substring(0, 8)} has been confirmed and is now being processed.</p>
        <p>Order Details:</p>
        <ul>
          <li>Order Type: ${order.order_type === "standard" ? "Standard" : "Custom"}</li>
          <li>Material: ${getMaterialName(order.material_type)}</li>
          <li>Quantity: ${order.quantity}</li>
          <li>Status: ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</li>
        </ul>
        <p>You can view your order status at any time by visiting your account dashboard.</p>
        <p>Thank you for choosing Resend-It for your sustainable packaging needs!</p>
      `,
    })
  } catch (error) {
    console.error("Error sending status update email:", error)
  }
}

// Helper function to get material name from ID
function getMaterialName(materialType: string): string {
  switch (materialType) {
    case "pp_woven":
      return "PP Woven Fabric"
    case "pp_nonwoven":
      return "PP NonWoven Fabric"
    case "laminated_rubber":
      return "Laminated Rubber Substrate"
    default:
      return "Other"
  }
}
