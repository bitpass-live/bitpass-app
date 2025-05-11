'use client';

import Link from 'next/link';

import { Card, CardContent } from '@/components/ui/card';
import { MapPinIcon } from 'lucide-react';
import { useUserData } from '@/hooks/use-user-data';

export function EventList() {
  const { events } = useUserData();

  if (events.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-12 text-center'>
        <img
          className='w-full max-w-80 -my-12 select-none pointer-events-none'
          alt='No events yet'
          src='/no-events.png'
        />
        <h2 className='text-xl font-semibold mb-2'>No events yet</h2>
        <p className='text-muted-foreground max-w-md mb-6'>
          Create your first event to start selling tickets and managing attendees.
        </p>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-4'>
      {events.map((event) => {
        // TO-DO
        // REVIEW LIVE FUNCTION
        const live = false;

        return (
          <Link className='rounded-lg' href={`/event/${event.id}/manage`} key={event.id}>
            <Card className='overflow-hidden w-full'>
              <div className='flex flex-col gap-2 p-6 pb-2'>
                <div className='flex gap-2 items-center'>
                  {/* TO-DO */}
                  {/* CHANGE THIS FOR COMPARATION DATE  */}
                  {event?.id === 'event123' && (
                    <div className='flex items-center gap-2'>
                      <div className='w-2 h-2 bg-fluorescent-yellow rounded-full animate-pulse'></div>
                      <p className='font-semibold text-fluorescent-yellow'>Live now</p>
                    </div>
                  )}
                  <p className='text-sm text-text-secondary'>14:00</p>
                </div>
                <h2 className='text-lg font-semibold leading-none tracking-tight'>{event.title}</h2>
              </div>
              <CardContent className='pb-3'>
                <div className='flex items-center gap-1 text-sm text-muted-foreground mb-2'>
                  <MapPinIcon className='h-4 w-4' />
                  <span>{event.location}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
