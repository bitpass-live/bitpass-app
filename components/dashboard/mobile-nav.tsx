"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, QrCode } from "lucide-react"

export function MobileNav() {
  const pathname = usePathname()

  // Skip rendering on login page
  if (pathname === "/") return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
      <div className="flex items-center justify-around bg-background border-t h-16 px-4">
        <Link
          href="/dashboard"
          className={`flex flex-col items-center justify-center w-20 h-full ${
            pathname === "/dashboard" ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <LayoutDashboard className="h-5 w-5" />
          <span className="text-xs mt-1">Dashboard</span>
        </Link>
        <Link
          href="/checkin"
          className={`flex flex-col items-center justify-center w-20 h-full ${
            pathname.startsWith("/checkin") ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <QrCode className="h-5 w-5" />
          <span className="text-xs mt-1">Check-in</span>
        </Link>
      </div>
    </div>
  )
}
