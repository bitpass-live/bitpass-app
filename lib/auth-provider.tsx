"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

type UserRole = "OWNER" | "MODERATOR" | "CHECKIN"

interface User {
  email?: string
  pubkey?: string
  name?: string
  role: UserRole
  authMethod: "email" | "nostr" | "demo"
  lastLogin: string
  lightningAddress?: string
  mercadoPagoEmail?: string
  mercadoPagoAlias?: string
  mercadoPagoAccessToken?: string
  mercadoPagoTestMode?: boolean
}

interface AuthContextType {
  user: User | null
  login: (user: Partial<User>) => void
  logout: () => void
  updateUser: (userData: Partial<User>) => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  // Check for saved user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("eventro-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const login = (userData: Partial<User>) => {
    // Determine auth method
    let authMethod: "email" | "nostr" | "demo" = "demo"
    if (userData.email) authMethod = "email"
    if (userData.pubkey) authMethod = "nostr"

    const fullUser: User = {
      ...userData,
      role: userData.role || "OWNER",
      authMethod,
      lastLogin: new Date().toISOString(),
    } as User

    setUser(fullUser)
    localStorage.setItem("eventro-user", JSON.stringify(fullUser))
  }

  const updateUser = async (userData: Partial<User>): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        if (!user) {
          reject(new Error("No user logged in"))
          return
        }

        // Simulate API call
        setTimeout(() => {
          const updatedUser = { ...user, ...userData }
          setUser(updatedUser)
          localStorage.setItem("eventro-user", JSON.stringify(updatedUser))
          resolve()
        }, 500)
      } catch (error) {
        reject(error)
      }
    })
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("eventro-user")

    // Redirect to login page
    router.push("/login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
