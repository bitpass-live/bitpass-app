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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Combine date and time
    const start = new Date(`${startDate}T${startTime}`).toISOString();
    const end = new Date(`${endDate}T${endTime}`).toISOString();

    // TO-DO
    // Create Event
    const eventId = '123'; // Replace with actual event ID after creation

    toast({
      title: 'Event created',
      description: 'Your event has been created successfully.',
    });

    // Close dialog and redirect
    setOpen(false);
    router.push(`/events/${eventId}/manage`);
  };

  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <div className='container'>
        <form onSubmit={handleSubmit}>
          <div className='flex gap-4'>
            <div className='mt-4'>
              <Button variant='outline' size='icon' asChild>
                <Link href='/dashboard'>
                  <ArrowLeft className='h-4 w-4' />
                </Link>
              </Button>
            </div>
            <div className='flex flex-col gap-2 w-full my-4'>
              <h2 className='text-lg font-semibold leading-none tracking-tight'>Create a new event</h2>
              <p className='text-sm text-muted-foreground'>Fill in the details to create your event.</p>
            </div>
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
