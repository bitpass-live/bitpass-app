'use client';

import type React from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBitpassStore, type DiscountCode } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { LightningPayment } from '@/components/lightning-payment';
import { PaymentSuccess } from '@/components/payment-success';
import { Zap, CreditCard } from 'lucide-react';

interface CheckoutFormProps {
  eventId: string;
  selectedTickets: Record<string, number>;
  appliedDiscount: DiscountCode | null;
}

// Definir los pasos del checkout
type CheckoutStep = 'form' | 'payment' | 'success';

// Simplificar el proceso de checkout
export function CheckoutForm({ eventId, selectedTickets, appliedDiscount }: CheckoutFormProps) {
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

  const event = useBitpassStore((state) => state.events.find((e) => e.id === eventId));
  const createSale = useBitpassStore((state) => state.createSale);
  const completeSale = useBitpassStore((state) => state.completeSale);
  const applyDiscountCode = useBitpassStore((state) => state.applyDiscountCode);

  if (!event) return null;

  // Calculate total
  const ticketItems = Object.entries(selectedTickets)
    .map(([ticketId, quantity]) => {
      const ticket = event.tickets.find((t) => t.id === ticketId);
      if (!ticket || quantity <= 0) return null;

      return {
        ticket,
        quantity,
        subtotal: ticket.amount * quantity,
      };
    })
    .filter(Boolean) as { ticket: any; quantity: number; subtotal: number }[];

  const totalAmount = ticketItems.reduce((sum, item) => sum + item.subtotal, 0);
  const totalTickets = Object.values(selectedTickets).reduce((sum, qty) => sum + qty, 0);

  // Calcular el descuento
  const calculateDiscount = () => {
    if (!appliedDiscount) return 0;

    if (appliedDiscount.discountType === 'PERCENTAGE') {
      return Math.round((totalAmount * appliedDiscount.value) / 100);
    } else {
      return Math.min(appliedDiscount.value, totalAmount); // El descuento no puede ser mayor que el total
    }
  };

  // Calcular el total con descuento
  const discountAmount = appliedDiscount ? calculateDiscount() : 0;
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

      const newSaleId = createSale({
        buyer,
        eventId,
        ticketId: firstItem.ticket.id,
        ticketTitle: firstItem.ticket.title,
        quantity: firstItem.quantity,
        amount: totalWithDiscount, // Usar el total con descuento
        currency: 'ARS',
        reference: '',
      });

      // Si hay un código de descuento aplicado, incrementar su contador de uso
      if (appliedDiscount) {
        applyDiscountCode(appliedDiscount.id);
      }

      setSaleId(newSaleId);
      setIsSubmitting(false);

      setCurrentStep('payment');
    }
  };

  const handlePaymentSuccess = () => {
    if (saleId) {
      completeSale(saleId);
      setCurrentStep('success');

      toast({
        title: 'Payment successful!',
        description: 'Your payment has been processed successfully.',
      });
    }
  };

  const handleViewTicket = () => {
    if (saleId) {
      router.push(`/events/${eventId}/ticket/${saleId}`);
    }
  };

  // Renderizar el paso actual
  if (currentStep === 'payment' && saleId) {
    return <LightningPayment amount={totalWithDiscount} onPaymentSuccess={handlePaymentSuccess} />;
  }

  if (currentStep === 'success' && saleId) {
    return <PaymentSuccess eventId={eventId} saleId={saleId} onViewTicket={handleViewTicket} />;
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

        <Button
          type='submit'
          className='w-full bg-fluorescent-yellow hover:bg-fluorescent-yellow-hover text-dark-gray rounded-xl py-6 text-lg font-medium'
          disabled={isSubmitting || !isFormValid()}
        >
          {isSubmitting ? 'Processing...' : 'Continue to payment'}
        </Button>
      </form>
    </div>
  );
}
