'use client';

import { useState } from 'react';
import Link from 'next/link';

import { useDraftEventContext } from '@/lib/draft-event-context';
import { useAuth } from '@/lib/auth-provider';

import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { EventInfo } from '@/components/event-info';
import { CheckoutForm } from '@/components/checkout/checkout-form';

import { DiscountCode } from '@/lib/bitpass-sdk/src/types/discount';

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const { draftEvent } = useDraftEventContext();

  const [isLocked, setIsLocked] = useState(false);
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

  if (!draftEvent) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <p>Loading event...</p>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex flex-col'>
      {/* Main content */}
      <div className='flex-1 flex flex-col md:flex-row'>
        {/* Left side - Event info and tickets */}
        <div className='flex flex-col items-center w-full md:w-1/2 py-6 md:p-10 border-b md:border-b-0 md:border-r bg-card'>
          <div className='w-full max-w-md mx-auto px-4'>
            <div className='flex items-center justify-between gap-2 w-full pb-4 border-b text-lg'>
              <div className='flex gap-2'>
                <Logo /> <span className='text-sm text-muted-foreground'>/ Ticketing</span>
              </div>
              {user.loaded && isAuthenticated && (
                <div className='flex gap-2'>
                  {draftEvent?.creatorId === user.id && (
                    <Button variant='secondary' size='sm' asChild>
                      <Link href='/admin'>Admin panel</Link>
                    </Button>
                  )}
                  <Button variant='secondary' size='sm' asChild>
                    <Link href='/tickets'>My tickets</Link>
                  </Button>
                </div>
              )}
            </div>
            <EventInfo
              event={draftEvent!}
              selectedTickets={selectedTickets}
              onTicketChange={handleTicketChange}
              onDiscountValidated={handleDiscountValidated}
              isLocked={isLocked}
            />
          </div>
        </div>

        {/* Right side - Checkout form */}
        <div className='flex flex-col items-center w-full md:w-1/2 py-6 md:p-10'>
          <div className='w-full max-w-md mx-auto px-4'>
            <CheckoutForm
              selectedTickets={selectedTickets}
              appliedDiscount={appliedDiscount}
              onLockChange={setIsLocked}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
