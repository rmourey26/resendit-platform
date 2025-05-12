"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { signUp } from "../actions/auth"
import { Navbar } from "@/components/navbar"
import Link from "next/link"
import Image from "next/image"

export default function SignupSimplePageClient() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    company: "",
    job_title: "",
    website: "",
    linkedin_url: "",
    avatar_url: "",
    company_logo_url: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [previewAvatar, setPreviewAvatar] = useState(false)
  const [previewLogo, setPreviewLogo] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signUp({
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
        company: formData.company,
        job_title: formData.job_title,
        website: formData.website,
        linkedin_url: formData.linkedin_url,
        avatar_url: formData.avatar_url,
        company_logo_url: formData.company_logo_url,
      })

      if (result.success) {
        toast({
          title: "Account created",
          description: "Please check your email to verify your account.",
        })
        router.push("/login")
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      console.error("Error signing up:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
  

      <div className="flex flex-1 items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Create your account</CardTitle>
              <CardDescription>Enter your information to create your Resend-It profile.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    placeholder="John Doe"
                    required
                    value={formData.full_name}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>

                {/* Avatar URL Input */}
                <div className="space-y-2">
                  <Label htmlFor="avatar_url">Profile Avatar URL</Label>
                  <Input
                    id="avatar_url"
                    name="avatar_url"
                    placeholder="https://example.com/avatar.jpg"
                    value={formData.avatar_url}
                    onChange={handleChange}
                  />
                  <div className="flex items-center mt-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewAvatar((prev) => !prev)}
                      className="text-xs"
                    >
                      {previewAvatar ? "Hide Preview" : "Show Preview"}
                    </Button>
                    <p className="text-xs text-gray-500 ml-2">Enter a URL to your profile picture</p>
                  </div>

                  {previewAvatar && formData.avatar_url && (
                    <div className="mt-2 relative w-full h-40">
                      <Image
                        src={formData.avatar_url || "/placeholder.svg"}
                        alt="Avatar Preview"
                        fill
                        className="object-contain rounded-md"
                        onError={() => {
                          toast({
                            title: "Image Error",
                            description: "Could not load the avatar image. Please check the URL.",
                            variant: "destructive",
                          })
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input
                    id="company"
                    name="company"
                    placeholder="Acme Inc."
                    required
                    value={formData.company}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="job_title">Job Title</Label>
                  <Input
                    id="job_title"
                    name="job_title"
                    placeholder="Software Engineer"
                    value={formData.job_title || ""}
                    onChange={handleChange}
                  />
                </div>

                {/* Company Logo URL Input */}
                <div className="space-y-2">
                  <Label htmlFor="company_logo_url">Company Logo URL</Label>
                  <Input
                    id="company_logo_url"
                    name="company_logo_url"
                    placeholder="https://example.com/logo.png"
                    value={formData.company_logo_url}
                    onChange={handleChange}
                  />
                  <div className="flex items-center mt-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewLogo((prev) => !prev)}
                      className="text-xs"
                    >
                      {previewLogo ? "Hide Preview" : "Show Preview"}
                    </Button>
                    <p className="text-xs text-gray-500 ml-2">Enter a URL to your company logo</p>
                  </div>

                  {previewLogo && formData.company_logo_url && (
                    <div className="mt-2 relative w-full h-40">
                      <Image
                        src={formData.company_logo_url || "/placeholder.svg"}
                        alt="Company Logo Preview"
                        fill
                        className="object-contain rounded-md"
                        onError={() => {
                          toast({
                            title: "Image Error",
                            description: "Could not load the company logo image. Please check the URL.",
                            variant: "destructive",
                          })
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Company Website</Label>
                  <Input
                    id="website"
                    name="website"
                    placeholder="https://example.com"
                    required
                    value={formData.website}
                    onChange={handleChange}
                  />
                  <p className="text-xs text-gray-500">Include https:// or we'll add it for you</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                  <Input
                    id="linkedin_url"
                    name="linkedin_url"
                    placeholder="https://linkedin.com/in/yourprofile"
                    value={formData.linkedin_url || ""}
                    onChange={handleChange}
                  />
                  <p className="text-xs text-gray-500">Include https:// or we'll add it for you</p>
                </div>
              </CardContent>
              <CardFooter className="flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create account"}
                </Button>
                <div className="text-sm text-gray-500 space-y-2">
                  <p>
                    Already have an account?{" "}
                    <Link href="/login" className="text-blue-500 hover:underline">
                      Log in
                    </Link>
                  </p>
                  <p>
                    Want to try the full signup form?{" "}
                    <Link href="/signup" className="text-blue-500 hover:underline">
                      Standard signup
                    </Link>
                  </p>
                </div>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
