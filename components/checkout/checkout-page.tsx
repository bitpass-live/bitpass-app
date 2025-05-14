'use client';

import { useState } from 'react';
import Link from 'next/link';

import { EventInfo } from '@/components/event-info';
import { CheckoutForm } from '@/components/checkout-form';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';

import { DiscountCode } from '@/types';
import { useDraftEventContext } from '@/lib/draft-event-context';
import { useAuth } from '@/lib/auth-provider';

export default function CheckoutPage() {
  const { user, isAuthenticated } = useAuth();
  const { draftEvent } = useDraftEventContext();

  const [selectedTickets, setSelectedTickets] = useState<Record<string, number>>({});
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountCode | null>(null);

  const handleTicketChange = (ticketId: string, quantity: number) => {
    setSelectedTickets((prev) => ({
      ...prev,
      [ticketId]: quantity,
    }));
  };

  const handleDiscountValidated = (discountCode: DiscountCode | null) => {
    setAppliedDiscount(discountCode);
  };

  if (!draftEvent || !draftEvent.id) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <p>Event not found</p>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex flex-col'>
      {/* Main content */}
      <div className='flex-1 flex flex-col md:flex-row'>
        {/* Left side - Event info and tickets */}
        <div className='flex flex-col items-center w-full md:w-1/2 py-6 md:p-10 md:border-r bg-[#151515]'>
          <div className='w-full max-w-md mx-auto px-4'>
            <div className='flex items-center justify-between gap-2 w-full pb-4 border-b text-lg'>
              <div className='flex gap-2'>
                <Logo /> <span className='text-sm text-muted-foreground'>/ Ticketing</span>
              </div>
              {(user.loaded && !isAuthenticated) && 
              <Button variant='secondary' size='sm' asChild>
                <Link href='/login'>Sign in</Link>
              </Button>}
            </div>
            <EventInfo
              event={draftEvent}
              selectedTickets={selectedTickets}
              onTicketChange={handleTicketChange}
              onDiscountValidated={handleDiscountValidated}
            />
          </div>
        </div>

        {/* Right side - Checkout form */}
        <div className='flex flex-col items-center w-full md:w-1/2 py-6 md:p-10 bg-[#0A0A0A]'>
          <div className='w-full max-w-md mx-auto px-4'>
            <CheckoutForm selectedTickets={selectedTickets} appliedDiscount={appliedDiscount} />
          </div>
        </div>
      </div>
    </div>
  );
}
