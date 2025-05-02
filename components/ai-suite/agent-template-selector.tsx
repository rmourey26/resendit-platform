"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { agentTemplates, type AgentTemplate } from "@/lib/ai/agent-templates"
import { Bot, BarChart, Network, Blocks, Truck, Code, ImageIcon, Briefcase } from "lucide-react"

interface AgentTemplateSelectorProps {
  onSelect: (template: AgentTemplate) => void
  onCancel: () => void
}

export function AgentTemplateSelector({ onSelect, onCancel }: AgentTemplateSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<string>("general")

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "bot":
        return <Bot className="h-8 w-8 mb-2" />
      case "bar-chart":
        return <BarChart className="h-8 w-8 mb-2" />
      case "network":
        return <Network className="h-8 w-8 mb-2" />
      case "blocks":
        return <Blocks className="h-8 w-8 mb-2" />
      case "truck":
        return <Truck className="h-8 w-8 mb-2" />
      case "code":
        return <Code className="h-8 w-8 mb-2" />
      case "image":
        return <ImageIcon className="h-8 w-8 mb-2" />
      case "briefcase":
        return <Briefcase className="h-8 w-8 mb-2" />
      default:
        return <Bot className="h-8 w-8 mb-2" />
    }
  }

  const categories = [
    { id: "general", name: "General" },
    { id: "data", name: "Data Analysis" },
    { id: "blockchain", name: "Blockchain" },
    { id: "supply-chain", name: "Supply Chain" },
    { id: "developer", name: "Developer" },
  ]

  const filteredTemplates = agentTemplates.filter((template) => template.category === activeCategory)

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Select an Agent Template</h2>
        <p className="text-muted-foreground">Choose a preconfigured AI agent to get started quickly</p>
      </div>

      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid grid-cols-5 mb-6">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <Card
                  key={template.id}
                  className="cursor-pointer hover:border-primary transition-colors"
                  onClick={() => onSelect(template)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex flex-col items-center text-center">
                      {getIconComponent(template.icon)}
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription className="mt-1">{template.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground line-clamp-3">
                      {template.systemPrompt.substring(0, 120)}...
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex flex-wrap gap-2">
                      {template.tools.map((tool) => (
                        <Badge key={tool} variant="outline">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="flex justify-end">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  )
}
