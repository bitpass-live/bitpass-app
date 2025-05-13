import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth-provider';
import { useToast } from '@/hooks/use-toast';;
import type { Event as EventModel, FullEvent, TicketType } from '@/lib/bitpass-sdk/src/types/event';

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

  useEffect(() => {
    if (!user.loaded || (!eventId && !instanceId)) return;

    setLoading(true);

    const load = async () => {
      try {
        const evt: FullEvent = eventId
          ? await bitpassAPI.getDraftEvent(eventId)
          : await bitpassAPI.getEventByInstanceId(instanceId!);

        setDraftEvent(evt);
        setOriginalEvent(evt);
        setEventExists(true);
      } catch (err: any) {
        if (err.message.includes('not found')) {
          setEventExists(false);
        } else {
          setError(err.message);
          toast({ title: 'Error', description: err.message, variant: 'destructive' });
        }
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
    } catch (err: any) {
      console.error('Error creating event:', err);
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [bitpassAPI, toast]);

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
    } catch (err: any) {
      console.error('Error saving draft event:', err);
      toast({
        title: 'Save failed',
        description: err.message || 'Something went wrong',
        variant: 'destructive',
      });
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
    } catch (err: any) {
      console.error('Error adding ticket:', err);
      toast({ title: 'Error', description: err.message || 'Failed to create ticket', variant: 'destructive' });
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
    } catch (err: any) {
      console.error('Error updating ticket:', err);
      toast({ title: 'Error', description: err.message || 'Failed to update ticket', variant: 'destructive' });
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
    } catch (err: any) {
      console.error('Error deleting ticket:', err);
      toast({ title: 'Error', description: err.message || 'Failed to delete ticket', variant: 'destructive' });
    }
  }, [bitpassAPI, draftEvent, toast]);

  return {
    draftEvent,
    loading,
    error,
    setDraftField,
    saveDraftEvent,
    createDraftEvent,
    addTicket,
    updateTicket,
    deleteTicket,
  };
}
