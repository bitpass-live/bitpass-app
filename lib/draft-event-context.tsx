'use client'

import { createContext, useContext, useMemo } from 'react'
import { CreateTicketInput, useDraftEvent } from '@/hooks/use-draft-event'
import type { Event as EventModel, FullEvent, TicketType } from '@/lib/bitpass-sdk/src/types/event'
import { Ticket } from './bitpass-sdk/src/types/ticket'

type DraftEventProviderProps =
  | { eventId: string; instanceId?: undefined, children: React.ReactNode }
  | { eventId?: undefined; instanceId: string, children: React.ReactNode }

interface DraftEventContextType {
  draftEvent: FullEvent | null
  loading: boolean
  error: string | null
  setDraftField: <K extends keyof EventModel>(field: K, value: EventModel[K]) => void
  saveDraftEvent: () => Promise<void>
  addTicket(ticket: CreateTicketInput): Promise<void>
  updateTicket(id: string, updates: Partial<TicketType>): Promise<void>
  deleteTicket(id: string): Promise<void>
  createDraftEvent: (data: {
    title: string;
    description: string;
    location: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
  }) => Promise<void>
  getTickets: () => Promise<Ticket[]>
}

const DraftEventContext = createContext<DraftEventContextType | undefined>(undefined)

export function useDraftEventContext() {
  const ctx = useContext(DraftEventContext)
  if (!ctx) throw new Error('useDraftEventContext must be used inside a <DraftEventProvider>')
  return ctx
}

export function DraftEventProvider(props: DraftEventProviderProps) {
  const hook = useDraftEvent(props)
  const value = useMemo(() => hook, [hook])

  return (
    <DraftEventContext.Provider value={value}>
      {props.children}
    </DraftEventContext.Provider>
  )
}