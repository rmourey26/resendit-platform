"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmbeddingsTable } from "@/components/embeddings/embeddings-table"
import { EmbeddingsUploader } from "@/components/embeddings/embeddings-uploader"
import { EmbeddingsSettings } from "@/components/embeddings/embeddings-settings"
import { RagConfiguration } from "@/components/embeddings/rag-configuration"
import { EmbeddingsAnalytics } from "@/components/embeddings/embeddings-analytics"
import { EmbeddingsJobs } from "@/components/embeddings/embeddings-jobs"
import { Card, CardContent } from "@/components/ui/card"
import { Database, Upload, Settings, Zap, BarChart, Clock } from "lucide-react"
import type { User } from "@supabase/supabase-js"
import type { DataEmbedding, AIModel, AIAgent, EmbeddingJob } from "@/lib/types/database"
import { SeedEmbeddingsButton } from "@/components/embeddings/seed-embeddings-button"

interface EmbeddingsClientProps {
  user: User
  embeddings: DataEmbedding[]
  aiModels: AIModel[]
  aiAgents: AIAgent[]
  embeddingJobs: EmbeddingJob[]
  userSettings: any
}

export function EmbeddingsClient({
  user,
  embeddings,
  aiModels,
  aiAgents,
  embeddingJobs,
  userSettings,
}: EmbeddingsClientProps) {
  const [activeTab, setActiveTab] = useState("embeddings")
  const [embeddingModels, setEmbeddingModels] = useState<AIModel[]>([])
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Filter models with embedding capabilities
  useEffect(() => {
    const filtered = aiModels.filter(
      (model) => Array.isArray(model.capabilities) && model.capabilities.includes("embedding"),
    )
    setEmbeddingModels(filtered)
  }, [aiModels])

  const refreshData = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-8">
            <TabsTrigger value="embeddings" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span className="hidden md:inline">Embeddings</span>
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <span className="hidden md:inline">Upload</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden md:inline">Settings</span>
            </TabsTrigger>
            <TabsTrigger value="rag" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span className="hidden md:inline">RAG Config</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              <span className="hidden md:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="jobs" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="hidden md:inline">Jobs</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="embeddings" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <EmbeddingsTable
                  embeddings={embeddings}
                  userId={user.id}
                  refreshData={refreshData}
                  key={`embeddings-table-${refreshTrigger}`}
                />
              </div>
              <div className="space-y-4">
                <SeedEmbeddingsButton userId={user.id} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="upload" className="mt-0">
            <EmbeddingsUploader
              userId={user.id}
              embeddingModels={embeddingModels}
              defaultSettings={userSettings}
              refreshData={refreshData}
            />
          </TabsContent>

          <TabsContent value="settings" className="mt-0">
            <EmbeddingsSettings
              userId={user.id}
              embeddingModels={embeddingModels}
              currentSettings={userSettings}
              refreshData={refreshData}
            />
          </TabsContent>

          <TabsContent value="rag" className="mt-0">
            <RagConfiguration userId={user.id} aiAgents={aiAgents} embeddings={embeddings} refreshData={refreshData} />
          </TabsContent>

          <TabsContent value="analytics" className="mt-0">
            <EmbeddingsAnalytics userId={user.id} embeddings={embeddings} />
          </TabsContent>

          <TabsContent value="jobs" className="mt-0">
            <EmbeddingsJobs jobs={embeddingJobs} userId={user.id} refreshData={refreshData} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
