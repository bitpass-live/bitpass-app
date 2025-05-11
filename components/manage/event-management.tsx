'use client';

import Link from 'next/link';
import { useCallback } from 'react';
import { ArrowUpRight } from 'lucide-react';

import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { TicketManagement } from './ticket-management';
import { TeamManagement } from './team-management';
import { SalesOverview } from './sales-overview';
import { DiscountCodeManagement } from './discount-code-management';

import { useDraftEvent } from '@/hooks/use-draft-event';

export function EventManagement({ eventId }: { eventId: string }) {
  const { toast } = useToast();
  const {
    draftEvent,
    loading,
    error,
    setDraftField,
    saveDraftEvent,
  } = useDraftEvent(eventId);

  const handleShareEvent = useCallback(() => {
    const eventUrl = `${window.location.origin}/events/${eventId}`;
    toast({
      title: 'Link copied',
      description: `Event URL: ${eventUrl}`,
    });
  }, [eventId, toast]);

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  if (!draftEvent || loading) {
    return <div className="p-8 text-center">Loading event data...</div>;
  }

  return (
    <div className='flex flex-col gap-2'>
      <div className='container flex flex-row items-center justify-between gap-4'>
        <div className='w-full'>
          <h1 className='text-xl md:text-3xl font-bold'>{draftEvent.title}</h1>
        </div>
        <div className='flex gap-2'>
          <Button variant='secondary' size='icon' onClick={handleShareEvent} asChild>
            <Link target='_blank' href={`/event/${draftEvent.id}`}>
              <ArrowUpRight className='h-4 w-4' />
            </Link>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="details">
        <div className="border-b">
          <div className="container px-0 overflow-hidden">
            <TabsList className="flex gap-4 overflow-x-auto px-4 py-2 bg-transparent rounded-none">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="tickets">Tickets</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="discounts">Descuentos</TabsTrigger>
              <TabsTrigger value="sales">Sales</TabsTrigger>
            </TabsList>
          </div>
        </div>

        {/* Details Tab */}
        <TabsContent value="details" className="container mt-6">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <CardTitle>Event Details</CardTitle>
              <CardDescription>Edit your event information</CardDescription>
            </div>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  value={draftEvent.title}
                  onChange={e => setDraftField('title', e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={5}
                  value={draftEvent.description}
                  onChange={e => setDraftField('description', e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={draftEvent.location}
                  onChange={e => setDraftField('location', e.target.value)}
                />
              </div>

              {/* Start Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={draftEvent.startsAt.slice(0, 10)}
                    onChange={e => {
                      const date = e.target.value;
                      const time = draftEvent.startsAt.slice(11, 16);
                      setDraftField('startsAt', new Date(`${date}T${time}`).toISOString());
                    }}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={draftEvent.startsAt.slice(11, 16)}
                    onChange={e => {
                      const date = draftEvent.startsAt.slice(0, 10);
                      const time = e.target.value;
                      setDraftField('startsAt', new Date(`${date}T${time}`).toISOString());
                    }}
                  />
                </div>
              </div>

              {/* End Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={draftEvent.endsAt.slice(0, 10)}
                    onChange={e => {
                      const date = e.target.value;
                      const time = draftEvent.endsAt.slice(11, 16);
                      setDraftField('endsAt', new Date(`${date}T${time}`).toISOString());
                    }}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={draftEvent.endsAt.slice(11, 16)}
                    onChange={e => {
                      const date = draftEvent.endsAt.slice(0, 10);
                      const time = e.target.value;
                      setDraftField('endsAt', new Date(`${date}T${time}`).toISOString());
                    }}
                  />
                </div>
              </div>
            </div>

            <Button className="w-full" onClick={saveDraftEvent}>
              Save Changes
            </Button>
          </div>
        </TabsContent>

        {/* Other Tabs */}
        <TabsContent value="tickets" className="container mt-6">
          <TicketManagement eventId={eventId} />
        </TabsContent>
        <TabsContent value="team" className="container mt-6">
          <TeamManagement eventId={eventId} />
        </TabsContent>
        <TabsContent value="discounts" className="container mt-6">
          <DiscountCodeManagement eventId={eventId} />
        </TabsContent>
        <TabsContent value="sales" className="container mt-6">
          <SalesOverview eventId={eventId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
