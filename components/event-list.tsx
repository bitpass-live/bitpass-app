'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, MapPinIcon, Users } from 'lucide-react';
import { formatDate, isEventLive } from '@/lib/utils';
import { CreateEventButton } from '@/components/create-event-button';

import { MOCK_EVENTS } from '@/mock/data';

export function EventList() {
  const events = MOCK_EVENTS;

  if (events.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-12 text-center'>
        <div className='rounded-full bg-muted p-3 mb-4'>
          <CalendarIcon className='h-10 w-10 text-muted-foreground' />
        </div>
        <h2 className='text-xl font-semibold mb-2'>No events yet</h2>
        <p className='text-muted-foreground max-w-md mb-6'>
          Create your first event to start selling tickets and managing attendees.
        </p>
        <CreateEventButton />
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-6'>
      {events.map((event) => {
        const totalSold = event.tickets.reduce((acc, ticket) => acc + (ticket.sold || 0), 0);
        const totalCapacity = event.tickets.reduce((acc, ticket) => acc + ticket.quantity, 0);
        // TO-DO
        // REVIEW LIVE FUNCTION
        const live = true;

        return (
          <Card key={event.id} className='overflow-hidden w-full'>
            <CardHeader className='pb-3'>
              <div className='flex justify-between items-start'>
                {live ? (
                  <Badge variant='destructive' className='mb-2'>
                    Live Now
                  </Badge>
                ) : (
                  <Badge variant={event.published ? 'default' : 'outline'} className='mb-2'>
                    {event.published ? 'Published' : 'Draft'}
                  </Badge>
                )}
              </div>
              <CardTitle className='line-clamp-1'>{event.title}</CardTitle>
              <CardDescription className='flex items-center gap-1'>
                <CalendarIcon className='h-3 w-3' />
                <span>{formatDate(event.start)}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className='pb-3'>
              <div className='flex items-center gap-1 text-sm text-muted-foreground mb-2'>
                <MapPinIcon className='h-3 w-3' />
                <span>{event.location}</span>
              </div>
              <div className='flex items-center gap-1 text-sm'>
                <Users className='h-3 w-3' />
                <span>
                  {totalSold} / {totalCapacity} attendees
                </span>
              </div>
            </CardContent>
            <CardFooter className='flex justify-between pt-3 border-t'>
              <Button asChild variant='outline' size='sm'>
                <Link href={`/event/${event.id}/manage`}>Manage</Link>
              </Button>
              <Button asChild size='sm'>
                <Link href={`/event/${event.id}`}>{event.published ? 'Register' : 'Preview'}</Link>
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
