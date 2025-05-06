import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getSustainabilityMetrics } from "@/app/actions/sustainability-metrics"
import { SustainabilityMetricsCard } from "@/components/sustainability/sustainability-metrics-card"
import { CarbonFootprintChart } from "@/components/sustainability/carbon-footprint-chart"
import { ROIMetrics } from "@/components/sustainability/roi-metrics"
import { ShipmentCarbonDetails } from "@/components/sustainability/shipment-carbon-details"
import { SustainabilityClient } from "./sustainability-client"
import { Leaf, TrendingUp, BarChart2, Recycle } from "lucide-react"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function SustainabilityDashboard() {
  const supabase = createServerSupabaseClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If no user, redirect to login
  if (!user) {
    redirect("/login")
  }

  // Get sustainability metrics
  const { success, data: metrics, error } = await getSustainabilityMetrics()

  if (!success || !metrics) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold mb-8">Sustainability & ROI Dashboard</h1>
          <div className="bg-red-100 p-4 rounded-md">
            <p className="text-red-800">
              An error occurred while loading sustainability metrics: {error || "Unknown error"}
            </p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Sustainability & ROI Dashboard</h1>
            <p className="text-muted-foreground">Track your environmental impact and return on investment</p>
          </div>
          <SustainabilityClient metrics={metrics} />
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white dark:bg-gray-950 p-4 rounded-lg border shadow-sm flex items-center">
            <div className="mr-4 bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
              <Leaf className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Carbon Saved</p>
              <h3 className="text-2xl font-bold">{metrics.carbonSaved.toFixed(1)} kg</h3>
              <p className="text-xs text-muted-foreground">CO₂ equivalent</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-950 p-4 rounded-lg border shadow-sm flex items-center">
            <div className="mr-4 bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
              <Recycle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Packaging Reused</p>
              <h3 className="text-2xl font-bold">{metrics.packagingReused}</h3>
              <p className="text-xs text-muted-foreground">Total reuses</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-950 p-4 rounded-lg border shadow-sm flex items-center">
            <div className="mr-4 bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">ROI</p>
              <h3 className="text-2xl font-bold">{metrics.roiPercentage.toFixed(1)}%</h3>
              <p className="text-xs text-muted-foreground">Return on investment</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-950 p-4 rounded-lg border shadow-sm flex items-center">
            <div className="mr-4 bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full">
              <BarChart2 className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Cost Savings</p>
              <h3 className="text-2xl font-bold">${metrics.costSavings.toFixed(2)}</h3>
              <p className="text-xs text-muted-foreground">Total savings</p>
            </div>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 mb-6">
          <SustainabilityMetricsCard metrics={metrics} />
          <CarbonFootprintChart metrics={metrics} />
        </div>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 mb-6">
          <ROIMetrics metrics={metrics} />
          <ShipmentCarbonDetails />
        </div>

        {/* Environmental Impact Summary */}
        <div className="bg-green-50 dark:bg-green-950/20 p-6 rounded-lg border border-green-200 dark:border-green-900 mb-6">
          <h2 className="text-xl font-bold text-green-800 dark:text-green-400 mb-2">Environmental Impact Summary</h2>
          <p className="text-green-700 dark:text-green-300 mb-4">
            Your reusable packaging program has made a significant positive impact on the environment.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-green-700 dark:text-green-400">Carbon Reduction</h3>
              <p className="text-lg font-bold">{metrics.carbonSaved.toFixed(1)} kg CO₂</p>
              <p className="text-xs text-muted-foreground">
                Equivalent to {metrics.treesEquivalent.toFixed(1)} trees planted
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-green-700 dark:text-green-400">Water Conservation</h3>
              <p className="text-lg font-bold">{(metrics.waterSaved / 1000).toFixed(1)} m³</p>
              <p className="text-xs text-muted-foreground">Saved through reusable packaging</p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-green-700 dark:text-green-400">Plastic Waste Reduction</h3>
              <p className="text-lg font-bold">{metrics.plasticReduced.toFixed(1)} kg</p>
              <p className="text-xs text-muted-foreground">Plastic kept out of landfills</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
