"use client"

import { useState, useEffect } from "react"
import { getUserPackagingOrders } from "@/app/actions/packaging-orders"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Package } from "lucide-react"
import { packagingMaterials } from "@/lib/schemas/packaging"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function PackagingOrdersList() {
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchOrders() {
      setIsLoading(true)
      try {
        const result = await getUserPackagingOrders()
        if (result.success) {
          setOrders(result.data)
        }
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>
      case "confirmed":
        return <Badge variant="secondary">Confirmed</Badge>
      case "processing":
        return <Badge variant="default">Processing</Badge>
      case "shipped":
        return (
          <Badge variant="default" className="bg-blue-500">
            Shipped
          </Badge>
        )
      case "delivered":
        return (
          <Badge variant="default" className="bg-green-500">
            Delivered
          </Badge>
        )
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getMaterialName = (materialType: string) => {
    const material = packagingMaterials.find((m) => m.id === materialType)
    return material ? material.name : materialType
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <span>Loading your orders...</span>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Package className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No orders yet</h3>
          <p className="text-muted-foreground text-center mb-4">You haven't placed any packaging orders yet.</p>
          <Button asChild>
            <Link href="/packaging">Create Your First Order</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Your Packaging Orders</h2>
      {orders.map((order) => (
        <Card key={order.id} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-medium">Order #{order.id.substring(0, 8)}</h3>
                  {getStatusBadge(order.status)}
                </div>
                <p className="text-muted-foreground mb-2">
                  Placed on {new Date(order.created_at).toLocaleDateString()}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mt-4">
                  <div>
                    <p className="text-sm font-medium">Order Type</p>
                    <p className="text-sm text-muted-foreground">
                      {order.order_type === "standard" ? "Standard" : "Custom"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Material</p>
                    <p className="text-sm text-muted-foreground">{getMaterialName(order.material_type)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Quantity</p>
                    <p className="text-sm text-muted-foreground">{order.quantity}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">IoT Sensors</p>
                    <p className="text-sm text-muted-foreground">{order.include_iot_sensors ? "Yes" : "No"}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-between items-end">
                <div className="text-right">
                  <p className="text-sm font-medium">Total</p>
                  <p className="text-lg font-bold">${order.total_price.toFixed(2)}</p>
                </div>
                <Button variant="outline" asChild className="mt-4">
                  <Link href={`/packaging/orders/${order.id}`}>View Details</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
