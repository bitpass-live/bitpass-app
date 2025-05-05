"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useEventroStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate, formatCurrency } from "@/lib/utils"
import { CalendarIcon, MapPinIcon, TicketIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

export function EventDetails({ eventId }: { eventId: string }) {
  const router = useRouter()
  const { toast } = useToast()

  const event = useEventroStore((state) => state.events.find((e) => e.id === eventId))

  const [selectedTickets, setSelectedTickets] = useState<Record<string, number>>({})

  if (!event) {
    return <div>Event not found</div>
  }

  if (!event.published) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-3 mb-4">
          <TicketIcon className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Event not published</h2>
        <p className="text-muted-foreground max-w-md mb-6">This event is not yet available for registration.</p>
        <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
      </div>
    )
  }

  const handleTicketChange = (ticketId: string, quantity: number) => {
    setSelectedTickets((prev) => ({
      ...prev,
      [ticketId]: quantity,
    }))
  }

  const totalTickets = Object.values(selectedTickets).reduce((sum, qty) => sum + qty, 0)

  const handleProceedToCheckout = () => {
    if (totalTickets === 0) {
      toast({
        title: "No tickets selected",
        description: "Please select at least one ticket to continue.",
        variant: "destructive",
      })
      return
    }

    router.push(`/events/${eventId}/checkout?tickets=${encodeURIComponent(JSON.stringify(selectedTickets))}`)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">{event.title}</h1>

        <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-6">
          <div className="flex items-center gap-1">
            <CalendarIcon className="h-4 w-4" />
            <span>{formatDate(event.start)}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPinIcon className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
        </div>

        <div className="prose max-w-none mb-8">
          <p>{event.description}</p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Tickets</h2>

        <Card>
          <CardHeader>
            <CardTitle>Select Tickets</CardTitle>
            <CardDescription>Choose the type and quantity of tickets you want to purchase</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {event.tickets.map((ticket) => {
              const availableQuantity = ticket.quantity - (ticket.sold || 0)
              const isAvailable = availableQuantity > 0

              return (
                <div key={ticket.id} className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium">{ticket.title}</p>
                    <p className="text-sm text-muted-foreground">{formatCurrency(ticket.amount, ticket.currency)}</p>
                    <p className="text-xs text-muted-foreground">{availableQuantity} remaining</p>
                  </div>
                  <div className="w-24">
                    <Input
                      type="number"
                      min="0"
                      max={availableQuantity}
                      value={selectedTickets[ticket.id] || 0}
                      onChange={(e) => handleTicketChange(ticket.id, Number.parseInt(e.target.value) || 0)}
                      disabled={!isAvailable}
                    />
                  </div>
                </div>
              )
            })}
          </CardContent>
          <CardFooter className="flex justify-between">
            <div>
              <p className="text-sm font-medium">Total: {totalTickets} tickets</p>
            </div>
            <Button onClick={handleProceedToCheckout} disabled={totalTickets === 0}>
              Proceed to Checkout
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
