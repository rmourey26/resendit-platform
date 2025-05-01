"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface NavbarProps {
  showAuth?: boolean
  isLoggedIn?: boolean
}

export function Navbar({ showAuth = true, isLoggedIn = false }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const navItems = [
    { label: "Features", href: "/#features" },
    { label: "About", href: "/about" },
  ]

  const authItems = isLoggedIn
    ? [
        { label: "Dashboard", href: "/dashboard" },
        { label: "CRM", href: "/admin/crm" },
        { label: "AI Suite", href: "/ai-suite" },
        { label: "Profile", href: "/profile" },
        {
          label: "Shipping",
          href: "/shipping",
        },
      ]
    : [
        { label: "Login", href: "/login" },
        { label: "Sign Up", href: "/signup" },
      ]

  const allItems = showAuth ? [...navItems, ...authItems] : navItems

  return (
    <header className="bg-gradient-to-r from-black to-gray-900 border-b border-green-500/20">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image src="https://quantumone.b-cdn.net/resendit/resend-it-svg.svg" alt="Resend-It Logo" className="h-5 w-18" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-600">
          
          </span>
        </Link>

        {/* Mobile Menu Button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="lg:hidden text-white hover:bg-green-500/20">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full max-w-xs bg-black/95 border-green-500/30 text-white">
            <div className="flex flex-col h-full justify-center space-y-4 p-4">
              {allItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={closeMenu}
                  className="text-sm font-medium hover:text-green-400 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              {isLoggedIn && (
                <form action="/api/auth/signout" method="post">
                  <Button
                    variant="outline"
                    size="sm"
                    type="submit"
                    className="border-green-500 text-green-400 hover:bg-green-500/20"
                  >
                    Sign Out
                  </Button>
                </form>
              )}
            </div>
          </SheetContent>
        </Sheet>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex gap-6">
          {allItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-white hover:text-green-400 transition-colors"
            >
              {item.label}
            </Link>
          ))}
          {isLoggedIn && (
            <form action="/api/auth/signout" method="post">
              <Button
                variant="outline"
                size="sm"
                type="submit"
                className="border-green-500 text-green-400 hover:bg-green-500/20"
              >
                Sign Out
              </Button>
            </form>
          )}
        </nav>
      </div>
    </header>
  )
}
