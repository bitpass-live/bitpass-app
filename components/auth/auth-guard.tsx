"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-provider"

// Simplificar el AuthGuard para proteger solo la ruta de checkin
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Solo proteger la ruta de checkin
    if (pathname === "/checkin" && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, pathname, router])

  return <>{children}</>
}
