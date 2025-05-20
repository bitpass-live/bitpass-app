'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

import type { Ticket } from '@/lib/bitpass-sdk/src/types/ticket';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import animationCheck from './animations/check.json';

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
        <CardContent className='p-6 flex flex-col items-center gap-1'>
          <div className='mb-6 text-center'>
            <div className='max-w-32 max-h-32 mx-auto'>
              <Lottie animationData={animationCheck} loop={false} />
            </div>
            <h3 className='text-xl font-bold text-white mb-2'>Thank!</h3>
            <p className='text-muted-foreground'>
              Your payment has been processed successfully and your tickets are ready.
            </p>
          </div>

          <div className='w-full space-y-4 mb-6'>
            {tickets.map((ticket, index) => (
              <div key={ticket.id} className='flex flex-col justify-between text-sm border-b border-border-gray pb-2'>
                <span className='text-muted-foreground'>Ticket #{index + 1}:</span>
                <span className='text-white font-medium'>{ticket.id}</span>
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
