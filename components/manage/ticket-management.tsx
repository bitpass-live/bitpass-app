'use client';

import type React from 'react';

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { PlusIcon, Pencil, Trash2, AlertCircle, TicketIcon } from 'lucide-react';

import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/lib/auth-provider';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import type { Ticket } from '@/types';

import { MOCK_EVENT } from '@/mock/data';

export function TicketManagement({ eventId }: { eventId: string }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<'ARS' | 'SAT'>('ARS');
  const [quantity, setQuantity] = useState('');
  const [isFree, setIsFree] = useState(true);
  const [isLimited, setIsLimited] = useState(false);

  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();

  // Check if user has lightning address configured
  const hasLightningAddress = !!user?.lightningAddress;

  // Get event data from store
  const event = MOCK_EVENT;

  // Memoize tickets to prevent unnecessary re-renders
  const tickets = useMemo(() => event?.tickets || [], [event?.tickets]);

  const handleOpenDialog = useCallback(() => {
    setTitle('');
    setAmount('');
    setIsFree(true);
    setCurrency('ARS');
    setIsLimited(false);
    setQuantity('');
    setDialogOpen(true);
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    if (editingTicket) {
      // TO-DO
      // Update ticket
      toast({
        title: 'Ticket updated',
        description: 'Your ticket has been updated successfully.',
      });
    } else {
      // TO-DO
      // Add ticket
      toast({
        title: 'Ticket added',
        description: 'Your ticket has been added successfully.',
      });
    }

    setDialogOpen(false);
  }, []);

  const handleNavigateToSettings = () => {
    router.push('/settings?tab=payments');
  };

  const handleDeleteTicket = useCallback((ticketId: string) => {
    if (confirm('Are you sure you want to delete this ticket?')) {
      // TO-DO
      // Remove ticket
      toast({
        title: 'Ticket deleted',
        description: 'Your ticket has been deleted successfully.',
      });
    }
  }, []);

  // Show loading state if event not found
  if (!event) {
    return <div className='p-8 text-center'>Loading ticket data...</div>;
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold'>Tickets</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <PlusIcon className='h-4 w-4' />
              New
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form className='flex flex-col h-full' onSubmit={handleSubmit}>
              <DialogHeader>
                <TicketIcon className='w-8 h-8 mb-4' />
                <DialogTitle>{editingTicket ? 'Edit Ticket' : 'New Ticket'}</DialogTitle>
                <DialogDescription>Define the details for this ticket.</DialogDescription>
              </DialogHeader>
              <DialogBody>
                <Input
                  id='title'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder='e.g., General Admission'
                  required
                />

                {/* Sección de precio - inspirada en Luma */}
                <div className='grid gap-2'>
                  <div className='flex items-center justify-between'>
                    <Label>Precio</Label>
                    <div className='flex items-center gap-2'>
                      <Label htmlFor='free-ticket' className='text-sm text-muted-foreground'>
                        {isFree ? 'Gratis' : 'De pago'}
                      </Label>
                      <Switch id='free-ticket' checked={isFree} onCheckedChange={setIsFree} />
                    </div>
                  </div>

                  {!isFree && (
                    <div className='flex gap-2 items-center'>
                      <Input
                        id='amount'
                        type='number'
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder='0'
                        min='0'
                        required
                        className='flex-1'
                      />
                      <Select value={currency} onValueChange={(value) => setCurrency(value as 'ARS' | 'SAT')}>
                        <SelectTrigger id='currency' className='w-24'>
                          <SelectValue placeholder='Moneda' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='ARS'>ARS</SelectItem>
                          <SelectItem value='SAT'>SAT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                {/* Sección de cupo - inspirada en Luma */}
                <div className='grid gap-2'>
                  <div className='flex items-center justify-between'>
                    <Label>Cupo</Label>
                    <div className='flex items-center gap-2'>
                      <Label htmlFor='limited-quantity' className='text-sm text-muted-foreground'>
                        {!isLimited ? 'Ilimitado' : 'Limitado'}
                      </Label>
                      <Switch
                        id='limited-quantity'
                        checked={!isLimited}
                        onCheckedChange={(checked) => setIsLimited(!checked)}
                      />
                    </div>
                  </div>

                  {isLimited && (
                    <Input
                      id='quantity'
                      type='number'
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder='Cantidad de tickets disponibles'
                      min='1'
                      required
                    />
                  )}
                </div>
              </DialogBody>
              <DialogFooter>
                <Button className='w-full' type='submit'>
                  {editingTicket ? 'Save' : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {!hasLightningAddress && (
        <Alert className='bg-amber-900/20 border-amber-700/50 text-amber-200'>
          <AlertCircle className='h-4 w-4' />
          <AlertTitle>Lightning Address Required</AlertTitle>
          <AlertDescription className='flex flex-col gap-2'>
            <p>You need to set up a Lightning Address in your settings before creating tickets.</p>
            <Button variant='outline' size='sm' className='w-fit' onClick={handleNavigateToSettings}>
              Go to Payment Settings
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {tickets.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-12 text-center'>
          <img
            className='w-full max-w-64 -my-12 select-none pointer-events-none'
            alt='No tickets yet'
            src='/no-tickets.png'
          />
          <h2 className='text-xl font-semibold mb-2'>No tickets yet</h2>
          <p className='text-muted-foreground max-w-md mb-6'>
            Add ticket types to start selling tickets for your event.
          </p>
        </div>
      ) : (
        <Card>
          {tickets?.length > 0 &&
            tickets?.map((ticket: Ticket) => (
              <div className='border-b last:border-none' key={ticket.id}>
                <div className='p-6'>
                  <div className='flex items-center justify-between gap-4'>
                    <div className='flex items-center gap-2 w-full'>
                      <h3 className='text-lg font-semibold'>{ticket.title}</h3>
                      <p className='text-text-secondary'>{ticket?.amount === 0 ? 'Gratis' : '$' + ticket?.amount}</p>
                    </div>
                    <div className='hidden md:flex whitespace-nowrap'>
                      <p className='text-muted-foreground text-sm'>
                        {ticket.quantity === -1 ? 'Ilimitado' : `${ticket.sold || 0} / ${ticket.quantity} vendidos`}
                      </p>
                    </div>
                    <div className='flex gap-2'>
                      <Button variant='outline' size='icon' onClick={() => handleOpenDialog()}>
                        <Pencil className='h-4 w-4' />
                      </Button>
                      <Button variant='destructive' size='icon' onClick={() => handleDeleteTicket(ticket.id)}>
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </Card>
      )}
    </div>
  );
}
