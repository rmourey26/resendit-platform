"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Database, ShieldAlert } from "lucide-react"
import { seedShipmentEmbeddings } from "@/app/actions/seed-actions"
import { toast } from "@/components/ui/use-toast"

interface SeedEmbeddingsButtonProps {
  userId: string
}

export function SeedEmbeddingsButton({ userId }: SeedEmbeddingsButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [count, setCount] = useState(50)
  const [hasPermission, setHasPermission] = useState(false)

  // Check if the user has permission to seed embeddings
  useEffect(() => {
    async function checkPermission() {
      const result = await seedShipmentEmbeddings(userId, 0, true)
      setHasPermission(result.hasPermission)
    }

    checkPermission()
  }, [userId])

  const handleSeed = async () => {
    try {
      setIsLoading(true)
      const result = await seedShipmentEmbeddings(userId, count)

      if (result.success) {
        toast({
          title: "Seeding completed",
          description: `Successfully added ${result.count} shipment embeddings to your account.`,
        })
      } else {
        toast({
          title: "Seeding failed",
          description: result.message || "You don't have permission to seed embeddings.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Seeding failed",
        description: error.message || "An error occurred while seeding embeddings.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // If the user doesn't have permission, show a message
  if (!hasPermission) {
    return (
      <div className="flex flex-col space-y-4 p-4 border rounded-lg bg-muted/50">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-medium">Seed Shipment Embeddings</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          You don't have permission to seed embeddings. Please contact an administrator.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-medium">Seed Shipment Embeddings</h3>
      <p className="text-sm text-muted-foreground">
        Add mock shipment data embeddings to your account for testing purposes.
      </p>

      <div className="flex items-center space-x-2">
        <label htmlFor="count" className="text-sm">
          Number of records:
        </label>
        <input
          id="count"
          type="number"
          min="1"
          max="100"
          value={count}
          onChange={(e) => setCount(Number.parseInt(e.target.value) || 50)}
          className="w-20 px-2 py-1 border rounded"
        />
      </div>

      <Button onClick={handleSeed} disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Seeding...
          </>
        ) : (
          <>
            <Database className="mr-2 h-4 w-4" />
            Seed Embeddings
          </>
        )}
      </Button>
    </div>
  )
}
