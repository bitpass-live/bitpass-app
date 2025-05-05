"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-provider"
import { EmailLoginForm } from "@/components/auth/email-login-form"
import { NostrLoginForm } from "@/components/auth/nostr-login-form"

export function LoginForm() {
  const router = useRouter()
  const { toast } = useToast()
  const { login } = useAuth()

  const handleDemoLogin = () => {
    login({ email: "demo@eventro.com", role: "OWNER" })
    router.push("/checkin")
    toast({
      title: "Demo mode activated",
      description: "You are now using Eventro in demo mode",
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Choose your preferred login method</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="email">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="nostr">Nostr</TabsTrigger>
          </TabsList>
          <TabsContent value="email">
            <EmailLoginForm />
          </TabsContent>
          <TabsContent value="nostr">
            <NostrLoginForm />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="ghost" onClick={handleDemoLogin}>
          Try Demo Mode
        </Button>
      </CardFooter>
    </Card>
  )
}
