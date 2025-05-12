'use client'

import { createContext, useContext, useMemo } from 'react'
import { CreateTicketInput, useDraftEvent } from '@/hooks/use-draft-event'
import type { Event as EventModel, TicketType } from '@/lib/bitpass-sdk/src/types/event'

interface DraftEventContextType {
  draftEvent: EventModel | null
  loading: boolean
  error: string | null
  setDraftField: <K extends keyof EventModel>(field: K, value: EventModel[K]) => void
  saveDraftEvent: () => Promise<void>
  tickets: TicketType[]
  addTicket(ticket: CreateTicketInput): Promise<void>
  updateTicket(id: string, updates: Partial<TicketType>): Promise<void>
  deleteTicket(id: string): Promise<void>
}

const DraftEventContext = createContext<DraftEventContextType | undefined>(undefined)

export function useDraftEventContext() {
  const ctx = useContext(DraftEventContext)
  if (!ctx) throw new Error('useDraftEventContext must be used inside a <DraftEventProvider>')
  return ctx
}

export function DraftEventProvider({
  eventId,
  children,
}: {
  eventId: string
  children: React.ReactNode
}) {
  const hook = useDraftEvent(eventId)
  const value = useMemo(() => hook, [hook])

  return (
    <DraftEventContext.Provider value={value}>
      {children}
    </DraftEventContext.Provider>
  )
}