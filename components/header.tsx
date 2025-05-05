"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth-provider"
import { LogOut, User, ChevronDown, LayoutDashboard, QrCode } from "lucide-react"
import { NotPassLogo } from "@/components/notpass-logo"

export function Header() {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  // Skip rendering on login page
  if (pathname === "/login") return null

  // Simplified header for home page (checkout)
  if (pathname === "/" || pathname === "/checkin") {
    return (
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center">
            <NotPassLogo className="text-xl" />
          </div>

          <div className="flex items-center">
            {user ? (
              <Button asChild variant="outline">
                <Link href="/checkin">
                  <QrCode className="mr-2 h-4 w-4" />
                  <span>Check-in</span>
                </Link>
              </Button>
            ) : (
              <Button asChild variant="outline">
                <Link href="/login">
                  <User className="mr-2 h-4 w-4" />
                  <span>Login</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>
    )
  }

  // Full header for other pages
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between py-4">
        <Link href="/" className="flex items-center">
          <NotPassLogo className="text-xl" />
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className={`flex items-center gap-2 ${pathname === "/" ? "font-medium" : ""}`}>
            <LayoutDashboard className="h-4 w-4" />
            <span>Evento</span>
          </Link>
          <Link
            href="/checkin"
            className={`flex items-center gap-2 ${pathname.startsWith("/checkin") ? "font-medium" : ""}`}
          >
            <QrCode className="h-4 w-4" />
            <span>Check-in</span>
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {user?.name || user?.email || (user?.pubkey && `${user.pubkey.substring(0, 8)}...`) || "User"}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {user?.authMethod === "email"
                    ? "Email Account"
                    : user?.authMethod === "nostr"
                      ? "Nostr Account"
                      : "Demo Account"}
                </DropdownMenuLabel>
                <DropdownMenuItem disabled className="text-xs text-muted-foreground">
                  {user?.email || user?.pubkey || "demo@eventro.com"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="outline">
              <Link href="/login">
                <User className="mr-2 h-4 w-4" />
                <span>Login</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
