'use client';

import { useCallback, useState } from 'react';
import { TicketCheck, PlusIcon, TicketIcon, Pencil, Trash2 } from 'lucide-react';

import { useToast } from '@/hooks/use-toast';

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

import { MOCK_EVENT } from '@/mock/data';

interface TicketsStepProps {
  onNext: () => void;
  onBack: () => void;
}

interface TicketType {
  id: string;
  title: string;
  description: string;
  amount: string;
  currency: 'ARS' | 'SAT';
  quantity: string;
  limitPerBuyer: boolean;
  maxPerBuyer: string;
}

export function TicketsStep({ onNext, onBack }: TicketsStepProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<TicketType | null>(null);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<'ARS' | 'SAT' | 'USD'>('ARS');
  const [quantity, setQuantity] = useState('');
  const [isFree, setIsFree] = useState(true);
  const [isLimited, setIsLimited] = useState(false);

  const { toast } = useToast();
  const tickets = MOCK_EVENT.tickets;

  const handleOpenDialog = useCallback((ticket?: TicketType) => {
    if (ticket) {
      setEditingTicket(ticket);
      setTitle(ticket.title);
      setAmount(ticket.amount.toString());
      setIsFree(Number(ticket.amount) === 0);
      setCurrency(ticket.currency);
      setIsLimited(Number(ticket.quantity) !== -1);
      setQuantity(Number(ticket.quantity) !== -1 ? ticket.quantity.toString() : '');
    } else {
      // Modo creación
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
      try {
        if (editingTicket) {
          // TO-DO
          // UPDATE TICKET
        } else {
          // TO-DO
          // CREATE TICKET
        }

        setDialogOpen(false);
      } catch (err: any) {
        toast({
          title: 'Error',
          description: err?.message || 'Failed to save ticket',
          variant: 'destructive',
        });
      }
    },
    [editingTicket, title, amount, currency, isFree, isLimited, quantity, toast],
  );

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
          <Card className=''>
            <div className='p-6'>
              <div className='flex items-center justify-between gap-4'>
                <div className='flex items-center gap-2 w-full'>
                  <div className='w-32 h-8 bg-secondary border rounded-lg' />
                  <div className='w-16 h-4 bg-secondary border rounded-lg' />
                </div>
                <div className='hidden md:flex whitespace-nowrap'>
                  <div className='w-10 h-4 bg-secondary border rounded-lg' />
                </div>
                <div className='flex gap-2'>
                  <div className='w-10 h-10 bg-secondary border rounded-lg' />
                  <div className='w-10 h-10 bg-secondary border rounded-lg' />
                </div>
              </div>
            </div>
          </Card>
        )}

        <Card>
          {tickets?.length > 0 &&
            tickets?.map((ticket: any) => (
              <div className='border-b last:border-none' key={ticket.id}>
                <div className='p-6'>
                  <div className='flex items-center justify-between gap-4'>
                    <div className='flex items-center gap-2 w-full'>
                      <h3 className='text-lg font-semibold'>{ticket.title}</h3>
                      <p className='text-text-secondary'>
                        {ticket?.amount === 0 ? 'Gratis' : `$${ticket?.amount} ${ticket?.currency}`}
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
                      <Button variant='destructive' size='icon' onClick={() => null}>
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </Card>

        <StepNavigation onNext={onNext} onBack={onBack} nextLabel='Next' />
      </div>
    </OnboardingLayout>
  );
}
