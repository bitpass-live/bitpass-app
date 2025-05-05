'use client';

import { useBitpassStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface PaymentSuccessProps {
  eventId: string;
  saleId: string;
  onViewTicket: () => void;
}

export function PaymentSuccess({ eventId, saleId, onViewTicket }: PaymentSuccessProps) {
  const event = useBitpassStore((state) => state.events.find((e) => e.id === eventId));
  const sale = useBitpassStore((state) => state.sales.find((s) => s.id === saleId));

  if (!event || !sale) return null;

  return (
    <div className='w-full max-w-md space-y-6'>
      <h2 className='text-xl font-semibold text-white'>Payment completed!</h2>

      <Card className='bg-[#151515] border-border-gray'>
        <CardContent className='p-6 flex flex-col items-center'>
          <div className='mb-6 text-center'>
            <div className='inline-flex items-center justify-center p-2 bg-green-100 rounded-full mb-4'>
              <CheckCircle className='h-12 w-12 text-green-600' />
            </div>
            <h3 className='text-xl font-bold text-white mb-2'>Thank you for your purchase!</h3>
            <p className='text-muted-foreground'>
              Your payment has been processed successfully and your tickets are ready.
            </p>
          </div>

          <div className='w-full space-y-4 mb-6'>
            <div className='flex justify-between text-sm'>
              <span className='text-muted-foreground'>Event:</span>
              <span className='text-white font-medium'>{event.title}</span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-muted-foreground'>Ticket:</span>
              <span className='text-white font-medium'>{sale.ticketTitle}</span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-muted-foreground'>Quantity:</span>
              <span className='text-white font-medium'>{sale.quantity}</span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-muted-foreground'>Ref:</span>
              <span className='text-white font-medium'>{sale.reference}</span>
            </div>
          </div>

          {/* <Button
            onClick={onViewTicket}
            className='w-full bg-fluorescent-yellow hover:bg-fluorescent-yellow-hover text-dark-gray'
          >
            Ver mi ticket
          </Button> */}
        </CardContent>
      </Card>

      <div className='text-sm text-muted-foreground text-center'>
        <p>Save your ticket to present at the event.</p>
        <p>We have also sent the details to your email.</p>
      </div>
    </div>
  );
}
