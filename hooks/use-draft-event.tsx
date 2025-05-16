import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/lib/auth-provider';
import { useToast } from '@/hooks/use-toast';
import { getErrorMessage } from '@/lib/utils';
import type { Event as EventModel, FullEvent, TicketType } from '@/lib/bitpass-sdk/src/types/event';
import { Ticket } from '@/lib/bitpass-sdk/src/types/ticket';

export type CreateTicketInput = {
  name: string;
  price: number;
  currency: 'ARS' | 'SAT' | 'USD';
  quantity: number;
};

type UseDraftEventParams = {
  eventId?: string;
  instanceId?: string;
};

export function useDraftEvent({ eventId, instanceId }: UseDraftEventParams) {
  const { bitpassAPI, user } = useAuth();
  const { toast } = useToast();

  const [originalEvent, setOriginalEvent] = useState<FullEvent | null>(null);
  const [draftEvent, setDraftEvent] = useState<FullEvent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [eventExist, setEventExists] = useState(false);

  const hasLoaded = useRef(false);

  useEffect(() => {
    if (hasLoaded.current) return;
    if (!user.loaded || (!eventId && !instanceId)) return;

    hasLoaded.current = true;
    setLoading(true);

    const load = async () => {
      try {
        const evt: FullEvent = eventId
          ? await bitpassAPI.getDraftEvent(eventId)
          : await bitpassAPI.getEventByInstanceId(instanceId!);

        setDraftEvent(evt);
        setOriginalEvent(evt);
        setEventExists(true);
      } catch (err) {
        const message = getErrorMessage(err, 'Failed to load event');
        setError(message);

        if (!message.includes('not found')) {
          toast({ title: 'Error', description: message, variant: 'destructive' });
        }

        setEventExists(false);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [eventId, instanceId, bitpassAPI, user.loaded, toast]);

  const setDraftField = useCallback(
    <K extends keyof EventModel>(field: K, value: EventModel[K]) => {
      setDraftEvent(prev => (prev ? { ...prev, [field]: value } : prev));
    },
    []
  );

  const createDraftEvent = useCallback(async (data: {
    title: string;
    description: string;
    location: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
  }) => {
    setLoading(true);
    try {
      const newEvent = await bitpassAPI.createDraftEvent({ ...data, instanceId });
      setDraftEvent(newEvent);
      setOriginalEvent(newEvent);
      setEventExists(true);
      toast({ title: 'Event created', description: 'Your event was created successfully.' });
    } catch (err) {
      const message = getErrorMessage(err, 'Failed to create event');
      console.error('Error creating event:', err);
      setError(message);
      toast({ title: 'Error', description: message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [bitpassAPI, instanceId, toast]);

  const saveDraftEvent = useCallback(async () => {
    if (!draftEvent) return;

    setLoading(true);
    try {
      const updated = await bitpassAPI.updateEvent(draftEvent.id, {
        title: draftEvent.title,
        description: draftEvent.description,
        location: draftEvent.location,
      });
      setOriginalEvent(updated);
      setDraftEvent(prev => (prev ? { ...prev, ...updated } : prev));
      toast({ title: 'Saved', description: 'Your changes have been applied.' });
    } catch (err) {
      const message = getErrorMessage(err, 'Failed to save event');
      console.error('Error saving draft event:', err);
      setError(message);
      toast({ title: 'Error', description: message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [bitpassAPI, draftEvent, toast]);

  const addTicket = useCallback(async (data: CreateTicketInput) => {
    if (!draftEvent) return;

    try {
      const newTicket = await bitpassAPI.createTicketType(draftEvent.id, data);
      setDraftEvent(prev =>
        prev ? { ...prev, ticketTypes: [...(prev.ticketTypes || []), newTicket] } : prev
      );
      toast({ title: 'Ticket added', description: 'The ticket has been created successfully.' });
    } catch (err) {
      const message = getErrorMessage(err, 'Failed to create ticket');
      console.error('Error adding ticket:', err);
      setError(message);
      toast({ title: 'Error', description: message, variant: 'destructive' });
    }
  }, [bitpassAPI, draftEvent, toast]);

  const updateTicket = useCallback(async (ticketId: string, updates: Partial<TicketType>) => {
    if (!draftEvent) return;

    try {
      const updated = await bitpassAPI.updateTicketType(draftEvent.id, ticketId, updates);
      setDraftEvent(prev =>
        prev
          ? {
            ...prev,
            ticketTypes: prev.ticketTypes.map(t => (t.id === ticketId ? updated : t)),
          }
          : prev
      );
      toast({ title: 'Ticket updated', description: 'Changes saved successfully.' });
    } catch (err) {
      const message = getErrorMessage(err, 'Failed to update ticket');
      console.error('Error updating ticket:', err);
      setError(message);
      toast({ title: 'Error', description: message, variant: 'destructive' });
    }
  }, [bitpassAPI, draftEvent, toast]);

  const deleteTicket = useCallback(async (ticketId: string) => {
    if (!draftEvent) return;

    try {
      await bitpassAPI.deleteTicketType(draftEvent.id, ticketId);
      setDraftEvent(prev =>
        prev
          ? {
            ...prev,
            ticketTypes: prev.ticketTypes.filter(t => t.id !== ticketId),
          }
          : prev
      );
      toast({ title: 'Ticket deleted', description: 'The ticket was removed.' });
    } catch (err) {
      const message = getErrorMessage(err, 'Failed to delete ticket');
      console.error('Error deleting ticket:', err);
      setError(message);
      toast({ title: 'Error', description: message, variant: 'destructive' });
    }
  }, [bitpassAPI, draftEvent, toast]);

  const getTickets = async (): Promise<Ticket[]> => {
    if (!draftEvent || !draftEvent.id) return [];

    return await bitpassAPI.getUserTickets(draftEvent.id);
  };

  return {
    draftEvent,
    loading,
    error,
    eventExist,
    setDraftField,
    saveDraftEvent,
    createDraftEvent,
    addTicket,
    updateTicket,
    deleteTicket,
    getTickets
  };
}
