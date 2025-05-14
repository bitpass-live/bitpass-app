'use client';

import { useState } from 'react';
import { CalendarIcon, MapPinIcon, MinusIcon, PlusIcon } from 'lucide-react';

import { formatCurrency, formatDate } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DiscountCode } from '@/types';
import { FullEvent } from '@/lib/bitpass-sdk/src/types/event';

interface EventInfoProps {
  event: FullEvent;
  selectedTickets: Record<string, number>;
  onTicketChange: (ticketId: string, quantity: number) => void;
  onDiscountValidated: (code: DiscountCode | null) => void;
}

// Mejorar la presentación de la información del evento
export function EventInfo({ event, selectedTickets, onTicketChange, onDiscountValidated }: EventInfoProps) {
  // Estado para el código de descuento
  const [code, setCode] = useState('');
  const [validatedCode, setValidatedCode] = useState<DiscountCode | null>(null);
  const [discountMessage, setDiscountMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showCouponInput, setShowCouponInput] = useState(false);

  // Obtener la función de validación de códigos de descuento
  //TO-DO

  const handleIncrement = (ticketId: string) => {
    const currentQuantity = selectedTickets[ticketId] || 0;
    onTicketChange(ticketId, currentQuantity + 1);
  };

  const handleDecrement = (ticketId: string) => {
    const currentQuantity = selectedTickets[ticketId] || 0;
    if (currentQuantity > 0) {
      onTicketChange(ticketId, currentQuantity - 1);
    }
  };

  const totalAmount = event.ticketTypes.reduce((total, ticket) => {
    const quantity = selectedTickets[ticket.id] || 0;
    return total + ticket.price * quantity;
  }, 0);

  const totalTickets = Object.values(selectedTickets).reduce((sum, q) => sum + q, 0);

  // Función para validar el código de descuento
  const handleValidateCode = () => {
    if (!code.trim()) {
      setDiscountMessage({
        type: 'error',
        message: 'Please enter a discount code',
      });
      return;
    }

    setValidatedCode(null);
    onDiscountValidated(null);
    setDiscountMessage({
      type: 'error',
      message: 'Invalid discount code',
    });
  };

  const calculateDiscount = () => {
    if (!validatedCode) return 0;

    if (validatedCode.discountType === 'PERCENTAGE') {
      return (totalAmount * validatedCode.value) / 100;
    }

    return Math.min(validatedCode.value, totalAmount);
  };

  const discountAmount = calculateDiscount();
  const totalWithDiscount = totalAmount - discountAmount;

  return (
    <div className='space-y-4'>
      {/* Event info */}
      <div className='border-border-gray py-6'>
        <h1 className='text-2xl font-bold text-white mb-4'>{event.title}</h1>

        <div className='flex flex-col gap-2 text-sm text-muted-foreground mb-4'>
          <div className='flex items-center gap-1'>
            <CalendarIcon className='h-4 w-4' />
            <span>{formatDate(event.startsAt)}</span>
          </div>
          <div className='flex items-center gap-1'>
            <MapPinIcon className='h-4 w-4' />
            <span>{event.location}</span>
          </div>
        </div>

        <p className='text-text-secondary'>{event.description}</p>
      </div>

      {/* Tickets */}
      <div className='space-y-2'>
        <h2 className='text-xl font-semibold text-white'>Tickets</h2>

        {event.ticketTypes.map((ticket) => {
          const availableQuantity = ticket.quantity - (ticket.soldCount);
          const isAvailable = availableQuantity > 0;
          const quantity = selectedTickets[ticket.id] || 0;
          const isFreeTicket = ticket.price === 0;

          return (
            <Card key={ticket.id} className='bg-[#0A0A0A] border-border-gray'>
              <CardContent
                className={`p-6 flex items-center justify-between ${quantity === 0 && isAvailable ? 'cursor-pointer' : ''
                  }`}
                onClick={() => {
                  if (!isAvailable) return;

                  if (isFreeTicket && quantity === 0) {
                    onTicketChange(ticket.id, 1);
                    return;
                  }

                  if (quantity === 0) {
                    handleIncrement(ticket.id);
                  }
                }}
              >
                <div>
                  <h3 className='font-medium text-white'>{ticket.name}</h3>
                  <p className={`${!isAvailable ? 'text-muted-foreground' : 'text-fluorescent-yellow'}`}>
                    {ticket.price === 0 ? 'Gratis' : formatCurrency(ticket.price, ticket.currency)}
                  </p>
                  {ticket.quantity !== -1 && (
                    <p className='text-xs text-muted-foreground'>
                      {isAvailable ? `${availableQuantity} disponibles` : 'Sold out'}
                    </p>
                  )}
                </div>

                <div className='flex items-center gap-2'>
                  {quantity > 0 && !isFreeTicket && (
                    <>
                      <Button
                        variant='outline'
                        size='icon'
                        className='h-8 w-8 rounded-full border-border-gray'
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDecrement(ticket.id);
                        }}
                        disabled={quantity === 0}
                      >
                        <MinusIcon className='h-3 w-3' />
                      </Button>

                      <span className='w-6 text-center text-white'>{quantity}</span>
                    </>
                  )}

                  {quantity > 0 && isFreeTicket && <span className='w-6 text-center text-white'>1</span>}

                  {(!isFreeTicket || quantity === 0) && isAvailable && (
                    <Button
                      variant='outline'
                      size='icon'
                      className='h-8 w-8 rounded-full border-border-gray'
                      onClick={(e) => {
                        e.stopPropagation(); // Evitar que el clic se propague a la card
                        if (isFreeTicket) {
                          onTicketChange(ticket.id, 1);
                        } else {
                          handleIncrement(ticket.id);
                        }
                      }}
                      disabled={!isAvailable || quantity >= availableQuantity || (isFreeTicket && quantity === 1)}
                    >
                      <PlusIcon className='h-3 w-3' />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Resumen de precios - solo mostrar si hay tickets pagos */}
      <div className='mt-6 px-4'>
        <div className='flex justify-between text-sm mb-2'>
          <span className='text-white'>Subtotal:</span>
          <span className='text-white'>${totalAmount.toLocaleString()}</span>
        </div>

        {!validatedCode ? (
          <>
            {showCouponInput ? (
              <div className='flex gap-2 mt-2'>
                <Input
                  id='discount-code'
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder='Enter your code'
                  className='bg-[#1A1A1A] border-border-gray text-white'
                />
                <Button type='button' variant='outline' onClick={handleValidateCode} disabled={!code.trim()}>
                  Apply
                </Button>
              </div>
            ) : (
              <Button
                variant='link'
                className='p-0 h-auto text-fluorescent-yellow'
                onClick={() => setShowCouponInput(true)}
              >
                Add coupon
              </Button>
            )}
          </>
        ) : (
          <div className='flex justify-between items-center text-sm mb-2'>
            <div className='flex flex-col'>
              <span className='text-fluorescent-yellow'>Discount ({validatedCode.code}):</span>
              <p className='text-sm text-green-500'>
                {validatedCode.discountType === 'PERCENTAGE'
                  ? `${validatedCode.value}% discount`
                  : `$${validatedCode.value} discount`}
              </p>
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-fluorescent-yellow'>-${discountAmount.toLocaleString()}</span>
              {/* <Button
                  variant='ghost'
                  size='sm'
                  className='h-6 px-2 text-xs'
                  onClick={() => {
                    setValidatedCode(null);
                    onDiscountValidated(null);
                    setCode('');
                  }}
                >
                  Delete
                </Button> */}
            </div>
          </div>
        )}

        <div className='flex justify-between text-base font-medium mt-2 pt-2 border-t border-border-gray'>
          <span className='text-white'>Total to pay:</span>
          <span className='text-white'>${(validatedCode ? totalWithDiscount : totalAmount).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
