import { useState, useEffect } from 'react';
import type { Event as EventModel } from '@/lib/bitpass-sdk/src/types/event';
import { useAuth } from '@/lib/auth-provider';

export function useUserData() {
  const { bitpassAPI, isAuthenticated } = useAuth();
  const [events, setEvents] = useState<EventModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    bitpassAPI.getUserEvents()
      .then((evtList) => setEvents(evtList))
      .catch((err) => {
        console.error('Error loading events:', err);
        setError(err.message || 'Failed to load events');
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated, bitpassAPI]);

  return { events, loading, error };
}