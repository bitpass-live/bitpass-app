'use client';

import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { useYadio } from '@/lib/yadio-context';
import { useCheckoutSummary } from '@/hooks/use-checkout-summary';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth-provider';
import type { DiscountCode } from '@/lib/bitpass-sdk/src/types/discount';
import { Ticket } from '@/lib/bitpass-sdk/src/types/ticket';

interface LightningPaymentProps {
  orderId: string;
  invoice: string;
  selectedTickets: Record<string, number>;
  appliedDiscount: DiscountCode | null;
  onPaymentSuccess: (tickets: Ticket[]) => void;
  onPaymentFailed: () => void;
}

export function LightningPayment({
  orderId,
  invoice,
  selectedTickets,
  appliedDiscount,
  onPaymentSuccess,
  onPaymentFailed,
}: LightningPaymentProps) {
  const [timeLeft, setTimeLeft] = useState(600);
  const [satsValue, setSatsValue] = useState<number | null>(null);
  const { bitpassAPI } = useAuth();
  const { toast } = useToast();

  const converter = useYadio();
  const { displayTotal, displayCurrency } = useCheckoutSummary(selectedTickets, appliedDiscount);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const convert = async () => {
      if (!displayTotal || !displayCurrency) return;

      try {
        if (displayCurrency === 'SAT') {
          setSatsValue(displayTotal);
        } else {
          const btc = await converter.convertCurrency({
            amount: displayTotal,
            from: displayCurrency,
            to: 'BTC',
          });
          setSatsValue(Math.round(btc * 100_000_000));
        }
      } catch {
        setSatsValue(null);
      }
    };

    convert();
  }, [displayTotal, displayCurrency]);

  useEffect(() => {
    if (!orderId) return;

    const interval = setInterval(async () => {
      try {
        const data = await bitpassAPI.getOrderStatus(orderId);

        if (data.status === 'PAID') {
          clearInterval(interval);
          onPaymentSuccess(data.tickets ?? []);
        }

        if (data.status === 'EXPIRED') {
          clearInterval(interval);
          toast({
            title: 'Payment expired',
            description: 'The invoice expired. Please try again.',
            variant: 'destructive',
          });
          onPaymentFailed();
        }
      } catch (err: any) {
        clearInterval(interval);
        console.error('Payment status check failed:', err);
        toast({
          title: 'Error checking payment',
          description: err.message ?? 'Please try again later.',
          variant: 'destructive',
        });
        onPaymentFailed();
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [orderId, onPaymentSuccess, onPaymentFailed, toast, bitpassAPI]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className='w-full max-w-md space-y-6'>
      <h2 className='text-xl font-semibold text-white'>Pay with Lightning Network</h2>

      <Card className='bg-[#151515] border-border-gray'>
        <CardContent className='p-6 flex flex-col items-center'>
          <div className='mb-4 text-center'>
            <p className='text-sm text-muted-foreground mb-1'>Time remaining to pay</p>
            <p className='text-xl font-mono font-bold text-white'>{formatTime(timeLeft)}</p>
          </div>

          <div className='bg-white p-4 rounded-lg mb-4'>
            <QRCodeSVG value={invoice} size={200} />
          </div>

          <div className='text-center mb-6'>
            {displayTotal !== null && (
              <p className='text-lg font-bold text-white mb-1'>
                {formatCurrency(displayTotal, displayCurrency)} {displayCurrency}
              </p>
            )}
            {satsValue !== null && (
              <p className='text-sm text-muted-foreground'>≈ {satsValue.toLocaleString()} sats</p>
            )}
          </div>

          <Button
            variant='outline'
            className='w-full border-border-gray text-white'
            onClick={() => navigator.clipboard.writeText(invoice)}
          >
            Copy invoice
          </Button>
        </CardContent>
      </Card>

      <div className='text-sm text-muted-foreground text-center'>
        <p>Scan the QR code with your Lightning Network wallet</p>
        <p>or copy the invoice to pay from your app.</p>
      </div>
    </div>
  );
}
