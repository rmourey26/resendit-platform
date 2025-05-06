"use client"

import type React from "react"

import { useState, useRef } from "react"
import { toast } from "@/components/ui/use-toast"
import { Upload, FileText } from "lucide-react"
import { createClientSupabaseClient } from "@/lib/supabase/client"

interface FileUploadProps {
  onUpload: (files: any[]) => void
}

export function FileUpload({ onUpload }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    const supabase = createClientSupabaseClient()
    const uploadedFiles = []

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const fileExt = file.name.split(".").pop()
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
        const filePath = `design-files/${fileName}`

        const { data, error } = await supabase.storage.from("design-files").upload(filePath, file)

        if (error) {
          throw error
        }

        // Get the public URL
        const { data: urlData } = supabase.storage.from("design-files").getPublicUrl(filePath)

        uploadedFiles.push({
          name: file.name,
          type: file.type,
          size: file.size,
          url: urlData.publicUrl,
          path: filePath,
        })
      }

      onUpload(uploadedFiles)
      toast({
        title: "Files uploaded",
        description: `Successfully uploaded ${uploadedFiles.length} files`,
      })
    } catch (error) {
      console.error("Error uploading file:", error)
      toast({
        title: "Upload failed",
        description: "There was an error uploading your files",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-700"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">PDF, PNG, JPG, Figma files (Max 10MB each)</p>
          </div>
          <input
            id="file-upload"
            ref={fileInputRef}
            type="file"
            className="hidden"
            multiple
            accept=".pdf,.png,.jpg,.jpeg,.fig"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>
      </div>
      {isUploading && (
        <div className="flex items-center justify-center">
          <FileText className="animate-pulse mr-2 h-4 w-4" />
          <span className="text-sm">Uploading files...</span>
        </div>
      )}
    </div>
  )
}
