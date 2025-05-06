"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { BarChart, LineChart, PieChart, BarChart2 } from "lucide-react"
import type { DataEmbedding } from "@/lib/types/database"

interface EmbeddingsAnalyticsProps {
  userId: string
  embeddings: DataEmbedding[]
}

export function EmbeddingsAnalytics({ userId, embeddings }: EmbeddingsAnalyticsProps) {
  const [selectedEmbedding, setSelectedEmbedding] = useState<string>("all")
  const [timeRange, setTimeRange] = useState<string>("30d")

  // Group embeddings by source type
  const sourceTypeCounts = embeddings.reduce((acc: Record<string, number>, embedding) => {
    const sourceType = embedding.source_type
    acc[sourceType] = (acc[sourceType] || 0) + 1
    return acc
  }, {})

  // Group embeddings by model
  const modelCounts = embeddings.reduce((acc: Record<string, number>, embedding) => {
    const model = embedding.embedding_model
    acc[model] = (acc[model] || 0) + 1
    return acc
  }, {})

  return (
    <Card>
      <CardHeader>
        <CardTitle>Embeddings Analytics</CardTitle>
        <CardDescription>Analyze your embeddings usage and performance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="embeddingSelect">Embedding Source</Label>
            <Select value={selectedEmbedding} onValueChange={setSelectedEmbedding}>
              <SelectTrigger id="embeddingSelect">
                <SelectValue placeholder="Select an embedding" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Embeddings</SelectItem>
                {embeddings.map((embedding) => (
                  <SelectItem key={embedding.id} value={embedding.id}>
                    {embedding.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeRange">Time Range</Label>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger id="timeRange">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="usage">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="usage" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              <span>Usage</span>
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              <span>Performance</span>
            </TabsTrigger>
            <TabsTrigger value="distribution" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              <span>Distribution</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="usage">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Embeddings by Source Type</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {Object.keys(sourceTypeCounts).length > 0 ? (
                    <div className="h-[200px] flex items-center justify-center">
                      <PieChart className="h-32 w-32 text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="h-[200px] flex items-center justify-center">
                      <p className="text-muted-foreground text-center">No data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Embeddings by Model</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {Object.keys(modelCounts).length > 0 ? (
                    <div className="h-[200px] flex items-center justify-center">
                      <BarChart className="h-32 w-32 text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="h-[200px] flex items-center justify-center">
                      <p className="text-muted-foreground text-center">No data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Retrieval Performance</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[300px] flex items-center justify-center">
                  <LineChart className="h-32 w-32 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="distribution">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Embedding Size Distribution</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[300px] flex items-center justify-center">
                  <BarChart2 className="h-32 w-32 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="p-4 bg-muted rounded-md">
          <h4 className="font-medium mb-2">Analytics Insights</h4>
          <p className="text-sm text-muted-foreground">
            {embeddings.length === 0
              ? "No embeddings data available yet. Create embeddings to see analytics."
              : `You have ${embeddings.length} embeddings across ${Object.keys(sourceTypeCounts).length} source types and ${Object.keys(modelCounts).length} models.`}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
