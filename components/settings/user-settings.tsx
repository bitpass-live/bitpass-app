"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { ProfileSettings } from "./profile-settings"
import { PaymentSettings } from "./payment-settings"
import { MercadoPagoSettings } from "./mercadopago-settings"

export function UserSettings() {
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <div className="space-y-6">
      <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="payments">Lightning</TabsTrigger>
          <TabsTrigger value="mercadopago">MercadoPago</TabsTrigger>
        </TabsList>
        <div className="mt-6">
          <TabsContent value="profile">
            <Card>
              <ProfileSettings />
            </Card>
          </TabsContent>
          <TabsContent value="payments">
            <Card>
              <PaymentSettings />
            </Card>
          </TabsContent>
          <TabsContent value="mercadopago">
            <Card>
              <MercadoPagoSettings />
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
