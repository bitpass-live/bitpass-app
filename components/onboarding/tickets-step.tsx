'use client';

import { useCallback, useMemo, useState } from 'react';
import { TicketCheck, PlusIcon, TicketIcon, Pencil, Trash2 } from 'lucide-react';

import { useToast } from '@/hooks/use-toast';;
import { useDraftEventContext } from '@/lib/draft-event-context';

import { SatoshiIcon } from '@/components/icon/satoshi';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
import { OnboardingLayout } from '@/components/onboarding/onboarding-layout';
import { StepNavigation } from '@/components/onboarding/step-navigation';

interface TicketsStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function TicketsStep({ onNext, onBack }: TicketsStepProps) {
  const { draftEvent, addTicket, updateTicket, deleteTicket } = useDraftEventContext();
  const tickets = useMemo(() => draftEvent?.ticketTypes || [], [draftEvent]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<any | null>(null);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<'ARS' | 'SAT' | 'USD'>('ARS');
  const [quantity, setQuantity] = useState('');
  const [isFree, setIsFree] = useState(true);
  const [isLimited, setIsLimited] = useState(false);

  const { toast } = useToast();

  const handleOpenDialog = useCallback((ticket?: any) => {
    if (ticket) {
      setEditingTicket(ticket);
      setTitle(ticket.name);
      setAmount(ticket.price.toString());
      setIsFree(ticket.price === 0);
      setCurrency(ticket.currency);
      setIsLimited(ticket.quantity !== -1);
      setQuantity(ticket.quantity !== -1 ? ticket.quantity.toString() : '');
    } else {
      setEditingTicket(null);
      setTitle('');
      setAmount('');
      setIsFree(true);
      setCurrency('ARS');
      setIsLimited(false);
      setQuantity('');
    }

    setDialogOpen(true);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const parsedPrice = isFree ? 0 : parseFloat(amount);
      const parsedQuantity = isLimited ? parseInt(quantity) : -1;

      if (editingTicket) {
        await updateTicket(editingTicket.id, {
          name: title,
          price: parsedPrice,
          currency,
          quantity: parsedQuantity,
        });
      } else {
        await addTicket({
          name: title,
          price: parsedPrice,
          currency,
          quantity: parsedQuantity,
        });
      }

      setDialogOpen(false);
    },
    [editingTicket, title, amount, currency, isFree, isLimited, quantity, addTicket, updateTicket]
  );

  const handleDeleteTicket = useCallback(async (ticketId: string) => {
    const confirmed = confirm('Are you sure you want to delete this ticket?');
    if (!confirmed) return;

    await deleteTicket(ticketId);
  }, [deleteTicket]);

  const handleNext = useCallback(() => {
    if (tickets.length === 0) {
      toast({
        title: 'No tickets added',
        description: 'You must create at least one ticket to continue.',
        variant: 'destructive',
      });
      return;
    }

    onNext();
  }, [tickets, toast, onNext]);

  return (
    <OnboardingLayout
      currentStep={1}
      totalSteps={4}
      icon={TicketCheck}
      title='Configure your Tickets'
      subtitle='Create different types of tickets for your event'
    >
      <div className='space-y-6'>
        <div className='flex justify-center'>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className='w-full' onClick={() => handleOpenDialog()}>
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
                          <Select
                            value={currency}
                            onValueChange={(value) => setCurrency(value as 'ARS' | 'SAT' | 'USD')}
                          >
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

        {tickets?.length === 0 && (
          <Card>
            <div className='p-6 text-center text-muted-foreground'>
              <p className='text-sm'>No tickets have been created for this event yet.</p>
              <p className='text-sm'>Click <strong>"New"</strong> to add your first ticket.</p>
            </div>
          </Card>
        )}

        {tickets?.length > 0 && (
          <Card>
            {tickets.map((ticket) => (
              <div className='border-b last:border-none' key={ticket.id}>
                <div className='p-6'>
                  <div className='flex items-center justify-between gap-4'>
                    <div className='flex items-center gap-2 w-full'>
                      <h3 className='text-lg font-semibold'>{ticket.name}</h3>
                      <p className='text-text-secondary'>
                        {ticket.price === 0 ? 'Gratis' : `$${ticket.price} ${ticket.currency}`}
                      </p>
                    </div>
                    <div className='hidden md:flex whitespace-nowrap'>
                      <p className='text-muted-foreground text-sm'>
                        {ticket.quantity === -1 ? 'Ilimitado' : `Limited to ${ticket.quantity}`}
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

        <StepNavigation onNext={handleNext} onBack={onBack} nextLabel='Next' />
      </div>
    </OnboardingLayout>
  );
}
