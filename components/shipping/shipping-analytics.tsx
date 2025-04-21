"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ShippingAnalytics, PackageUtilization } from "@/lib/types/database"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, LineChart, Line } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface ShippingAnalyticsProps {
  analyticsData: ShippingAnalytics[]
  utilizationData: PackageUtilization[]
}

export function ShippingAnalyticsComponent({ analyticsData, utilizationData }: ShippingAnalyticsProps) {
  // Prepare data for charts
  const deliveryTimeData = analyticsData
    .map((item) => ({
      day: item.shipping_day.split("T")[0],
      estimated: item.avg_estimated_delivery_days,
      actual: item.avg_actual_delivery_days,
    }))
    .slice(0, 7)
    .reverse()

  const costData = analyticsData
    .map((item) => ({
      day: item.shipping_day.split("T")[0],
      cost: item.avg_cost,
      shipments: item.total_shipments,
    }))
    .slice(0, 7)
    .reverse()

  const statusData = analyticsData
    .map((item) => ({
      day: item.shipping_day.split("T")[0],
      delivered: item.delivered_count,
      inTransit: item.in_transit_count,
      delayed: item.delayed_count,
    }))
    .slice(0, 7)
    .reverse()

  const topPackages = utilizationData
    .sort((a, b) => b.reuses_per_day - a.reuses_per_day)
    .slice(0, 5)
    .map((pkg) => ({
      name: pkg.name,
      reusesPerDay: pkg.reuses_per_day,
      totalReuses: pkg.reuse_count,
    }))

  return (
    <Tabs defaultValue="delivery-times" className="w-full">
      <TabsList className="grid grid-cols-4 mb-4">
        <TabsTrigger value="delivery-times">Delivery Times</TabsTrigger>
        <TabsTrigger value="costs">Shipping Costs</TabsTrigger>
        <TabsTrigger value="status">Shipment Status</TabsTrigger>
        <TabsTrigger value="packages">Package Utilization</TabsTrigger>
      </TabsList>

      <TabsContent value="delivery-times">
        <Card>
          <CardHeader>
            <CardTitle>Delivery Times</CardTitle>
            <CardDescription>Average estimated vs. actual delivery times (in days)</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                estimated: {
                  label: "Estimated Days",
                  color: "hsl(var(--chart-1))",
                },
                actual: {
                  label: "Actual Days",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={deliveryTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line type="monotone" dataKey="estimated" stroke="var(--color-estimated)" />
                  <Line type="monotone" dataKey="actual" stroke="var(--color-actual)" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="costs">
        <Card>
          <CardHeader>
            <CardTitle>Shipping Costs</CardTitle>
            <CardDescription>Average cost per shipment over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                cost: {
                  label: "Avg Cost ($)",
                  color: "hsl(var(--chart-1))",
                },
                shipments: {
                  label: "Total Shipments",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={costData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="cost" stroke="var(--color-cost)" />
                  <Line yAxisId="right" type="monotone" dataKey="shipments" stroke="var(--color-shipments)" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="status">
        <Card>
          <CardHeader>
            <CardTitle>Shipment Status</CardTitle>
            <CardDescription>Daily breakdown of shipment statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                delivered: {
                  label: "Delivered",
                  color: "hsl(var(--chart-1))",
                },
                inTransit: {
                  label: "In Transit",
                  color: "hsl(var(--chart-2))",
                },
                delayed: {
                  label: "Delayed",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="delivered" fill="var(--color-delivered)" />
                  <Bar dataKey="inTransit" fill="var(--color-inTransit)" />
                  <Bar dataKey="delayed" fill="var(--color-delayed)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="packages">
        <Card>
          <CardHeader>
            <CardTitle>Package Utilization</CardTitle>
            <CardDescription>Top 5 most utilized packages</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                reusesPerDay: {
                  label: "Reuses Per Day",
                  color: "hsl(var(--chart-1))",
                },
                totalReuses: {
                  label: "Total Reuses",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topPackages} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="reusesPerDay" fill="var(--color-reusesPerDay)" />
                  <Bar dataKey="totalReuses" fill="var(--color-totalReuses)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
