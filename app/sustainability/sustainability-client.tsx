"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Share2, FileText, RefreshCw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface SustainabilityClientProps {
  metrics: any
}

export function SustainabilityClient({ metrics }: SustainabilityClientProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const handleGenerateReport = () => {
    setIsGenerating(true)

    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false)
      toast({
        title: "Report Generated",
        description: "Your sustainability report has been generated successfully.",
      })
    }, 2000)
  }

  const handleShareReport = () => {
    toast({
      title: "Share Link Created",
      description: "A shareable link to your sustainability report has been copied to clipboard.",
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
        <Button variant="outline" onClick={handleGenerateReport} disabled={isGenerating}>
          {isGenerating ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </>
          )}
        </Button>
        <Button variant="outline" onClick={handleShareReport}>
          <Share2 className="mr-2 h-4 w-4" />
          Share Report
        </Button>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Download Data
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sustainability Reporting</CardTitle>
          <CardDescription>Generate and share sustainability reports</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="monthly">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
              <TabsTrigger value="annual">Annual</TabsTrigger>
            </TabsList>
            <TabsContent value="monthly" className="pt-4">
              <p className="text-sm text-muted-foreground mb-4">
                Generate a monthly sustainability report showing your environmental impact and ROI metrics.
              </p>
              <Button onClick={handleGenerateReport} disabled={isGenerating}>
                {isGenerating ? "Generating..." : "Generate Monthly Report"}
              </Button>
            </TabsContent>
            <TabsContent value="quarterly" className="pt-4">
              <p className="text-sm text-muted-foreground mb-4">
                Generate a quarterly sustainability report with detailed analysis and trends.
              </p>
              <Button onClick={handleGenerateReport} disabled={isGenerating}>
                {isGenerating ? "Generating..." : "Generate Quarterly Report"}
              </Button>
            </TabsContent>
            <TabsContent value="annual" className="pt-4">
              <p className="text-sm text-muted-foreground mb-4">
                Generate a comprehensive annual sustainability report for stakeholders and compliance.
              </p>
              <Button onClick={handleGenerateReport} disabled={isGenerating}>
                {isGenerating ? "Generating..." : "Generate Annual Report"}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
