'use client';

import { useState } from 'react';
import type { Event, DiscountCode } from '@/lib/store';
import { formatCurrency, formatDate } from '@/lib/utils';
import { CalendarIcon, MapPinIcon, MinusIcon, PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useBitpassStore } from '@/lib/store';

interface EventInfoProps {
  event: Event;
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
  const validateDiscountCode = useBitpassStore((state) => state.validateDiscountCode);

  const handleDecrement = (ticketId: string) => {
    const currentQuantity = selectedTickets[ticketId] || 0;
    if (currentQuantity > 0) {
      onTicketChange(ticketId, currentQuantity - 1);
    }
  };

  const handleIncrement = (ticketId: string) => {
    const ticket = event.tickets.find((t) => t.id === ticketId);
    if (!ticket) return;

    const currentQuantity = selectedTickets[ticketId] || 0;
    const availableQuantity = ticket.quantity - (ticket.sold || 0);

    if (currentQuantity < availableQuantity) {
      onTicketChange(ticketId, currentQuantity + 1);
    }
  };

  // Calcular el total de tickets y el monto total
  const ticketItems = Object.entries(selectedTickets)
    .map(([ticketId, quantity]) => {
      const ticket = event.tickets.find((t) => t.id === ticketId);
      if (!ticket || quantity <= 0) return null;

      return {
        ticket,
        quantity,
        subtotal: ticket.amount * quantity,
      };
    })
    .filter(Boolean) as { ticket: any; quantity: number; subtotal: number }[];

  const totalAmount = ticketItems.reduce((sum, item) => sum + item.subtotal, 0);
  const totalTickets = Object.values(selectedTickets).reduce((sum, qty) => sum + qty, 0);

  // Obtener códigos de descuento activos
  const allDiscountCodes = useBitpassStore((state) => state.discountCodes);
  const activeDiscountCodes = allDiscountCodes.filter(
    (dc) => dc.eventId === event.id && dc.active && (!dc.maxUses || dc.used < dc.maxUses),
  );

  // Función para validar el código de descuento
  const handleValidateCode = () => {
    if (!code.trim()) {
      setDiscountMessage({
        type: 'error',
        message: 'Please enter a discount code',
      });
      return;
    }

    // Obtener los IDs de los tickets seleccionados
    const selectedTicketIds = Object.keys(selectedTickets).filter((ticketId) => selectedTickets[ticketId] > 0);

    const result = validateDiscountCode(code.trim().toUpperCase(), event.id, selectedTicketIds);

    if (result.valid && result.discountCode) {
      setValidatedCode(result.discountCode);
      onDiscountValidated(result.discountCode);
      setDiscountMessage({
        type: 'success',
        message: `Applied code: ${
          result.discountCode.discountType === 'PERCENTAGE'
            ? `${result.discountCode.value}% discount`
            : `$${result.discountCode.value} discount`
        }`,
      });
    } else {
      setValidatedCode(null);
      onDiscountValidated(null);
      setDiscountMessage({
        type: 'error',
        message: result.message || 'Invalid discount code',
      });
    }
  };

  // Calcular el descuento
  const calculateDiscount = () => {
    if (!validatedCode) return 0;

    if (validatedCode.discountType === 'PERCENTAGE') {
      return Math.round((totalAmount * validatedCode.value) / 100);
    } else {
      return Math.min(validatedCode.value, totalAmount); // El descuento no puede ser mayor que el total
    }
  };

  // Calcular el total con descuento
  const discountAmount = validatedCode ? calculateDiscount() : 0;
  const totalWithDiscount = totalAmount - discountAmount;

  // Verificar si todos los tickets seleccionados son gratuitos
  const hasOnlyFreeTickets = ticketItems.length > 0 && ticketItems.every((item) => item.ticket.amount === 0);

  return (
    <div className='space-y-4'>
      {/* Event info */}
      <div className='border-border-gray py-6'>
        <h1 className='text-2xl font-bold text-white mb-4'>{event.title}</h1>

        <div className='flex flex-col gap-2 text-sm text-muted-foreground mb-4'>
          <div className='flex items-center gap-1'>
            <CalendarIcon className='h-4 w-4' />
            <span>{formatDate(event.start)}</span>
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

        {event.tickets.map((ticket) => {
          const availableQuantity = ticket.quantity - (ticket.sold || 0);
          const isAvailable = availableQuantity > 0;
          const quantity = selectedTickets[ticket.id] || 0;
          const isFreeTicket = ticket.amount === 0;

          return (
            <Card key={ticket.id} className='bg-[#0A0A0A] border-border-gray'>
              <CardContent
                className={`p-6 flex items-center justify-between ${
                  quantity === 0 && isAvailable ? 'cursor-pointer' : ''
                }`}
                onClick={() => {
                  // Solo permitir clics si hay tickets disponibles
                  if (!isAvailable) return;

                  // Para tickets gratuitos, simplemente establecer la cantidad en 1
                  if (isFreeTicket && quantity === 0) {
                    onTicketChange(ticket.id, 1);
                    return;
                  }

                  // Solo incrementar al hacer clic en la card si la cantidad es 0
                  if (quantity === 0) {
                    handleIncrement(ticket.id);
                  }
                }}
              >
                <div>
                  <h3 className='font-medium text-white'>{ticket.title}</h3>
                  <p className={`${!isAvailable ? 'text-muted-foreground' : 'text-fluorescent-yellow'}`}>
                    {ticket.amount === 0 ? 'Gratis' : formatCurrency(ticket.amount, ticket.currency)}
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
                          e.stopPropagation(); // Evitar que el clic se propague a la card
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
      {!hasOnlyFreeTickets && ticketItems.length > 0 && (
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
      )}
    </div>
  );
}
