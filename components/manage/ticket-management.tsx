'use client';

import type React from 'react';

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { PlusIcon, Pencil, Trash2, AlertCircle, TicketIcon, TicketSlash } from 'lucide-react';

import { useToast } from '@/hooks/use-toast';;
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
import { EmptyState } from '@/components/empty-state';
import { SatoshiIcon } from '@/components/icon/satoshi';

import { useDraftEventContext } from '@/lib/draft-event-context';
import { TicketType, TicketTypeWithSoldCount } from '@/lib/bitpass-sdk/src/types/event';

export function TicketManagement() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<TicketType | null>(null);

  const { loading, draftEvent, addTicket, updateTicket, deleteTicket } = useDraftEventContext();
  const { paymentMethods } = useAuth();

  const tickets = useMemo(() => draftEvent?.ticketTypes ?? [], [])

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<'ARS' | 'SAT' | 'USD'>('ARS');
  const [quantity, setQuantity] = useState('');
  const [isFree, setIsFree] = useState(true);
  const [isLimited, setIsLimited] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  // Check if user has lightning address configured
  const lightning = paymentMethods.find((m) => m.type === 'LIGHTNING');
  const hasLightningAddress = Boolean(lightning)

  const handleOpenDialog = useCallback((ticket?: TicketType) => {
    if (ticket) {
      setEditingTicket(ticket)
      setTitle(ticket.name)
      setAmount(ticket.price.toString())
      setIsFree(ticket.price === 0)
      setCurrency(ticket.currency)
      setIsLimited(ticket.quantity !== -1)
      setQuantity(ticket.quantity !== -1 ? ticket.quantity.toString() : '')
    } else {
      // Modo creación
      setEditingTicket(null)
      setTitle('')
      setAmount('')
      setIsFree(true)
      setCurrency('ARS')
      setIsLimited(false)
      setQuantity('')
    }

    setDialogOpen(true)
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingTicket) {
        await updateTicket(editingTicket.id, {
          name: title,
          price: isFree ? 0 : parseFloat(amount),
          currency,
          quantity: isLimited ? parseInt(quantity) : -1
        })
      } else {
        await addTicket({
          name: title,
          price: isFree ? 0 : parseFloat(amount),
          currency,
          quantity: isLimited ? parseInt(quantity) : -1
        })
      }

      setDialogOpen(false)
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err?.message || 'Failed to save ticket',
        variant: 'destructive',
      })
    }
  }, [editingTicket, title, amount, currency, isFree, isLimited, quantity, updateTicket, addTicket, toast])

  const handleNavigateToSettings = () => {
    router.push('/settings?tab=payments');
  };

  const handleDeleteTicket = useCallback(async (ticketId: string) => {
    const confirmation = confirm('Are you sure you want to delete this ticket?');
    if (!confirmation) return

    try {
      await deleteTicket(ticketId)
      toast({
        title: 'Ticket deleted',
        description: 'Your ticket has been deleted successfully.',
      })
    } catch (err: any) {
      console.error('Error deleting ticket:', err)
      toast({
        title: 'Error',
        description: err?.message || 'Failed to delete ticket',
        variant: 'destructive',
      })
    }
  }, [deleteTicket, toast])

  // Show loading state if event not found
  if (!draftEvent || loading) {
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
                <Card>
                  <CardContent className='p-4'>
                    <div className='flex items-center justify-between'>
                      <Label>Precio</Label>
                      <div className='flex items-center gap-2'>
                        <Label htmlFor='free-ticket' className='text-sm text-muted-foreground'>
                          Free
                        </Label>
                        <Switch id='free-ticket' checked={isFree} onCheckedChange={setIsFree} />
                      </div>
                    </div>
                    {!isFree && (
                      <div className='flex gap-2 items-center mt-4'>
                        <div className='flex'>
                          <div className='flex justify-center items-center min-w-11 bg-muted rounded-l-md border border-r-0 border-input'>
                            {currency === 'SAT' ? (
                              <SatoshiIcon className='w-4 h-4' />
                            ) : (
                              <span className='font-normal text-sm'>$</span>
                            )}
                          </div>
                          <Input
                            id='amount'
                            type='number'
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder='0'
                            min='0'
                            required
                            className='rounded-l-none'
                          />
                        </div>
                        <Select value={currency} onValueChange={(value) => setCurrency(value as 'ARS' | 'SAT' | 'USD')}>
                          <SelectTrigger id='currency' className='w-24'>
                            <SelectValue placeholder='Currency' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='SAT'>SAT</SelectItem>
                            <SelectItem value='ARS'>ARS</SelectItem>
                            <SelectItem value='USD'>USD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Sección de cupo - inspirada en Luma */}
                <Card>
                  <CardContent className='p-4'>
                    <div className='flex items-center justify-between'>
                      <Label>Cupo</Label>
                      <div className='flex items-center gap-2'>
                        <Label htmlFor='limited-quantity' className='text-sm text-muted-foreground'>
                          Unlimited
                        </Label>
                        <Switch
                          id='limited-quantity'
                          checked={!isLimited}
                          onCheckedChange={(checked) => setIsLimited(!checked)}
                        />
                      </div>
                    </div>

                    {isLimited && (
                      <div className='mt-4'>
                        <Input
                          id='quantity'
                          type='number'
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          placeholder='Cantidad de tickets disponibles'
                          min='1'
                          required
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
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
        <Alert variant='warning'>
          <AlertCircle className='h-6 w-6' />
          <AlertTitle>Lightning Address Required</AlertTitle>
          <AlertDescription className='flex flex-col gap-2'>
            <p>You need to set up a Lightning Address in your settings before creating tickets.</p>
            <Button variant='secondary' size='sm' className='w-fit' onClick={handleNavigateToSettings}>
              Go to Payment Settings
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {tickets.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-12 text-center'>
          <EmptyState className='-my-12' icon={TicketSlash} size={240} />
          <h2 className='text-xl font-semibold mb-2'>No tickets yet</h2>
          <p className='text-muted-foreground max-w-md mb-6'>
            Add ticket types to start selling tickets for your event.
          </p>
        </div>
      ) : (
        <Card>
          {tickets?.length > 0 &&
            tickets?.map((ticket: TicketTypeWithSoldCount) => (
              <div className='border-b last:border-none' key={ticket.id}>
                <div className='p-6'>
                  <div className='flex items-center justify-between gap-4'>
                    <div className='flex items-center gap-2 w-full'>
                      <h3 className='text-lg font-semibold'>{ticket.name}</h3>
                      <p className='text-text-secondary'>{ticket?.price === 0 ? 'Gratis' : '$' + ticket?.price}</p>
                    </div>
                    <div className='hidden md:flex whitespace-nowrap'>
                      <p className='text-muted-foreground text-sm'>
                        {ticket.quantity === -1 ? 'Ilimitado' : `${ticket.soldCount} / ${ticket.quantity} vendidos`}
                      </p>
                    </div>
                    <div className='flex gap-2'>
                      <Button variant='outline' size='icon' onClick={() => handleOpenDialog(ticket)}>
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
