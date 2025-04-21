import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ShipmentTrackingView } from "@/components/shipping/shipment-tracking-view"

interface Props {
  params: { id: string }
}

export default async function TrackShipmentPage({ params }: Props) {
  const supabase = createServerSupabaseClient()

  // Get the shipment by public_id
  const { data: shipment, error } = await supabase.from("shipping").select("*").eq("public_id", params.id).single()

  if (error || !shipment) {
    console.error("Error fetching shipment:", error)
    redirect("/shipping")
  }

  return (
    <div className="container mx-auto py-6">
      <ShipmentTrackingView shipment={shipment} />
    </div>
  )
}