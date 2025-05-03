"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AIModelsList } from "@/components/ai-suite/ai-models-list"
import { AIAgentsList } from "@/components/ai-suite/ai-agents-list"
import { AIWorkflowsList } from "@/components/ai-suite/ai-workflows-list"
import { AIChat } from "@/components/ai-suite/ai-chat"
import { AICodeGenerator } from "@/components/ai-suite/ai-code-generator"
import { AISupplyChainOptimizer } from "@/components/ai-suite/ai-supply-chain-optimizer"
import type { AIModel } from "@/lib/types/database"
import { Database } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AISuiteClientProps {
  user: any
  aiModels: AIModel[]
  aiAgents: any[]
  workflows: any[]
}

export function AISuiteClient({ user, aiModels, aiAgents, workflows }: AISuiteClientProps) {
  const [activeTab, setActiveTab] = useState("chat")

  return (
    <div className="space-y-8">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        orientation="vertical"
        className="w-full flex items-start justify-center gap-2"
      >
        <TabsList className="grid grid-cols-1 h-auto w-fit p-0 divide-y border shrink-0">
          <TabsTrigger value="chat">AI Chat</TabsTrigger>
          <TabsTrigger value="code">Code Generator</TabsTrigger>
          <TabsTrigger value="supply-chain">Supply Chain</TabsTrigger>
          <TabsTrigger value="models">AI Models</TabsTrigger>
          <TabsTrigger value="agents">AI Agents</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="embeddings" className="xs:text-xs md:text-sm">
            <Database className="h-4 w-4 mr-2" />
            Embeddings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="py-4">
          <AIChat user={user} aiModels={aiModels} />
        </TabsContent>

        <TabsContent value="code" className="py-4">
          <AICodeGenerator user={user} aiModels={aiModels} />
        </TabsContent>

        <TabsContent value="supply-chain" className="py-4">
          <AISupplyChainOptimizer user={user} aiModels={aiModels} />
        </TabsContent>

        <TabsContent value="models" className="py-4">
          <AIModelsList models={aiModels} />
        </TabsContent>

        <TabsContent value="agents" className="py-4">
          <AIAgentsList agents={aiAgents} user={user} aiModels={aiModels} />
        </TabsContent>

        <TabsContent value="workflows" className="py-4">
          <AIWorkflowsList workflows={workflows} user={user} />
        </TabsContent>

        <TabsContent value="embeddings" className="py-4">
          <div className="flex flex-col items-center justify-center p-8 border rounded-lg">
            <Database className="h-12 w-12 mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Manage Embeddings</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Upload documents, manage embeddings, and configure RAG settings
            </p>
            <Button asChild>
              <a href="/ai-suite/embeddings">Open Embeddings Manager</a>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
