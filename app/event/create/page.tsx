'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { useAuth } from '@/lib/auth-provider';
import { useToast } from '@/components/ui/use-toast';

import { LoginForm } from '@/components/login-form';
// import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Header } from '@/components/dashboard/header';
import { MobileNav } from '@/components/dashboard/mobile-nav';

export default function CreateEventPage() {
  const { bitpassAPI } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Obtener la fecha actual en formato YYYY-MM-DD
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];
  // Obtener la hora actual en formato HH:MM
  const hours = String(today.getHours()).padStart(2, '0');
  const minutes = String(today.getMinutes()).padStart(2, '0');
  const formattedTime = `${hours}:${minutes}`;

  const [startDate, setStartDate] = useState(formattedDate);
  const [startTime, setStartTime] = useState(formattedTime);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [endDate, setEndDate] = useState(formattedDate);
  const [endTime, setEndTime] = useState('');

  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Combine date and time

    try {
      const event = await bitpassAPI.createDraftEvent({
        title,
        description,
        location,
        startDate,
        startTime,
        endDate,
        endTime,
      });

      toast({
        title: 'Event created',
        description: 'Your event has been created successfully.',
      });

      setOpen(false);
      router.push(`/event/${event.id}/manage`);
    } catch (err: any) {
      toast({
        title: 'Error creating event',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen flex flex-col'>
      <Header backGoHome={true} />
      <div className='container'>
        <form onSubmit={handleSubmit}>
          <div className='flex flex-col gap-2 w-full mt-4'>
            <h2 className='text-xl font-semibold leading-none tracking-tight'>Create a new event</h2>
            <p className='text-sm text-muted-foreground'>Fill in the details to create your event.</p>
          </div>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <Label htmlFor='title'>Event Title</Label>
              <Input
                id='title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='e.g., Bitcoin Meetup 2025'
                required
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='description'>Description</Label>
              <Textarea
                id='description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Describe your event...'
                required
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='location'>Location</Label>
              <Input
                id='location'
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder='e.g., La Crypta, Buenos Aires'
                required
              />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='grid gap-2'>
                <Label htmlFor='startDate'>Start Date</Label>
                <Input
                  id='startDate'
                  type='date'
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='startTime'>Start Time</Label>
                <Input
                  id='startTime'
                  type='time'
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='grid gap-2'>
                <Label htmlFor='endDate'>End Date</Label>
                <Input id='endDate' type='date' value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='endTime'>End Time</Label>
                <Input id='endTime' type='time' value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
              </div>
            </div>
          </div>
          <Button className='w-full' type='submit'>
            Create Event
          </Button>
        </form>
      </div>
    </div>
  );
}
