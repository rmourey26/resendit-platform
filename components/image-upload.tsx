"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Loader2, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ImageUploadProps {
  id: string
  value: string
  onChange: (url: string) => void
  label: string
  helpText?: string
  bucketName?: string
  folderPath?: string
}

export function ImageUpload({
  id,
  value,
  onChange,
  label,
  helpText,
  bucketName = "avatars",
  folderPath = "",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("upload")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [bucketAvailable, setBucketAvailable] = useState(true)
  const [isCheckingBucket, setIsCheckingBucket] = useState(true)

  // Check if bucket exists on component mount
  useEffect(() => {
    const checkBucket = async () => {
      try {
        setIsCheckingBucket(true)

        // Try to initialize storage via API
        try {
          await fetch("/api/init-storage", { method: "GET" })
            .then((res) => res.json())
            .catch((err) => console.error("Error calling init-storage API:", err))
        } catch (error) {
          console.error("Error initializing storage:", error)
          // Continue anyway, as we'll check bucket access below
        }

        // Now check if we can access the bucket
        const supabase = createClient()
        const { error } = await supabase.storage.from(bucketName).list("", {
          limit: 1,
        })

        if (error) {
          console.error(`Error accessing bucket ${bucketName}:`, error)
          setBucketAvailable(false)
          if (error.message.includes("bucket") || error.message.includes("policy")) {
            setUploadError("Image upload is currently unavailable. Please use an image URL instead.")
            setActiveTab("url")
          }
        } else {
          setBucketAvailable(true)
          setUploadError(null)
        }
      } catch (error) {
        console.error("Error checking bucket:", error)
        setBucketAvailable(false)
        setUploadError("Image upload is currently unavailable. Please use an image URL instead.")
        setActiveTab("url")
      } finally {
        setIsCheckingBucket(false)
      }
    }

    checkBucket()
  }, [bucketName])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadError(null)

    try {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        throw new Error("Please upload an image file (JPEG, PNG, etc.)")
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("Image size should be less than 5MB")
      }

      if (!bucketAvailable) {
        throw new Error("Image upload is currently unavailable. Please use an image URL instead.")
      }

      const supabase = createClient()

      // Generate a unique file name
      const fileExt = file.name.split(".").pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      const filePath = folderPath ? `${folderPath}/${fileName}` : fileName

      // Upload the file to Supabase Storage
      const { data, error } = await supabase.storage.from(bucketName).upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      })

      if (error) {
        if (error.message.includes("bucket") || error.message.includes("policy")) {
          setBucketAvailable(false)
          setActiveTab("url")
          throw new Error(`Image upload is currently unavailable. Please use an image URL instead.`)
        }
        throw error
      }

      // Get the public URL
      const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(filePath)

      // Update the form with the new URL
      onChange(urlData.publicUrl)
    } catch (error) {
      console.error("Error uploading image:", error)
      setUploadError(error instanceof Error ? error.message : "Failed to upload image")
      // If there's a bucket error, switch to URL tab
      if (error instanceof Error && (error.message.includes("bucket") || error.message.includes("policy"))) {
        setActiveTab("url")
      }
    } finally {
      setIsUploading(false)
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()

    const files = e.dataTransfer.files
    if (files.length > 0 && fileInputRef.current) {
      fileInputRef.current.files = files
      handleFileChange({ target: { files } } as React.ChangeEvent<HTMLInputElement>)
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>

      {!bucketAvailable && !isCheckingBucket && (
        <Alert variant="warning" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Image upload is currently unavailable. Please use the Image URL option instead.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload" disabled={!bucketAvailable || isCheckingBucket}>
            Upload Image
          </TabsTrigger>
          <TabsTrigger value="url">Image URL</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          {isCheckingBucket ? (
            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg">
              <Loader2 className="h-6 w-6 animate-spin text-primary mb-2" />
              <p className="text-sm text-gray-500">Checking upload availability...</p>
            </div>
          ) : !bucketAvailable ? (
            <div className="text-sm text-amber-600 p-3 bg-amber-50 rounded-md border border-amber-200">
              Image upload is currently unavailable. Please use the Image URL tab instead.
            </div>
          ) : (
            <div
              className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {value && !isUploading ? (
                <div className="relative w-full h-40 mb-4">
                  <Image src={value || "/placeholder.svg"} alt={label} fill className="object-contain rounded-md" />
                </div>
              ) : (
                <Upload className="h-10 w-10 text-gray-400 mb-2" />
              )}

              {isUploading ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <p className="text-sm text-gray-500 mt-2">Uploading...</p>
                </div>
              ) : (
                <>
                  <p className="text-sm font-medium">{value ? "Change image" : "Click to upload or drag and drop"}</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG or GIF (max. 5MB)</p>
                </>
              )}

              <input
                ref={fileInputRef}
                id={`${id}-upload`}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={isUploading || !bucketAvailable}
              />
            </div>
          )}

          {uploadError && (
            <div className="text-sm text-red-500 p-2 bg-red-50 rounded-md">
              <p>{uploadError}</p>
              {(uploadError.includes("bucket") || uploadError.includes("unavailable")) && (
                <p className="mt-1">Please use the "Image URL" tab instead.</p>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="url">
          <Input id={id} value={value || ""} onChange={handleUrlChange} placeholder="https://example.com/image.jpg" />
          {helpText && <p className="text-xs text-gray-500 mt-1">{helpText}</p>}

          {value && (
            <div className="mt-4 relative w-full h-40">
              <Image
                src={value || "/placeholder.svg"}
                alt={label}
                fill
                className="object-contain rounded-md"
                onError={() => {
                  // Handle image load error
                  console.log("Error loading image from URL")
                }}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
