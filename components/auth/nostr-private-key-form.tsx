"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Eye, EyeOff, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth-provider"

interface NostrPrivateKeyFormProps {
  onBack: () => void
}

export function NostrPrivateKeyForm({ onBack }: NostrPrivateKeyFormProps) {
  const [privateKey, setPrivateKey] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showKey, setShowKey] = useState(false)
  const { toast } = useToast()
  const { loginWithPrivateKey } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!privateKey.trim()) {
      toast({
        title: "Private key required",
        description: "Please enter your Nostr private key",
        variant: "destructive",
      })
      return
    }

    if (!privateKey.startsWith("nsec1") && !privateKey.startsWith("npub1")) {
      toast({
        title: "Invalid key format",
        description: "Please enter a valid Nostr private key (nsec1...)",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      await loginWithPrivateKey(privateKey);
      setIsLoading(false)

      toast({
        title: 'Logged in successfully',
        description: 'Welcome to Bitpass!',
      });
    } catch (error) {
      setIsLoading(false)
      toast({
        title: "Authentication failed",
        description: "Could not authenticate with the provided key",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="p-0 mr-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-sm font-medium">Sign in with Nostr Private Key</h3>
      </div>

      <Alert variant="warning" className="bg-amber-900/20 border-amber-700/50 text-amber-200">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Security Warning</AlertTitle>
        <AlertDescription className="text-xs">
          Only enter your private key on trusted websites. For better security, we recommend using a browser extension
          like Alby.
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <Label htmlFor="privateKey">Nostr Private Key</Label>
        <div className="relative">
          <Input
            id="privateKey"
            type={showKey ? "text" : "password"}
            placeholder="nsec1..."
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            className="pr-10"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3"
            onClick={() => setShowKey(!showKey)}
          >
            {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Authenticating..." : "Sign In"}
      </Button>
    </form>
  )
}
