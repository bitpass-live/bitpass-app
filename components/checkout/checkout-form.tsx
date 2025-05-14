import type React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

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

interface CheckoutFormProps {
  selectedTickets: Record<string, number>;
  appliedDiscount: DiscountCode | null;
}

type CheckoutStep = 'form' | 'payment' | 'success';

export function CheckoutForm({ selectedTickets, appliedDiscount }: CheckoutFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('form');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [lnInvoice, setLnInvoice] = useState<string | null>(null);

  const { displayTotal, displayDiscount, displayCurrency } = useCheckoutSummary(selectedTickets, appliedDiscount);

  const router = useRouter();
  const { toast } = useToast();
  const { user, isAuthenticated, paymentMethods, bitpassAPI } = useAuth();
  const { draftEvent } = useDraftEventContext();

  if (!draftEvent?.id) return null;

  const totalTickets = Object.values(selectedTickets).reduce((sum, qty) => sum + qty, 0);
  const isFormValid = () => isAuthenticated && totalTickets > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;

    try {
      setIsSubmitting(true);

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

  const handlePaymentSuccess = () => {
    setCurrentStep('success');
    toast({
      title: 'Payment successful!',
      description: 'Your payment has been processed successfully.',
    });
  };

  const handleViewTicket = () => {
    if (orderId) {
      router.push(`/events/${draftEvent.id}/ticket/${orderId}`);
    }
  };

  if (currentStep === 'payment' && lnInvoice && displayTotal && displayCurrency) {
    return <LightningPayment invoice={lnInvoice} selectedTickets={selectedTickets} appliedDiscount={appliedDiscount} onPaymentSuccess={handlePaymentSuccess} />;
  }

  if (currentStep === 'success' && orderId) {
    return <PaymentSuccess eventId={draftEvent.id} saleId={orderId} onViewTicket={handleViewTicket} />;
  }

  return (
    <div className='space-y-4'>
      <h2 className='text-xl font-semibold text-white'>Complete purchase</h2>

      {!isAuthenticated ? (
        <LoginForm />
      ) : (
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='space-y-4'>
            <Label className='text-white'>Logged in with {user.authMethod}</Label>
            <p>{user.authMethod === 'email' ? user.email : user.nostrPubKey}</p>

            {displayTotal !== null && (
              <div className='text-sm text-muted-foreground'>
                {displayDiscount > 0 && (
                  <p>
                    Discount applied: <span className='font-semibold'>-${displayDiscount}</span>
                  </p>
                )}
                <p>
                  Total estimated:{' '}
                  <span className='font-semibold'>${displayTotal}</span>{' '}
                  ({displayCurrency})
                </p>
              </div>
            )}

            <Button
              size='lg'
              type='submit'
              className='w-full'
              disabled={isSubmitting || !isFormValid()}
            >
              {isSubmitting ? 'Processing...' : 'Continue to payment'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}