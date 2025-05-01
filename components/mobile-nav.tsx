"use client"

import * as React from "react"
import Link, { LinkProps } from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"

interface MobileNavProps {
  items?: {
    title: string
    href: string
    description?: string
  }[]
}

export function MobileNav({ items }: MobileNavProps) {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="md:hidden
          mr-0
           px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <Menu color="#fff" className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-xs bg-black/95 border-green-500/30 text-white">
        <nav className="flex flex-col gap-4 mt-8">
          {items?.map((item) => (
            <SheetClose asChild key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-green-400",
                  pathname === item.href ? "text-green-400" : "text-gray-200",
                )}
              >
                {item.title}
              </Link>
            </SheetClose>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
