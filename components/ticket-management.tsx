"use client"

import type React from "react"

import { useState, useCallback, useMemo } from "react"
import { useEventroStore, type Ticket } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Switch } from "@/components/ui/switch"
import { formatCurrency } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PlusIcon, Pencil, Trash2 } from "lucide-react"
import { useAuth } from "@/lib/auth-provider"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function TicketManagement({ eventId }: { eventId: string }) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null)

  const [title, setTitle] = useState("")
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState<"ARS" | "SAT">("ARS")
  const [quantity, setQuantity] = useState("")
  const [isFree, setIsFree] = useState(true)
  const [isLimited, setIsLimited] = useState(false)

  const { toast } = useToast()
  const router = useRouter()
  const { user } = useAuth()

  // Check if user has lightning address configured
  const hasLightningAddress = !!user?.lightningAddress

  // Get event data from store
  const event = useEventroStore((state) => state.events.find((e) => e.id === eventId))

  const addTicket = useEventroStore((state) => state.addTicket)
  const updateTicket = useEventroStore((state) => state.updateTicket)
  const deleteTicket = useEventroStore((state) => state.deleteTicket)

  // Memoize tickets to prevent unnecessary re-renders
  const tickets = useMemo(() => event?.tickets || [], [event?.tickets])

  const handleOpenDialog = useCallback(
    (ticket?: Ticket) => {
      if (!hasLightningAddress) {
        toast({
          title: "Lightning Address Required",
          description: "You need to set up a Lightning Address in your settings before creating tickets.",
          variant: "destructive",
        })
        return
      }

      if (ticket) {
        setEditingTicket(ticket)
        setTitle(ticket.title)
        setIsFree(ticket.amount === 0)
        setAmount(ticket.amount === 0 ? "" : ticket.amount.toString())
        setCurrency(ticket.currency)
        // Si la cantidad es -1, es ilimitada
        const isTicketLimited = ticket.quantity !== -1
        setIsLimited(isTicketLimited)
        setQuantity(isTicketLimited ? ticket.quantity.toString() : "")
      } else {
        setEditingTicket(null)
        setTitle("")
        setAmount("")
        setIsFree(true)
        setCurrency("ARS")
        setIsLimited(false)
        setQuantity("")
      }

      setDialogOpen(true)
    },
    [hasLightningAddress, toast],
  )

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()

      const ticketData = {
        title,
        amount: isFree ? 0 : Number(amount),
        currency,
        quantity: isLimited ? Number(quantity) : -1, // -1 representa ilimitado
      }

      if (editingTicket) {
        updateTicket(eventId, editingTicket.id, ticketData)
        toast({
          title: "Ticket updated",
          description: "Your ticket has been updated successfully.",
        })
      } else {
        addTicket(eventId, ticketData)
        toast({
          title: "Ticket added",
          description: "Your ticket has been added successfully.",
        })
      }

      setDialogOpen(false)
    },
    [title, amount, isFree, currency, quantity, isLimited, editingTicket, eventId, updateTicket, addTicket, toast],
  )

  const handleNavigateToSettings = () => {
    router.push("/settings?tab=payments")
  }

  const handleDeleteTicket = useCallback(
    (ticketId: string) => {
      if (confirm("Are you sure you want to delete this ticket?")) {
        deleteTicket(eventId, ticketId)
        toast({
          title: "Ticket deleted",
          description: "Your ticket has been deleted successfully.",
        })
      }
    },
    [eventId, deleteTicket, toast],
  )

  // Show loading state if event not found
  if (!event) {
    return <div className="p-8 text-center">Loading ticket data...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Ticket Types</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Ticket
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{editingTicket ? "Edit Ticket Type" : "Add Ticket Type"}</DialogTitle>
                <DialogDescription>Define the details for this ticket type.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Ticket Name</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., General Admission"
                    required
                  />
                </div>

                {/* Sección de precio - inspirada en Luma */}
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label>Precio</Label>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="free-ticket" className="text-sm text-muted-foreground">
                        {isFree ? "Gratis" : "De pago"}
                      </Label>
                      <Switch id="free-ticket" checked={isFree} onCheckedChange={setIsFree} />
                    </div>
                  </div>

                  {!isFree && (
                    <div className="flex gap-2 items-center">
                      <Input
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0"
                        min="0"
                        required
                        className="flex-1"
                      />
                      <Select value={currency} onValueChange={(value) => setCurrency(value as "ARS" | "SAT")}>
                        <SelectTrigger id="currency" className="w-24">
                          <SelectValue placeholder="Moneda" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ARS">ARS</SelectItem>
                          <SelectItem value="SAT">SAT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                {/* Sección de cupo - inspirada en Luma */}
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label>Cupo</Label>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="limited-quantity" className="text-sm text-muted-foreground">
                        {!isLimited ? "Ilimitado" : "Limitado"}
                      </Label>
                      <Switch
                        id="limited-quantity"
                        checked={!isLimited}
                        onCheckedChange={(checked) => setIsLimited(!checked)}
                      />
                    </div>
                  </div>

                  {isLimited && (
                    <Input
                      id="quantity"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="Cantidad de tickets disponibles"
                      min="1"
                      required
                    />
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">{editingTicket ? "Save Changes" : "Add Ticket"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {!hasLightningAddress && (
        <Alert variant="warning" className="bg-amber-900/20 border-amber-700/50 text-amber-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Lightning Address Required</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <p>You need to set up a Lightning Address in your settings before creating tickets.</p>
            <Button variant="outline" size="sm" className="w-fit" onClick={handleNavigateToSettings}>
              Go to Payment Settings
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {tickets.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <PlusIcon className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No tickets yet</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              Add ticket types to start selling tickets for your event.
            </p>
            <Button onClick={() => handleOpenDialog()} disabled={!hasLightningAddress}>
              Add Your First Ticket
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {tickets.map((ticket) => (
            <Card key={ticket.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{ticket.title}</h3>
                    <div className="flex flex-col gap-1 mt-1">
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <span className="font-medium text-foreground">Precio:</span>
                        {ticket.amount === 0 ? "Gratis" : formatCurrency(ticket.amount, ticket.currency)}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <span className="font-medium text-foreground">Cupo:</span>
                        {ticket.quantity === -1 ? "Ilimitado" : `${ticket.sold || 0} / ${ticket.quantity} vendidos`}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleOpenDialog(ticket)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteTicket(ticket.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
