"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {

  const pathname = usePathname()

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link href="/" className={cn(
        pathname === "/"
          ? "text-sm font-medium transition-colors hover:text-primary"
          : "text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      )}>Home</Link>
      <Link href="/overview" className={cn(
        pathname === "/overview"
          ? "text-sm font-medium transition-colors hover:text-primary"
          : "text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      )}>Overview</Link>
    </nav >
  )
}
