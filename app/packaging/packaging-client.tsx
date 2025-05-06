"use client"

import { useState } from "react"
import { PackagingDesigner } from "@/components/packaging/packaging-designer"
import { createPackagingOrder } from "@/app/actions/packaging-orders"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PackagingOrdersList } from "@/components/packaging/packaging-orders-list"

interface PackagingPageClientProps {
  userId: string
  profileData: any
}

export default function PackagingPageClient({ userId, profileData }: PackagingPageClientProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmitOrder = async (orderData: any) => {
    setIsSubmitting(true)
    try {
      const result = await createPackagingOrder(orderData)

      if (result.success) {
        toast({
          title: "Order submitted successfully",
          description: "Your packaging order has been submitted and is being processed.",
        })
        router.push(`/packaging/orders/${result.data.id}`)
      } else {
        toast({
          title: "Order submission failed",
          description: result.error || "There was an error submitting your order. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting order:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Branded Reusable Packaging</h1>

      <Tabs defaultValue="design" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="design">Design New Packaging</TabsTrigger>
          <TabsTrigger value="orders">My Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="design">
          <PackagingDesigner userId={userId} profileData={profileData} onSubmit={handleSubmitOrder} />
        </TabsContent>

        <TabsContent value="orders">
          <PackagingOrdersList />
        </TabsContent>
      </Tabs>
    </div>
  )
}
