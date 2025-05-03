"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { uploadFileForEmbedding, createEmbeddingFromText } from "@/app/actions/embedding-actions"
import { toast } from "@/components/ui/use-toast"
import { Upload, Loader2, FileText, File, X, Code, Database, Plus } from "lucide-react"
import type { AIModel } from "@/lib/types/database"

interface EmbeddingsUploaderProps {
  userId: string
  embeddingModels: AIModel[]
  defaultSettings: any
  refreshData: () => void
}

export function EmbeddingsUploader({ userId, embeddingModels, defaultSettings, refreshData }: EmbeddingsUploaderProps) {
  const [activeTab, setActiveTab] = useState("file")
  const [isUploading, setIsUploading] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [form, setForm] = useState({
    name: "",
    description: "",
    modelId: embeddingModels.length > 0 ? embeddingModels[0].id : "",
    chunkSize: defaultSettings?.defaultChunkSize || 1000,
    chunkOverlap: defaultSettings?.defaultChunkOverlap || 200,
    textContent: "",
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmitFiles = async (e: React.FormEvent) => {
    e.preventDefault()

    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one file to upload.",
        variant: "destructive",
      })
      return
    }

    if (!form.name) {
      toast({
        title: "Name required",
        description: "Please provide a name for your embeddings.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      files.forEach((file) => {
        formData.append("files", file)
      })

      formData.append("name", form.name)
      formData.append("description", form.description)
      formData.append("modelId", form.modelId)
      formData.append("chunkSize", form.chunkSize.toString())
      formData.append("chunkOverlap", form.chunkOverlap.toString())
      formData.append("userId", userId)

      await uploadFileForEmbedding(formData)

      toast({
        title: "Files uploaded successfully",
        description: "Your files have been uploaded and are being processed for embeddings.",
      })

      // Reset form
      setFiles([])
      setForm({
        ...form,
        name: "",
        description: "",
      })

      refreshData()
    } catch (error) {
      console.error("Error uploading files:", error)
      toast({
        title: "Upload failed",
        description: "There was an error uploading your files. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmitText = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.textContent.trim()) {
      toast({
        title: "No text provided",
        description: "Please enter some text to create embeddings.",
        variant: "destructive",
      })
      return
    }

    if (!form.name) {
      toast({
        title: "Name required",
        description: "Please provide a name for your embeddings.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      await createEmbeddingFromText({
        name: form.name,
        description: form.description,
        modelId: form.modelId,
        chunkSize: form.chunkSize,
        chunkOverlap: form.chunkOverlap,
        textContent: form.textContent,
        userId,
      })

      toast({
        title: "Text processed successfully",
        description: "Your text has been processed and embeddings have been created.",
      })

      // Reset form
      setForm({
        ...form,
        name: "",
        description: "",
        textContent: "",
      })

      refreshData()
    } catch (error) {
      console.error("Error processing text:", error)
      toast({
        title: "Processing failed",
        description: "There was an error processing your text. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const getFileIcon = (file: File) => {
    const extension = file.name.split(".").pop()?.toLowerCase()

    switch (extension) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />
      case "doc":
      case "docx":
        return <FileText className="h-5 w-5 text-blue-500" />
      case "txt":
        return <FileText className="h-5 w-5 text-gray-500" />
      case "csv":
      case "xlsx":
      case "xls":
        return <FileText className="h-5 w-5 text-green-500" />
      case "json":
        return <Code className="h-5 w-5 text-yellow-500" />
      case "md":
        return <FileText className="h-5 w-5 text-purple-500" />
      default:
        return <File className="h-5 w-5" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Embeddings</CardTitle>
        <CardDescription>Upload files or enter text to create embeddings for use with RAG</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="file" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>From Files</span>
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              <span>From Text</span>
            </TabsTrigger>
            <TabsTrigger value="database" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span>From Database</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="file">
            <form onSubmit={handleSubmitFiles} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="My Document Embeddings"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Embedding Model</Label>
                  <Select value={form.modelId} onValueChange={(value) => setForm({ ...form, modelId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                      {embeddingModels.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Description of these embeddings"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="chunkSize">Chunk Size: {form.chunkSize}</Label>
                  </div>
                  <Slider
                    id="chunkSize"
                    min={100}
                    max={2000}
                    step={50}
                    value={[form.chunkSize]}
                    onValueChange={(value) => setForm({ ...form, chunkSize: value[0] })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Number of characters per chunk. Smaller chunks are more precise but may lose context.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="chunkOverlap">Chunk Overlap: {form.chunkOverlap}</Label>
                  </div>
                  <Slider
                    id="chunkOverlap"
                    min={0}
                    max={500}
                    step={10}
                    value={[form.chunkOverlap]}
                    onValueChange={(value) => setForm({ ...form, chunkOverlap: value[0] })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Number of characters to overlap between chunks to maintain context.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="files">Upload Files</Label>
                <div
                  className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Input
                    id="files"
                    type="file"
                    multiple
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.xls,.json,.md"
                  />
                  <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground text-center">
                    Click to upload or drag and drop files here
                  </p>
                  <p className="text-xs text-muted-foreground text-center mt-1">
                    Supports PDF, DOC, DOCX, TXT, CSV, XLSX, XLS, JSON, MD
                  </p>
                </div>
              </div>

              {files.length > 0 && (
                <div className="space-y-2">
                  <Label>Selected Files ({files.length})</Label>
                  <div className="border rounded-md divide-y">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2">
                        <div className="flex items-center space-x-2">
                          {getFileIcon(file)}
                          <span className="text-sm truncate max-w-[300px]">{file.name}</span>
                          <span className="text-xs text-muted-foreground">({(file.size / 1024).toFixed(1)} KB)</span>
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeFile(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isUploading || files.length === 0}>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>Upload and Process</>
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="text">
            <form onSubmit={handleSubmitText} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="text-name">Name</Label>
                  <Input
                    id="text-name"
                    placeholder="My Text Embeddings"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="text-model">Embedding Model</Label>
                  <Select value={form.modelId} onValueChange={(value) => setForm({ ...form, modelId: value })}>
                    <SelectTrigger id="text-model">
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                      {embeddingModels.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="text-description">Description (Optional)</Label>
                <Textarea
                  id="text-description"
                  placeholder="Description of these embeddings"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="text-chunkSize">Chunk Size: {form.chunkSize}</Label>
                  </div>
                  <Slider
                    id="text-chunkSize"
                    min={100}
                    max={2000}
                    step={50}
                    value={[form.chunkSize]}
                    onValueChange={(value) => setForm({ ...form, chunkSize: value[0] })}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="text-chunkOverlap">Chunk Overlap: {form.chunkOverlap}</Label>
                  </div>
                  <Slider
                    id="text-chunkOverlap"
                    min={0}
                    max={500}
                    step={10}
                    value={[form.chunkOverlap]}
                    onValueChange={(value) => setForm({ ...form, chunkOverlap: value[0] })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="textContent">Text Content</Label>
                <Textarea
                  id="textContent"
                  placeholder="Enter the text you want to create embeddings from"
                  value={form.textContent}
                  onChange={(e) => setForm({ ...form, textContent: e.target.value })}
                  className="min-h-[200px]"
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isUploading || !form.textContent.trim()}>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>Process Text</>
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="database">
            <div className="flex flex-col items-center justify-center py-10">
              <Database className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center mb-4">Database embedding functionality coming soon</p>
              <Button variant="outline" disabled>
                <Plus className="mr-2 h-4 w-4" />
                Connect Database
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
