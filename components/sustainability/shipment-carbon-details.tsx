"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getShipmentCarbonFootprint } from "@/app/actions/sustainability-metrics"
import { Loader2, Search, Truck, Package, Leaf } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function ShipmentCarbonDetails() {
  const [shipmentId, setShipmentId] = useState("")
  const [loading, setLoading] = useState(false)
  const [carbonData, setCarbonData] = useState<any>(null)
  const { toast } = useToast()

  const handleSearch = async () => {
    if (!shipmentId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a shipment ID",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const result = await getShipmentCarbonFootprint(shipmentId)

      if (result.success) {
        setCarbonData(result.data)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to fetch carbon footprint data",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching carbon footprint:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipment Carbon Footprint</CardTitle>
        <CardDescription>Analyze the carbon impact of individual shipments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex space-x-2">
            <div className="flex-1">
              <Label htmlFor="shipmentId" className="sr-only">
                Shipment ID
              </Label>
              <Input
                id="shipmentId"
                placeholder="Enter shipment ID"
                value={shipmentId}
                onChange={(e) => setShipmentId(e.target.value)}
              />
            </div>
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </>
              )}
            </Button>
          </div>

          {carbonData && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-muted p-4 rounded-lg flex items-center">
                  <Truck className="h-8 w-8 mr-3 text-blue-500" />
                  <div>
                    <h4 className="text-sm font-medium">Transport Mode</h4>
                    <p className="text-lg font-semibold">{carbonData.transportMode}</p>
                    <p className="text-xs text-muted-foreground">{carbonData.distance.toFixed(0)} km distance</p>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg flex items-center">
                  <Package className="h-8 w-8 mr-3 text-purple-500" />
                  <div>
                    <h4 className="text-sm font-medium">Packaging Type</h4>
                    <p className="text-lg font-semibold">{carbonData.packagingType}</p>
                    <p className="text-xs text-muted-foreground">{carbonData.weight.toFixed(1)} kg weight</p>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg flex items-center">
                  <Leaf className="h-8 w-8 mr-3 text-green-500" />
                  <div>
                    <h4 className="text-sm font-medium">Carbon Footprint</h4>
                    <p className="text-lg font-semibold">{carbonData.totalCarbonFootprint.toFixed(2)} kg CO₂</p>
                    <p className="text-xs text-muted-foreground">
                      {carbonData.reusablePackagingSavings > 0
                        ? `Saved ${carbonData.reusablePackagingSavings.toFixed(2)} kg CO₂`
                        : "No packaging savings"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="text-sm font-medium mb-2">Carbon Impact Breakdown</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Base Carbon Footprint:</span>
                    <span className="text-sm font-medium">{carbonData.carbonFootprint.toFixed(2)} kg CO₂</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Reusable Packaging Savings:</span>
                    <span className="text-sm font-medium text-green-500">
                      -{carbonData.reusablePackagingSavings.toFixed(2)} kg CO₂
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="text-sm font-medium">Net Carbon Footprint:</span>
                    <span className="text-sm font-bold">{carbonData.totalCarbonFootprint.toFixed(2)} kg CO₂</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-900">
                <h4 className="text-sm font-medium text-green-800 dark:text-green-400 mb-2">Environmental Impact</h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  {carbonData.reusablePackagingSavings > 0
                    ? `By using reusable packaging, this shipment reduced carbon emissions by ${((carbonData.reusablePackagingSavings / carbonData.carbonFootprint) * 100).toFixed(1)}%. This is equivalent to planting ${((carbonData.reusablePackagingSavings / 25) * 100).toFixed(2)} trees.`
                    : "This shipment could have reduced its carbon footprint by up to 30% by using reusable packaging."}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
