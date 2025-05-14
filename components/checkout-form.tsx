'use client';

import type React from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useToast } from '@/hooks/use-toast';;

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LightningPayment } from '@/components/lightning-payment';
import { PaymentSuccess } from '@/components/payment-success';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { DiscountCode } from '@/types';
import { useDraftEventContext } from '@/lib/draft-event-context';

interface CheckoutFormProps {
  selectedTickets: Record<string, number>;
  appliedDiscount: DiscountCode | null;
}

// Definir los pasos del checkout
type CheckoutStep = 'form' | 'payment' | 'success';

// Simplificar el proceso de checkout
export function CheckoutForm({ selectedTickets, appliedDiscount }: CheckoutFormProps) {
  const [activeTab, setActiveTab] = useState('email');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nostrId, setNostrId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('form');
  const [saleId, setSaleId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'lightning' | 'mercadopago' | null>(null);

  const router = useRouter();
  const { toast } = useToast();

  const { draftEvent } = useDraftEventContext();

  if (!draftEvent || !draftEvent.id) return null;

  // Calculate total
  const ticketItems = Object.entries(selectedTickets)
    .map(([ticketId, quantity]) => {
      const ticket = draftEvent.ticketTypes.find((t) => t.id === ticketId);
      if (!ticket || quantity <= 0) return null;

      return {
        ticket,
        quantity,
        subtotal: ticket.price * quantity,
      };
    })
    .filter(Boolean) as { ticket: any; quantity: number; subtotal: number }[];

  const totalAmount = ticketItems.reduce((sum, item) => sum + item.subtotal, 0);
  const totalTickets = Object.values(selectedTickets).reduce((sum, qty) => sum + qty, 0);

  // Calcular el descuento
  const calculateDiscount = () => {};

  // Calcular el total con descuento
  const discountAmount = 0;
  const totalWithDiscount = totalAmount - discountAmount;

  const isFormValid = () => {
    if (totalTickets === 0) return false;

    if (activeTab === 'email') {
      return email.trim() !== '' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    } else {
      return nostrId.trim() !== '' && (nostrId.startsWith('npub1') || nostrId.includes('@'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) {
      toast({
        title: 'Error in the form',
        description: 'Please complete all required fields and select a payment method.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    // Create a sale for the first ticket (simplified)
    if (ticketItems.length > 0) {
      const firstItem = ticketItems[0];
      const buyer = activeTab === 'email' ? email : nostrId;

      // TO-DO
      // CREATE SALE
      const newSaleId = 'sale123'; // Simulación de ID de venta

      setSaleId(newSaleId);
      setIsSubmitting(false);

      setCurrentStep('payment');
    }
  };

  const handlePaymentSuccess = () => {
    if (saleId) {
      // TO-DO
      // COMPLETE SALE
      setCurrentStep('success');

      toast({
        title: 'Payment successful!',
        description: 'Your payment has been processed successfully.',
      });
    }
  };

  const handleViewTicket = () => {
    if (saleId) {
      router.push(`/events/${draftEvent.id}/ticket/${saleId}`);
    }
  };

  // Renderizar el paso actual
  if (currentStep === 'payment' && saleId) {
    return <LightningPayment amount={totalWithDiscount} onPaymentSuccess={handlePaymentSuccess} />;
  }

  if (currentStep === 'success' && saleId) {
    return <PaymentSuccess eventId={draftEvent.id} saleId={saleId} onViewTicket={handleViewTicket} />;
  }

  // Paso del formulario (por defecto)
  return (
    <div className='space-y-4'>
      <h2 className='text-xl font-semibold text-white'>Complete purchase</h2>

      <form onSubmit={handleSubmit} className='space-y-6'>
        <Tabs defaultValue='email' value={activeTab} onValueChange={setActiveTab}>
          <TabsList className='grid w-full grid-cols-2 mb-6'>
            <TabsTrigger value='email'>Email</TabsTrigger>
            <TabsTrigger value='nostr'>Nostr</TabsTrigger>
          </TabsList>

          <div className='space-y-4'>
            {/* Mostrar el campo de nombre solo cuando la pestaña Email está activa */}
            {activeTab === 'email' && (
              <div>
                <Label htmlFor='name' className='text-white'>
                  Name
                </Label>
                <Input
                  id='name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder='Your name'
                  className='bg-[#1A1A1A] border-border-gray text-white mt-2'
                />
              </div>
            )}

            <TabsContent value='email' className='space-y-4 mt-0 p-0'>
              <div>
                <Label htmlFor='email' className='text-white'>
                  Email (required)
                </Label>
                <Input
                  id='email'
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='your@email.com'
                  required={activeTab === 'email'}
                  className='bg-[#1A1A1A] border-border-gray text-white mt-2'
                />
              </div>
            </TabsContent>

            <TabsContent value='nostr' className='space-y-4 mt-0 p-0'>
              <div>
                <Label htmlFor='nostrId' className='text-white'>
                  Pubkey Nostr (required)
                </Label>
                <Input
                  id='nostrId'
                  value={nostrId}
                  onChange={(e) => setNostrId(e.target.value)}
                  placeholder='npub1... o your@lightning.address'
                  required={activeTab === 'nostr'}
                  className='bg-[#1A1A1A] border-border-gray text-white mt-2'
                />
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <Button size='lg' type='submit' className='w-full' disabled={isSubmitting || !isFormValid()}>
          {isSubmitting ? 'Processing...' : 'Continue to payment'}
        </Button>
      </form>
    </div>
  );
}
