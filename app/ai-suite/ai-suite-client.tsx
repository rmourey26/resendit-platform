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
import { Database, MessageSquare, Code, Truck, Cpu, GitBranch, BarChart, Bot } from "lucide-react"
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
        className="w-full flex flex-col"
      >
        <TabsList className="w-full flex flex-row justify-between mb-4 overflow-x-auto">
           <div className="hidden sm:flex space-x-2 mx-auto">
          <TabsTrigger value="chat" className="xs:text:xs text-sm">
            <MessageSquare className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">AI Chat</span>
          </TabsTrigger>
          <TabsTrigger value="code" className="xs:text:xs text-sm">
            <Code className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Code Generator</span>
          </TabsTrigger>
          <TabsTrigger value="supply-chain" className="xs:text:xs text-sm">
            <Truck className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Supply Chain</span>
          </TabsTrigger>
          <TabsTrigger value="models" className="xs:text:xs text-sm">
            <Cpu className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">AI Models</span>
          </TabsTrigger>
          <TabsTrigger value="agents" className="xs:text:xs text-sm">
            <Bot className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">AI Agents</span>
          </TabsTrigger>
          <TabsTrigger value="workflows" className="xs:text:xs text-sm">
            <GitBranch className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Workflows</span>
          </TabsTrigger>
          <TabsTrigger value="embeddings" className="xs:text:xs text-sm">
            <Database className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Embeddings</span>
          </TabsTrigger>
          </div>
          <div className="sm:hidden flex justify-between items-center w-full px-1">
            <TabsTrigger value="chat" className="flex flex-col items-center justify-center p-2" title="AI Chat">
              <MessageSquare className="h-4 w-4" />
              <span className="text-[0.5rem] mt-1">Chat</span>
            </TabsTrigger>
            <TabsTrigger value="code" className="flex flex-col items-center justify-center p-2" title="Code Generator">
              <Code className="h-4 w-4" />
              <span className="text-[0.5rem] mt-1">Code</span>
            </TabsTrigger>
            <TabsTrigger
              value="supply-chain"
              className="flex flex-col items-center justify-center p-2"
              title="Supply Chain"
            >
              <Truck className="h-4 w-4" />
              <span className="text-[0.5rem] mt-1">Supply</span>
            </TabsTrigger>
            <TabsTrigger value="models" className="flex flex-col items-center justify-center p-2" title="AI Models">
              <Cpu className="h-4 w-4" />
              <span className="text-[0.5rem] mt-1">Models</span>
            </TabsTrigger>
            <TabsTrigger value="agents" className="flex flex-col items-center justify-center p-2" title="AI Agents">
              <Bot className="h-4 w-4" />
              <span className="text-[0.5rem] mt-1">Agents</span>
            </TabsTrigger>
            <TabsTrigger value="workflows" className="flex flex-col items-center justify-center p-2" title="Workflows">
              <GitBranch className="h-4 w-4" />
              <span className="text-[0.5rem] mt-1">Flows</span>
            </TabsTrigger>
             <TabsTrigger value="embeddings" className="flex flex-col items-center justify-center p-2" title="Embeddings">
              <Database className="h-4 w-4" />
              <span className="text-[0.5rem] mt-1">Embeddings</span>
            </TabsTrigger>
          </div>
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
