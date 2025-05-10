// src/hooks/use-draft-event.ts
import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/lib/auth-provider'
import { useToast } from '@/components/ui/use-toast'
import type { Event as EventModel } from '@/lib/bitpass-sdk/src/types/event'

export function useDraftEvent(eventId: string) {
  const { bitpassAPI, user } = useAuth()
  const { toast } = useToast()

  const [originalEvent, setOriginalEvent] = useState<EventModel | null>(null)
  const [draftEvent,   setDraftEvent]   = useState<EventModel | null>(null)
  const [loading,      setLoading]      = useState(false)
  const [error,        setError]        = useState<string | null>(null)

  useEffect(() => {
    if (!eventId || !user.loaded) return

    setLoading(true)
    bitpassAPI.getDraftEvent(eventId)
      .then(evt => {
        setOriginalEvent(evt)
        setDraftEvent(evt)
        setError(null)
      })
      .catch(err => {
        console.error('Error loading draft event:', err)
        const msg = err.message ?? 'Error loading event'
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
          title:       draftEvent.title,
          description: draftEvent.description,
          location:    draftEvent.location,
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

  return {
    draftEvent,
    loading,
    error,
    setDraftField,
    saveDraftEvent,
  }
}
