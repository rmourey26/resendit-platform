"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { UserAvatar } from "@/components/user-avatar"
import { createClientSupabaseClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function SiteHeader() {
  const [user, setUser] = React.useState<User | null>(null)
  const [loading, setLoading] = React.useState(true)
  const supabase = createClientSupabaseClient()
  const pathname = usePathname()

  React.useEffect(() => {
    async function getUser() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error("Error getting user:", error)
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [supabase])

  const mainNavItems = [
    { title: "Home", href: "/" },
    { title: "Features", href: "/#features" },
    { title: "About", href: "/about" },
  ]

  const authNavItems = user
    ? [
        { title: "Dashboard", href: "/dashboard" },
        { title: "CRM", href: "/admin/crm" },
        { title: "AI Suite", href: "/ai-suite" },
        {
        title:
        "Packaging",
        href:
        "/packaging" },
        { title: "Shipping", href: "/shipping" },
        {
        title:
        "Sustainability",
        href:
        "/sustainability" }
      ]
    : [
        { title: "Login", href: "/login" },
        { title: "Sign Up", href: "/signup" },
      ]

  const allNavItems = [...mainNavItems, ...authNavItems]

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-green-500/20">
      <div className="container flex h-14 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image src="https://quantumone.b-cdn.net/resendit/resend-it-svg.svg" alt="Resend-It Logo" className="h-5 w-18 fill-currentColor" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-600">
            </span>
          </Link>
          <MainNav items={allNavItems} />
        </div>

        <div className="flex items-center gap-2">
          {!loading && user && (
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <UserAvatar user={user} className="h-9 w-9 border-2 border-green-500/50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-500 cursor-pointer">
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {!loading && !user && (
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "text-gray-500 hover:text-green-400 hover:bg-transparent",
                )}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "border-green-500 text-green-400 hover:bg-green-500/20",
                )}
              >
                Sign Up
              </Link>
            </div>
          )}
          <MobileNav items={allNavItems} />
        </div>
      </div>
    </header>
  )
}
