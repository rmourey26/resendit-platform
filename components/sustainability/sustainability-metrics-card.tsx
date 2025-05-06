"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Leaf, DollarSign, Recycle } from "lucide-react"
import type { SustainabilityMetrics } from "@/app/actions/sustainability-metrics"

interface SustainabilityMetricsCardProps {
  metrics: SustainabilityMetrics
}

export function SustainabilityMetricsCard({ metrics }: SustainabilityMetricsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sustainability Goals Progress</CardTitle>
        <CardDescription>Track your progress towards sustainability targets</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="carbon">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="carbon" className="flex items-center gap-2">
              <Leaf className="h-4 w-4" />
              <span className="hidden sm:inline">Carbon Reduction</span>
              <span className="sm:hidden">Carbon</span>
            </TabsTrigger>
            <TabsTrigger value="packaging" className="flex items-center gap-2">
              <Recycle className="h-4 w-4" />
              <span className="hidden sm:inline">Packaging Reuse</span>
              <span className="sm:hidden">Reuse</span>
            </TabsTrigger>
            <TabsTrigger value="cost" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">Cost Reduction</span>
              <span className="sm:hidden">Cost</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="carbon" className="space-y-4 pt-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-sm font-medium">Carbon Reduction</h4>
                <p className="text-xs text-muted-foreground">
                  {metrics.goalProgress.carbonReduction.current.toFixed(2)} kg CO₂ of{" "}
                  {metrics.goalProgress.carbonReduction.target.toFixed(2)} kg CO₂
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold">
                  {metrics.goalProgress.carbonReduction.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
            <Progress value={metrics.goalProgress.carbonReduction.percentage} className="h-2" />

            <div className="pt-2 grid grid-cols-2 gap-4">
              <div className="bg-muted p-3 rounded-lg">
                <h5 className="text-xs font-medium text-muted-foreground">Trees Equivalent</h5>
                <p className="text-lg font-semibold">{metrics.treesEquivalent.toFixed(1)}</p>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <h5 className="text-xs font-medium text-muted-foreground">Water Saved</h5>
                <p className="text-lg font-semibold">{(metrics.waterSaved / 1000).toFixed(1)} m³</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="packaging" className="space-y-4 pt-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-sm font-medium">Packaging Reuse</h4>
                <p className="text-xs text-muted-foreground">
                  {metrics.goalProgress.packagingReuse.current} reuses of {metrics.goalProgress.packagingReuse.target}{" "}
                  target
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold">{metrics.goalProgress.packagingReuse.percentage.toFixed(1)}%</span>
              </div>
            </div>
            <Progress value={metrics.goalProgress.packagingReuse.percentage} className="h-2" />

            <div className="pt-2 grid grid-cols-2 gap-4">
              <div className="bg-muted p-3 rounded-lg">
                <h5 className="text-xs font-medium text-muted-foreground">Plastic Reduced</h5>
                <p className="text-lg font-semibold">{metrics.plasticReduced.toFixed(1)} kg</p>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <h5 className="text-xs font-medium text-muted-foreground">Total Shipments</h5>
                <p className="text-lg font-semibold">{metrics.totalShipments}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="cost" className="space-y-4 pt-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-sm font-medium">Cost Reduction</h4>
                <p className="text-xs text-muted-foreground">
                  ${metrics.goalProgress.costReduction.current.toFixed(2)} of $
                  {metrics.goalProgress.costReduction.target.toFixed(2)} target
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold">{metrics.goalProgress.costReduction.percentage.toFixed(1)}%</span>
              </div>
            </div>
            <Progress value={metrics.goalProgress.costReduction.percentage} className="h-2" />

            <div className="pt-2 grid grid-cols-2 gap-4">
              <div className="bg-muted p-3 rounded-lg">
                <h5 className="text-xs font-medium text-muted-foreground">ROI</h5>
                <p className="text-lg font-semibold">{metrics.roiPercentage.toFixed(1)}%</p>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <h5 className="text-xs font-medium text-muted-foreground">Cost Savings</h5>
                <p className="text-lg font-semibold">${metrics.costSavings.toFixed(2)}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
