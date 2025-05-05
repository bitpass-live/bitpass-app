"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { useEventroStore } from "@/lib/store"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

export function CreateEventButton() {
  // Obtener la fecha actual en formato YYYY-MM-DD
  const today = new Date()
  const formattedDate = today.toISOString().split("T")[0]
  // Obtener la hora actual en formato HH:MM
  const hours = String(today.getHours()).padStart(2, "0")
  const minutes = String(today.getMinutes()).padStart(2, "0")
  const formattedTime = `${hours}:${minutes}`

  const [startDate, setStartDate] = useState(formattedDate)
  const [startTime, setStartTime] = useState(formattedTime)
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [endDate, setEndDate] = useState(formattedDate)
  const [endTime, setEndTime] = useState("")

  const addEvent = useEventroStore((state) => state.addEvent)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Combine date and time
    const start = new Date(`${startDate}T${startTime}`).toISOString()
    const end = new Date(`${endDate}T${endTime}`).toISOString()

    // Create event
    const eventId = addEvent({
      title,
      description,
      location,
      start,
      end,
    })

    toast({
      title: "Event created",
      description: "Your event has been created successfully.",
    })

    // Close dialog and redirect
    setOpen(false)
    router.push(`/events/${eventId}/manage`)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          Create Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create a new event</DialogTitle>
            <DialogDescription>Fill in the details to create your event. You can add tickets later.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Bitcoin Meetup 2025"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your event..."
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., La Crypta, Buenos Aires"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input id="endTime" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Create Event</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
