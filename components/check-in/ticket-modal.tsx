'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

import { useToast } from '@/hooks/use-toast';
import { TicketDisplay } from './tickets-table';
import { formatNostrPubkey } from '@/lib/utils';

interface TicketModalProps {
  sale: TicketDisplay;
  onClose: () => void;
}

export function TicketModal({ sale, onClose }: TicketModalProps) {
  const { toast } = useToast();

  const [isCheckedIn, setIsCheckedIn] = useState(sale.isCheckedIn);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckIn = () => {
    if (isCheckedIn) return;

    setIsProcessing(true);
    setTimeout(() => {
      const success = true;

      if (success) {
        setIsCheckedIn(true);
        toast({
          title: 'Check-in exitoso',
          description: `Ticket ${sale.reference} ha sido registrado.`,
        });

        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        toast({
          title: 'Check-in fallido',
          description: 'Ticket inválido o ya utilizado.',
          variant: 'destructive',
        });
      }

      setIsProcessing(false);
    }, 800);
  };

  return (
    <div
      className='fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4'
      onClick={onClose}
    >
      <div
        className='w-full max-w-sm bg-secondary rounded-3xl overflow-hidden shadow-2xl'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className='flex justify-between items-center p-4 text-foreground'>
          <div className='w-8'></div>
          <h2 className='text-xl font-bold'>Ticket</h2>
          <button onClick={onClose} className='p-1 rounded-full hover:bg-primary-foreground/10'>
            <X size={24} />
          </button>
        </div>

        {/* Contenido */}
        <div className='bg-white rounded-t-3xl overflow-hidden'>
          <div className='p-6 pb-3'>
            <h3 className='text-2xl font-bold text-gray-800 mb-4'>{sale.eventTitle || 'Evento BitPass'}</h3>

            {/* Info del usuario y ticket - en columna */}
            <div className='flex flex-col gap-4'>
              <div>
                <p className='text-xs text-gray-500'>{sale.userEmail ? 'Email' : 'Nostr pubkey'}</p>
                <p className='text-sm font-semibold text-gray-800 truncate'>
                  {sale.userEmail ||
                    (sale.userPubkey
                      ? `${sale.userPubkey.substring(0, 8)}...${sale.userPubkey.substring(
                          sale.userPubkey.length - 8,
                        )}`
                      : 'Not available')}
                </p>
              </div>

              <div>
                <p className='text-xs text-gray-500'>Ticket Type</p>
                <p className='text-sm font-semibold text-gray-800'>{sale.ticketTitle.substring(0, 10)}</p>
              </div>

              <div>
                <p className='text-xs text-gray-500'>Ticket ID</p>
                <p className='text-sm font-semibold text-gray-800'>{sale.id}</p>
              </div>

              <div>
                <p className='text-xs text-gray-500'>State</p>
                <p className='text-sm font-semibold text-gray-800'>{isCheckedIn ? 'Used' : 'Valid'}</p>
              </div>
            </div>
          </div>

          {/* Línea perforada */}
          <div className='relative flex items-center h-4 mx-4'>
            <div className='absolute left-0 right-0 border-t-2 border-dashed border-gray-300'></div>
            <div className='absolute -left-8 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-background rounded-full'></div>
            <div className='absolute -right-8 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-background rounded-full'></div>
          </div>

          {/* Check-in */}
          <div className='p-6 pt-3 text-center'>
            <button
              onClick={handleCheckIn}
              disabled={isCheckedIn || isProcessing}
              className={`mt-4 w-full py-3 rounded-xl font-semibold transition-all ${
                isCheckedIn
                  ? 'text-green-600 bg-white'
                  : isProcessing
                  ? 'bg-gray-300 text-gray-600'
                  : 'bg-primary text-background hover:bg-primary/90'
              }`}
            >
              {isCheckedIn ? '✓ Check-in completed' : isProcessing ? 'Processing...' : 'Check-in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
