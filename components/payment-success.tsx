'use client';

import { CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { Ticket } from '@/lib/bitpass-sdk/src/types/ticket';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface PaymentSuccessProps {
  tickets: Ticket[];
}

export function PaymentSuccess({ tickets }: PaymentSuccessProps) {
  const router = useRouter();
  
  if (!tickets || tickets.length === 0) return null;

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
            {tickets.map((ticket, index) => (
              <div key={ticket.id} className='flex justify-between text-sm border-b border-border-gray py-1'>
                <span className='text-muted-foreground'>Ticket #{index + 1}:</span>
                <span className='text-white font-medium'>{ticket.ticketTypeId}</span>
              </div>
            ))}
          </div>

          <Button
            onClick={() => router.push(`/tickets`)}
            className='w-full bg-fluorescent-yellow hover:bg-fluorescent-yellow-hover text-dark-gray'
          >
            View My Tickets
          </Button>
        </CardContent>
      </Card>

      <div className='text-sm text-muted-foreground text-center'>
        <p>Save your ticket to present at the event.</p>
        <p>We have also sent the details to your email.</p>
      </div>
    </div>
  );
}
