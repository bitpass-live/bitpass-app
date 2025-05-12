// src/hooks/use-draft-event.ts
import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/lib/auth-provider'
import { useToast } from '@/components/ui/use-toast'
import type { Event as EventModel } from '@/lib/bitpass-sdk/src/types/event'
import type { TicketType } from '@/lib/bitpass-sdk/src/types/event'

export type CreateTicketInput = {
  name: string
  price: number
  currency: 'ARS' | 'SAT' | 'USD'
  quantity: number
}

export function useDraftEvent(eventId: string) {
  const { bitpassAPI, user } = useAuth()
  const { toast } = useToast()

  const [originalEvent, setOriginalEvent] = useState<EventModel | null>(null)
  const [draftEvent, setDraftEvent] = useState<EventModel | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [tickets, setTickets] = useState<TicketType[]>([])

  useEffect(() => {
    if (!eventId || !user.loaded) return

    setLoading(true)

    Promise.all([
      bitpassAPI.getDraftEvent(eventId),
      bitpassAPI.getAdminTickets(eventId)
    ])
      .then(([evt, ticketList]) => {
        setOriginalEvent(evt)
        setDraftEvent(evt)
        setTickets(ticketList)
        setError(null)
      })
      .catch(err => {
        console.error('Error loading draft event or tickets:', err)
        const msg = err.message ?? 'Error loading event data'
        setError(msg)
        toast({ title: 'Error', description: msg, variant: 'destructive' })
      })
      .finally(() => setLoading(false))
  }, [eventId, bitpassAPI, user.loaded, toast])

  const setDraftField = useCallback(
    <K extends keyof EventModel>(field: K, value: EventModel[K]) => {
      setDraftEvent(prev =>
        prev ? { ...prev, [field]: value } : prev
      )
    },
    []
  )

  const saveDraftEvent = useCallback(async () => {
    if (!draftEvent) return

    setLoading(true)
    try {
      const updated = await bitpassAPI.updateEvent(
        draftEvent.id,
        {
          title: draftEvent.title,
          description: draftEvent.description,
          location: draftEvent.location,
        }
      )
      setOriginalEvent(updated)
      setDraftEvent(updated)
      toast({ title: 'Saved', description: 'Your changes have been applied.' })
    } catch (err: any) {
      console.error('Error saving draft event:', err)
      toast({
        title: 'Save failed',
        description: err.message || 'Something went wrong',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [bitpassAPI, draftEvent, toast])

  const addTicket = useCallback(async (data: CreateTicketInput) => {
    if (!draftEvent) return

    try {
      const newTicket = await bitpassAPI.createTicketType(draftEvent.id, data)
      setTickets((prev) => [...prev, newTicket])
      toast({ title: 'Ticket added', description: 'The ticket has been created successfully.' })
    } catch (err: any) {
      console.error('Error adding ticket:', err)
      toast({ title: 'Error', description: err.message || 'Failed to create ticket', variant: 'destructive' })
    }
  }, [bitpassAPI, draftEvent, toast])

  const updateTicket = useCallback(async (ticketId: string, updates: Partial<TicketType>) => {
    if (!draftEvent) return;

    try {
      const updated = await bitpassAPI.updateTicketType(draftEvent.id, ticketId, updates)
      setTickets((prev) => prev.map(t => t.id === ticketId ? updated : t))
      toast({ title: 'Ticket updated', description: 'Changes saved successfully.' })
    } catch (err: any) {
      console.error('Error updating ticket:', err)
      toast({ title: 'Error', description: err.message || 'Failed to update ticket', variant: 'destructive' })
    }
  }, [bitpassAPI, draftEvent, toast])

  const deleteTicket = useCallback(async (ticketId: string) => {
    if (!draftEvent) return;

    try {
      await bitpassAPI.deleteTicketType(draftEvent.id, ticketId)
      setTickets((prev) => prev.filter(t => t.id !== ticketId))
      toast({ title: 'Ticket deleted', description: 'The ticket was removed.' })
    } catch (err: any) {
      console.error('Error deleting ticket:', err)
      toast({ title: 'Error', description: err.message || 'Failed to delete ticket', variant: 'destructive' })
    }
  }, [bitpassAPI, draftEvent, toast])

  return {
    draftEvent,
    loading,
    error,
    setDraftField,
    saveDraftEvent,
    tickets,
    addTicket,
    updateTicket,
    deleteTicket
  }
}
