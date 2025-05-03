"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShippingTable } from "@/components/shipping/shipping-table"
import { PackagesTable } from "@/components/shipping/packages-table"
import { ShippingAnalyticsComponent } from "@/components/shipping/shipping-analytics"
import { NewShippingForm } from "@/components/shipping/new-shipping-form"
import { AIEnhancedShippingDashboard } from "@/components/shipping/ai-enhanced-shipping-dashboard"
import {
  getShippingData,
  getReusablePackages,
  getShippingAnalytics,
  getPackageUtilization,
} from "@/app/actions/shipping"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Truck, CheckCircle, AlertCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export default function ShippingPageClient() {
  const [shippingData, setShippingData] = useState([])
  const [packagesData, setPackagesData] = useState([])
  const [analyticsData, setAnalyticsData] = useState([])
  const [utilizationData, setUtilizationData] = useState([])
  const [availablePackages, setAvailablePackages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeView, setActiveView] = useState("dashboard") // "dashboard", "classic", "ai"
  const { toast } = useToast()

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        const shippingResult = await getShippingData()
        const packagesResult = await getReusablePackages()
        const analyticsResult = await getShippingAnalytics()
        const utilizationResult = await getPackageUtilization()

        setShippingData(shippingResult.success ? shippingResult.data : [])
        setPackagesData(packagesResult.success ? packagesResult.data : [])
        setAnalyticsData(analyticsResult.success ? analyticsResult.data : [])
        setUtilizationData(utilizationResult.success ? utilizationResult.data : [])

        // Filter available packages for the new shipping form
        setAvailablePackages(
          packagesResult.success ? packagesResult.data.filter((pkg) => pkg.status === "available") : [],
        )
      } catch (error) {
        console.error("Error loading data:", error)
        toast({
          title: "Error",
          description: "Failed to load shipping data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [toast])

  // Calculate summary statistics
  const totalShipments = shippingData.length
  const inTransitShipments = shippingData.filter((s: any) => s.status === "in_transit").length
  const deliveredShipments = shippingData.filter((s: any) => s.status === "delivered").length
  const delayedShipments = shippingData.filter((s: any) => s.status === "delayed").length

  const totalPackages = packagesData.length
  const availablePackagesCount = packagesData.filter((p: any) => p.status === "available").length
  const inUsePackagesCount = packagesData.filter((p: any) => p.status === "in_use").length
  const damagedPackagesCount = packagesData.filter((p: any) => p.status === "damaged").length

  const renderClassicView = () => (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Shipping & Packages</h1>
        <NewShippingForm availablePackages={availablePackages} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Shipments</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalShipments}</div>
            <p className="text-xs text-muted-foreground">
              {inTransitShipments} in transit, {deliveredShipments} delivered
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Packages</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPackages}</div>
            <p className="text-xs text-muted-foreground">
              {availablePackagesCount} available, {inUsePackagesCount} in use
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalShipments > 0 ? Math.round((deliveredShipments / totalShipments) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {deliveredShipments} out of {totalShipments} shipments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delayed Rate</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalShipments > 0 ? Math.round((delayedShipments / totalShipments) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {delayedShipments} out of {totalShipments} shipments
            </p>
          </CardContent>
        </Card>
      </div>

      <ShippingAnalyticsComponent analyticsData={analyticsData} utilizationData={utilizationData} />

      <Tabs defaultValue="shipments" className="w-full">
        <TabsList className="relative">
          <div className="hidden sm:flex space-x-2">
            <TabsTrigger value="shipments" className="xs:text:xs text-sm">
              Shipments
            </TabsTrigger>
            <TabsTrigger value="packages" className="xs:text-xs md:text-sm">
              Reusable Packages
            </TabsTrigger>
          </div>
          <div className="sm:hidden flex justify-between items-center">
            <TabsTrigger value="shipments" className="flex flex-col items-center justify-center">
              <Truck className="h-5 w-5" />
              <span className="text-[0.7rem]">Shipments</span>
            </TabsTrigger>
            <TabsTrigger value="packages" className="flex flex-col items-center justify-center">
              <Package className="h-5 w-5" />
              <span className="text-[0.7rem]">Packages</span>
            </TabsTrigger>
          </div>
        </TabsList>
        <TabsContent value="shipments">
          {isLoading ? <div>Loading...</div> : <ShippingTable shippingData={shippingData} />}
        </TabsContent>
        <TabsContent value="packages">
          {isLoading ? <div>Loading...</div> : <PackagesTable packagesData={packagesData} />}
        </TabsContent>
      </Tabs>
    </>
  )

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* View Selector */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <Button
            variant={activeView === "dashboard" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveView("dashboard")}
            className="flex items-center gap-1"
          >
            <Sparkles className="h-4 w-4" />
            <span>AI Dashboard</span>
          </Button>
          <Button
            variant={activeView === "classic" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveView("classic")}
          >
            Classic View
          </Button>
        </div>
        {activeView === "classic" && <NewShippingForm availablePackages={availablePackages} />}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Loading shipping data...</span>
        </div>
      ) : activeView === "dashboard" ? (
        <AIEnhancedShippingDashboard />
      ) : (
        renderClassicView()
      )}
    </div>
  )
}
