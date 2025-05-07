import type { Metadata } from "next"
import { ArrowRight, Book, Code, Coins, Database, FileJson, Key, Lock, Server } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ApiEndpointExample } from "@/components/api-docs/api-endpoint-example"
import { ApiAuthExample } from "@/components/api-docs/api-auth-example"
import { ApiArchitecture } from "@/components/api-docs/api-architecture"
import { ApiValueProposition } from "@/components/api-docs/api-value-proposition"
import { ApiRoiCalculator } from "@/components/api-docs/api-roi-calculator"

export const metadata: Metadata = {
  title: "API Documentation | Resendit-It Platform",
  description: "Comprehensive API documentation for the Resendit-It platform",
}

export default function ApiDocsPage() {
  return (
    <div className="container mx-auto py-10 max-w-7xl">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="inline-block text-4xl font-extrabold tracking-tight lg:text-5xl">Resendit-It API</h1>
          <p className="text-xl text-muted-foreground">
            Comprehensive documentation for integrating with the Resendit-It platform
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-8 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Book className="h-4 w-4" />
              <span className="hidden md:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="reference" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              <span className="hidden md:inline">API Reference</span>
            </TabsTrigger>
            <TabsTrigger value="architecture" className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              <span className="hidden md:inline">Architecture</span>
            </TabsTrigger>
            <TabsTrigger value="value" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span className="hidden md:inline">Value Proposition</span>
            </TabsTrigger>
            <TabsTrigger value="roi" className="flex items-center gap-2">
              <Coins className="h-4 w-4" />
              <span className="hidden md:inline">ROI</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Getting Started</CardTitle>
                  <CardDescription>Learn how to integrate with the Resendit-It API</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>
                    Our RESTful API allows you to integrate Resendit-It's powerful features into your own applications.
                    Follow our step-by-step guide to get started quickly.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Read Guide
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Authentication</CardTitle>
                  <CardDescription>Secure your API requests</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>
                    Learn how to authenticate your API requests using JWT tokens or API keys. Our authentication system
                    ensures your data remains secure.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View Authentication
                    <Lock className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>API Keys</CardTitle>
                  <CardDescription>Manage your API access</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>
                    Generate and manage API keys for your applications. Control access levels and monitor usage from
                    your dashboard.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Manage Keys
                    <Key className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Webhooks</CardTitle>
                  <CardDescription>Real-time event notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>
                    Configure webhooks to receive real-time notifications about events in your Resendit-It account. Stay
                    updated on shipments, packaging orders, and more.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Configure Webhooks
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Rate Limits</CardTitle>
                  <CardDescription>Understanding API usage limits</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>
                    Learn about our rate limiting policies to ensure your applications run smoothly. Different API plans
                    offer various rate limits to suit your needs.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View Limits
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>SDKs & Libraries</CardTitle>
                  <CardDescription>Client libraries for popular languages</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>
                    Explore our official SDKs for JavaScript, Python, Ruby, PHP, and more. Simplify integration with our
                    pre-built libraries.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Browse SDKs
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-bold tracking-tight">API Features</h2>
              <p className="text-muted-foreground mt-2">
                The Resendit-It API provides access to all platform features through a consistent RESTful interface.
              </p>

              <div className="grid gap-4 mt-4 md:grid-cols-2">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg">Business Cards & NFTs</h3>
                  <ul className="mt-2 space-y-1 list-disc list-inside text-sm">
                    <li>Create and manage digital business cards</li>
                    <li>Mint NFTs from business cards</li>
                    <li>Manage public profiles and sharing</li>
                    <li>Track card analytics and engagement</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg">Shipping & Logistics</h3>
                  <ul className="mt-2 space-y-1 list-disc list-inside text-sm">
                    <li>Create and track shipments</li>
                    <li>Manage reusable packaging inventory</li>
                    <li>Access shipping analytics and reports</li>
                    <li>Monitor IoT sensor data for shipments</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg">Packaging Management</h3>
                  <ul className="mt-2 space-y-1 list-disc list-inside text-sm">
                    <li>Order custom sustainable packaging</li>
                    <li>Track packaging orders and status</li>
                    <li>Manage packaging designs and templates</li>
                    <li>Calculate packaging sustainability metrics</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg">AI Business Suite</h3>
                  <ul className="mt-2 space-y-1 list-disc list-inside text-sm">
                    <li>Create and manage AI agents</li>
                    <li>Execute AI workflows</li>
                    <li>Optimize supply chain operations</li>
                    <li>Generate embeddings and perform similarity searches</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg">CRM Integration</h3>
                  <ul className="mt-2 space-y-1 list-disc list-inside text-sm">
                    <li>Manage CRM connections</li>
                    <li>Sync contacts, deals, and activities</li>
                    <li>Access unified customer data</li>
                    <li>Automate CRM workflows</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg">Sustainability Metrics</h3>
                  <ul className="mt-2 space-y-1 list-disc list-inside text-sm">
                    <li>Calculate carbon footprint and savings</li>
                    <li>Track packaging reuse statistics</li>
                    <li>Generate sustainability reports</li>
                    <li>Monitor progress toward sustainability goals</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-bold tracking-tight">Getting Started</h2>
              <div className="mt-4 p-4 border rounded-lg bg-muted/50">
                <h3 className="font-semibold">1. Sign up for an API key</h3>
                <p className="text-sm mt-1">Create an account and generate your API key from the dashboard.</p>

                <h3 className="font-semibold mt-4">2. Install the SDK (optional)</h3>
                <div className="bg-black text-white p-2 rounded-md text-sm mt-1 font-mono">
                  npm install @resendit/api-client
                </div>

                <h3 className="font-semibold mt-4">3. Make your first API call</h3>
                <div className="bg-black text-white p-2 rounded-md text-sm mt-1 font-mono">
                  curl -X GET "https://api.resendit.app/v1/profile" \<br />
                  &nbsp;&nbsp;-H "Authorization: Bearer YOUR_API_KEY"
                </div>

                <h3 className="font-semibold mt-4">4. Explore the documentation</h3>
                <p className="text-sm mt-1">
                  Browse our comprehensive API reference to discover all available endpoints and features.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reference" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold tracking-tight">API Reference</h2>
              <Button variant="outline" className="flex items-center gap-2">
                <FileJson className="h-4 w-4" />
                Download OpenAPI Spec
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="md:col-span-1 space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg">Endpoints</h3>
                  <div className="mt-4 space-y-2">
                    <Button variant="ghost" className="w-full justify-start text-left">
                      Authentication
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-left">
                      Profile
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-left">
                      Business Cards
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-left">
                      NFTs
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-left">
                      Shipping
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-left">
                      Packages
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-left">
                      Packaging Orders
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-left">
                      AI Agents
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-left">
                      AI Workflows
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-left">
                      CRM
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-left">
                      Embeddings
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-left">
                      Sustainability
                    </Button>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <ApiEndpointExample />
                <div className="mt-4">
                  <ApiAuthExample />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="architecture" className="space-y-4">
            <ApiArchitecture />
          </TabsContent>

          <TabsContent value="value" className="space-y-4">
            <ApiValueProposition />
          </TabsContent>

          <TabsContent value="roi" className="space-y-4">
            <ApiRoiCalculator />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
