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
import { Database, MessageSquare, Code, Truck, Cpu, GitBranch, BarChart } from "lucide-react"
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
        orientation="horizontal"
        className="w-full flex flex-col md:flex-row items-start justify-center gap-2"
      >
        <TabsList className="grid grid-cols-1 h-auto w-fit p-0 divide-y border shrink-0">
          <TabsTrigger value="chat" className="flex items-center justify-center">
            <MessageSquare className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">AI Chat</span>
          </TabsTrigger>
          <TabsTrigger value="code" className="flex items-center justify-center">
            <Code className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Code Generator</span>
          </TabsTrigger>
          <TabsTrigger value="supply-chain" className="flex items-center justify-center">
            <Truck className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Supply Chain</span>
          </TabsTrigger>
          <TabsTrigger value="models" className="flex items-center justify-center">
            <Cpu className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">AI Models</span>
          </TabsTrigger>
          <TabsTrigger value="agents" className="flex items-center justify-center">
            <BarChart className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">AI Agents</span>
          </TabsTrigger>
          <TabsTrigger value="workflows" className="flex items-center justify-center">
            <GitBranch className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Workflows</span>
          </TabsTrigger>
          <TabsTrigger value="embeddings" className="flex items-center justify-center">
            <Database className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Embeddings</span>
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
