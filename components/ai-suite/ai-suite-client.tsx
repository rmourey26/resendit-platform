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
import { Code, MessageSquare, Bot, ListChecks, Package, Sparkles } from "lucide-react"

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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col">
        <TabsList className="w-full flex flex-row justify-between mb-4 overflow-x-auto">
          <div className="hidden sm:flex space-x-2 mx-auto">
            <TabsTrigger value="chat" className="xs:text:xs text-sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              AI Chat
            </TabsTrigger>
            <TabsTrigger value="code" className="xs:text-xs md:text-sm">
              <Code className="h-4 w-4 mr-2" />
              Code Generator
            </TabsTrigger>
            <TabsTrigger value="supply-chain" className="xs:text-xs md:text-sm">
              <Package className="h-4 w-4 mr-2" />
              Supply Chain
            </TabsTrigger>
            <TabsTrigger value="models" className="xs:text-xs md:text-sm">
              <Sparkles className="h-4 w-4 mr-2" />
              AI Models
            </TabsTrigger>
            <TabsTrigger value="agents" className="xs:text-xs md:text-sm">
              <Bot className="h-4 w-4 mr-2" />
              AI Agents
            </TabsTrigger>
            <TabsTrigger value="workflows" className="xs:text-xs md:text-sm">
              <ListChecks className="h-4 w-4 mr-2" />
              Workflows
            </TabsTrigger>
          </div>
          <div className="sm:hidden flex justify-between items-center w-full px-1">
            <TabsTrigger value="chat" className="flex flex-col items-center justify-center p-2" title="AI Chat">
              <MessageSquare className="h-5 w-5" />
              <span className="text-[0.6rem] mt-1">Chat</span>
            </TabsTrigger>
            <TabsTrigger value="code" className="flex flex-col items-center justify-center p-2" title="Code Generator">
              <Code className="h-5 w-5" />
              <span className="text-[0.6rem] mt-1">Code</span>
            </TabsTrigger>
            <TabsTrigger
              value="supply-chain"
              className="flex flex-col items-center justify-center p-2"
              title="Supply Chain"
            >
              <Package className="h-5 w-5" />
              <span className="text-[0.6rem] mt-1">Supply</span>
            </TabsTrigger>
            <TabsTrigger value="models" className="flex flex-col items-center justify-center p-2" title="AI Models">
              <Sparkles className="h-5 w-5" />
              <span className="text-[0.6rem] mt-1">Models</span>
            </TabsTrigger>
            <TabsTrigger value="agents" className="flex flex-col items-center justify-center p-2" title="AI Agents">
              <Bot className="h-5 w-5" />
              <span className="text-[0.6rem] mt-1">Agents</span>
            </TabsTrigger>
            <TabsTrigger value="workflows" className="flex flex-col items-center justify-center p-2" title="Workflows">
              <ListChecks className="h-5 w-5" />
              <span className="text-[0.6rem] mt-1">Flows</span>
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
      </Tabs>
    </div>
  )
}
