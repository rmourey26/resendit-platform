"use client"
import Link from "next/link"
import type React from "react"

import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Database } from "lucide-react"

interface MainNavProps {
  items?: {
    title: string
    href: string
    description?: string
    icon?: React.ReactNode
    variant?: "default" | "ghost" | "link"
  }[]
}

export function MainNav({ items }: MainNavProps) {
  const pathname = usePathname()

  const navItems = [
    ...(items || []),
    {
      title: "Embeddings",
      href: "/ai-suite/embeddings",
      icon: <Database className="h-4 w-4" />,
      variant: "ghost",
    },
  ]

  return (
    <div className="hidden md:flex gap-6 md:gap-8">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: item.variant || "link", size: "sm" }),
            pathname === item.href
              ? "text-green-600 dark:text-green-400"
              : "text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400",
            "px-0",
          )}
        >
          {item.title}
        </Link>
      ))}
    </div>
  )
}
