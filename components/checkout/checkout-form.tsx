import type React from 'react';
import { useState } from 'react';

import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { LightningPayment } from '@/components/lightning-payment';
import { PaymentSuccess } from '@/components/payment-success';
import { useDraftEventContext } from '@/lib/draft-event-context';
import { useAuth } from '@/lib/auth-provider';
import { LoginForm } from '../login-form';
import { DiscountCode } from '@/lib/bitpass-sdk/src/types/discount';
import { useCheckoutSummary } from '@/hooks/use-checkout-summary';
import { Ticket } from '@/lib/bitpass-sdk/src/types/ticket';
import { formatCurrency } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';

interface CheckoutFormProps {
  selectedTickets: Record<string, number>;
  appliedDiscount: DiscountCode | null;
  onLockChange: (locked: boolean) => void;
}

type CheckoutStep = 'form' | 'payment' | 'success';

export function CheckoutForm({ selectedTickets, appliedDiscount, onLockChange }: CheckoutFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('form');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [lnInvoice, setLnInvoice] = useState<string | null>(null);
  const [tickets, setTickets] = useState<Ticket[] | null>(null);
  // Component state
  const [activeTab, setActiveTab] = useState('email');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nostrId, setNostrId] = useState('');

  const { toast } = useToast();
  const { paymentMethods, bitpassAPI } = useAuth();
  const { draftEvent } = useDraftEventContext();

  if (!draftEvent?.id) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        eventId: draftEvent.id,
        ticketTypes: Object.entries(selectedTickets)
          .filter(([_, qty]) => qty > 0)
          .map(([ticketTypeId, quantity]) => ({ ticketTypeId, quantity })),
        discountCode: appliedDiscount?.code,
        paymentMethodId: paymentMethods?.[0]?.id,
      };

      const order = await bitpassAPI.createOrder(payload);

      setOrderId(order.orderId);
      setLnInvoice(order.lnInvoice);
      setCurrentStep('payment');
      onLockChange(true);
    } catch (err: any) {
      toast({
        title: 'Error creating order',
        description: err.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelOrder = () => {
    setOrderId(null);
    setLnInvoice(null);
    setTickets(null);
    setCurrentStep('form');
    onLockChange(false);
  };

  const handlePaymentSuccess = (tickets: Ticket[]) => {
    setTickets(tickets);
    setCurrentStep('success');
    toast({
      title: 'Payment successful!',
      description: 'Your tickets are ready.',
    });
  };

  const handlePaymentFailed = () => {
    toast({
      title: 'Payment failed or expired',
      description: 'Please try again and complete the payment on time.',
      variant: 'destructive',
    });

    // Reset state
    setOrderId(null);
    setLnInvoice(null);
    setTickets(null);
    setCurrentStep('form');
  };

  if (currentStep === 'payment' && orderId && lnInvoice) {
    return (
      <LightningPayment
        orderId={orderId}
        invoice={lnInvoice}
        selectedTickets={selectedTickets}
        appliedDiscount={appliedDiscount}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentFailed={handlePaymentFailed}
        onCancelOrder={handleCancelOrder}
      />
    );
  }

  if (currentStep === 'success' && tickets) {
    return <PaymentSuccess tickets={tickets} />;
  }

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
              <Input
                id='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='Your Name (optional)'
              />
            )}

            <TabsContent value='email' className='space-y-4 mt-0 p-0'>
              <Input
                id='email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='your@email.com'
                required={activeTab === 'email'}
              />
            </TabsContent>

            <TabsContent value='nostr' className='space-y-4 mt-0 p-0'>
              <Input
                id='nostrId'
                value={nostrId}
                onChange={(e) => setNostrId(e.target.value)}
                placeholder='Pubkey, npub... or NIP-05'
                required={activeTab === 'nostr'}
              />
            </TabsContent>
          </div>
        </Tabs>

        <Button
          className='w-full'
          size='lg'
          type='submit'
          disabled={isSubmitting || Object.entries(selectedTickets).filter(([_, qty]) => qty > 0).length === 0}
        >
          {isSubmitting ? 'Processing...' : 'Continue to Payment'}
        </Button>
      </form>
    </div>
  );
}
