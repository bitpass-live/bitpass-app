'use client';

import { useState } from 'react';
import { useBitpassStore, type DiscountCode } from '@/lib/store';
import { EventInfo } from '@/components/event-info';
import { CheckoutForm } from '@/components/checkout-form';

export default function HomePage() {
  // ID del evento hardcodeado para la demo
  const eventId = 'event123';

  const [selectedTickets, setSelectedTickets] = useState<Record<string, number>>({});
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountCode | null>(null);

  const event = useBitpassStore((state) => state.events.find((e) => e.id === eventId));

  const handleTicketChange = (ticketId: string, quantity: number) => {
    setSelectedTickets((prev) => ({
      ...prev,
      [ticketId]: quantity,
    }));
  };

  const handleDiscountValidated = (discountCode: DiscountCode | null) => {
    setAppliedDiscount(discountCode);
  };

  if (!event) {
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
        <div className='flex justify-center w-full md:w-1/2 p-6 md:p-10 md:border-r bg-[#151515]'>
          <EventInfo
            event={event}
            selectedTickets={selectedTickets}
            onTicketChange={handleTicketChange}
            onDiscountValidated={handleDiscountValidated}
          />
        </div>

        {/* Right side - Checkout form */}
        <div className='flex justify-center w-full md:w-1/2 p-6 md:p-10 bg-[#0A0A0A]'>
          <CheckoutForm eventId={eventId} selectedTickets={selectedTickets} appliedDiscount={appliedDiscount} />
        </div>
      </div>
    </div>
  );
}
