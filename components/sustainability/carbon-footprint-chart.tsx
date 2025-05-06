"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { SustainabilityMetrics } from "@/app/actions/sustainability-metrics"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Bar, BarChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart2, LineChartIcon } from "lucide-react"

interface CarbonFootprintChartProps {
  metrics: SustainabilityMetrics
}

export function CarbonFootprintChart({ metrics }: CarbonFootprintChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Carbon Footprint Analysis</CardTitle>
        <CardDescription>Monthly carbon savings and packaging reuse trends</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="carbon">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="carbon" className="flex items-center gap-2">
              <LineChartIcon className="h-4 w-4" />
              <span>Carbon Savings</span>
            </TabsTrigger>
            <TabsTrigger value="packaging" className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4" />
              <span>Packaging Reuse</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="carbon">
            <ChartContainer
              config={{
                carbonSaved: {
                  label: "Carbon Saved (kg CO₂)",
                  color: "hsl(var(--chart-1))",
                },
                costSavings: {
                  label: "Cost Savings ($)",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="carbonSaved"
                    stroke="var(--color-carbonSaved)"
                    activeDot={{ r: 8 }}
                  />
                  <Line yAxisId="right" type="monotone" dataKey="costSavings" stroke="var(--color-costSavings)" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>

          <TabsContent value="packaging">
            <ChartContainer
              config={{
                packagingReused: {
                  label: "Packaging Reused",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="packagingReused" fill="var(--color-packagingReused)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
