"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useEventroStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { formatDate } from "@/lib/utils"
import { TicketManagement } from "@/components/ticket-management"
import { TeamManagement } from "@/components/team-management"
import { SalesOverview } from "@/components/sales-overview"
import { CalendarIcon, MapPinIcon, Share2Icon } from "lucide-react"
// Importar el componente DiscountCodeManagement
import { DiscountCodeManagement } from "@/components/discount-code-management"

export function EventManagement({ eventId }: { eventId: string }) {
  const router = useRouter()
  const { toast } = useToast()

  // Get event data from store
  const event = useEventroStore((state) => state.events.find((e) => e.id === eventId))

  const updateEvent = useEventroStore((state) => state.updateEvent)
  const publishEvent = useEventroStore((state) => state.publishEvent)
  const unpublishEvent = useEventroStore((state) => state.unpublishEvent)

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [startDate, setStartDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endDate, setEndDate] = useState("")
  const [endTime, setEndTime] = useState("")

  // Initialize form values when event data is available
  useEffect(() => {
    if (event) {
      setTitle(event.title)
      setDescription(event.description)
      setLocation(event.location)

      try {
        const startDateTime = new Date(event.start)
        setStartDate(startDateTime.toISOString().split("T")[0])
        setStartTime(startDateTime.toISOString().split("T")[1].substring(0, 5))

        const endDateTime = new Date(event.end)
        setEndDate(endDateTime.toISOString().split("T")[0])
        setEndTime(endDateTime.toISOString().split("T")[1].substring(0, 5))
      } catch (error) {
        console.error("Error parsing dates:", error)
      }
    }
  }, [event]) // Only re-run if event changes

  const handleSaveDetails = useCallback(() => {
    if (!event) return

    try {
      // Combine date and time
      const start = new Date(`${startDate}T${startTime}`).toISOString()
      const end = new Date(`${endDate}T${endTime}`).toISOString()

      updateEvent(eventId, {
        title,
        description,
        location,
        start,
        end,
      })

      toast({
        title: "Event updated",
        description: "Your event details have been saved.",
      })
    } catch (error) {
      console.error("Error saving event:", error)
      toast({
        title: "Error saving event",
        description: "Please check your input and try again.",
        variant: "destructive",
      })
    }
  }, [eventId, title, description, location, startDate, startTime, endDate, endTime, updateEvent, toast, event])

  const handlePublishToggle = useCallback(() => {
    if (!event) return

    if (event.published) {
      unpublishEvent(eventId)
      toast({
        title: "Event unpublished",
        description: "Your event is now hidden from the public.",
      })
    } else {
      // Check if event has tickets
      if (event.tickets.length === 0) {
        toast({
          title: "Cannot publish",
          description: "You need to add at least one ticket type before publishing.",
          variant: "destructive",
        })
        return
      }

      publishEvent(eventId)
      toast({
        title: "Event published",
        description: "Your event is now visible to the public.",
      })
    }
  }, [event, eventId, publishEvent, unpublishEvent, toast])

  const handleShareEvent = useCallback(() => {
    // In a real app, this would copy a link to the clipboard
    const eventUrl = `${window.location.origin}/events/${eventId}`

    // Mock copy to clipboard
    toast({
      title: "Link copied",
      description: `Event URL: ${eventUrl}`,
    })
  }, [eventId, toast])

  // Show loading state or error if event not found
  if (!event) {
    return <div className="p-8 text-center">Loading event data...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <h1 className="text-3xl font-bold">{event.title}</h1>
        <div className="flex gap-2">
          <Button className="w-full" variant={event.published ? "outline" : "default"} onClick={handlePublishToggle}>
            {event.published ? "Unpublish" : "Publish"}
          </Button>
          <Button className="w-full" onClick={handleShareEvent}>
            <Share2Icon className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <CalendarIcon className="h-4 w-4" />
          <span>
            {formatDate(event.start)} - {formatDate(event.end)}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <MapPinIcon className="h-4 w-4" />
          <span>{event.location}</span>
        </div>
      </div>

      <Tabs defaultValue="details">
        {/* Modificar el componente TabsList para agregar la pestaña de códigos de descuento */}
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="discounts">Descuentos</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
              <CardDescription>Edit your event information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Event Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input id="startTime" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input id="endTime" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleSaveDetails}>
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="tickets" className="mt-6">
          <TicketManagement eventId={eventId} />
        </TabsContent>

        {/* Agregar el contenido de la pestaña de códigos de descuento después de la pestaña de equipo */}
        <TabsContent value="team" className="mt-6">
          <TeamManagement eventId={eventId} />
        </TabsContent>

        <TabsContent value="discounts" className="mt-6">
          <DiscountCodeManagement eventId={eventId} />
        </TabsContent>

        <TabsContent value="sales" className="mt-6">
          <SalesOverview eventId={eventId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
