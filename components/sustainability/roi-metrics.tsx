"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { SustainabilityMetrics } from "@/app/actions/sustainability-metrics"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { DollarSign, TrendingUp, BarChart2 } from "lucide-react"

interface ROIMetricsProps {
  metrics: SustainabilityMetrics
}

export function ROIMetrics({ metrics }: ROIMetricsProps) {
  // Calculate ROI breakdown data
  const roiData = [
    { name: "Packaging Costs", value: metrics.costSavings * 0.6 },
    { name: "Shipping Efficiency", value: metrics.costSavings * 0.25 },
    { name: "Reduced Damage", value: metrics.costSavings * 0.15 },
  ]

  // Calculate payback period (months)
  // Assumption: Initial investment of $10 per reusable package
  const initialInvestment = metrics.totalShipments * 10
  const monthlySavings = metrics.costSavings / 6 // Assuming 6 months of data
  const paybackPeriod = initialInvestment / monthlySavings

  // Calculate projected annual savings
  const projectedAnnualSavings = monthlySavings * 12

  // Calculate 5-year ROI
  const fiveYearSavings = projectedAnnualSavings * 5
  const fiveYearROI = (fiveYearSavings / initialInvestment) * 100

  // Colors for the pie chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"]

  return (
    <Card>
      <CardHeader>
        <CardTitle>ROI Analysis</CardTitle>
        <CardDescription>Financial impact of reusable packaging system</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-muted p-4 rounded-lg flex items-center">
            <DollarSign className="h-8 w-8 mr-3 text-green-500" />
            <div>
              <h4 className="text-sm font-medium">Current ROI</h4>
              <p className="text-2xl font-bold">{metrics.roiPercentage.toFixed(1)}%</p>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg flex items-center">
            <TrendingUp className="h-8 w-8 mr-3 text-blue-500" />
            <div>
              <h4 className="text-sm font-medium">Payback Period</h4>
              <p className="text-2xl font-bold">{paybackPeriod.toFixed(1)} months</p>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg flex items-center">
            <BarChart2 className="h-8 w-8 mr-3 text-purple-500" />
            <div>
              <h4 className="text-sm font-medium">5-Year ROI</h4>
              <p className="text-2xl font-bold">{fiveYearROI.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium mb-2">Cost Savings Breakdown</h4>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roiData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {roiData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Financial Projections</h4>
            <div className="space-y-4">
              <div className="bg-muted p-3 rounded-lg">
                <h5 className="text-xs font-medium text-muted-foreground">Current Cost Savings</h5>
                <p className="text-lg font-semibold">${metrics.costSavings.toFixed(2)}</p>
              </div>

              <div className="bg-muted p-3 rounded-lg">
                <h5 className="text-xs font-medium text-muted-foreground">Projected Annual Savings</h5>
                <p className="text-lg font-semibold">${projectedAnnualSavings.toFixed(2)}</p>
              </div>

              <div className="bg-muted p-3 rounded-lg">
                <h5 className="text-xs font-medium text-muted-foreground">5-Year Projected Savings</h5>
                <p className="text-lg font-semibold">${fiveYearSavings.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
