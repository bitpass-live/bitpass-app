'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

import { useToast } from '@/hooks/use-toast';;

interface TicketModalProps {
  sale: any;
  onClose: () => void;
}

export function TicketModal({ sale, onClose }: TicketModalProps) {
  const { toast } = useToast();

  const [isCheckedIn, setIsCheckedIn] = useState(sale.checkIn);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckIn = () => {
    if (isCheckedIn) return;

    setIsProcessing(true);

    // Simular un pequeño retraso para la experiencia de usuario
    setTimeout(() => {
      // TO-DO
      // CHECKIN TICKET
      const success = true;

      if (success) {
        setIsCheckedIn(true);
        toast({
          title: 'Check-in exitoso',
          description: `Ticket ${sale.reference} ha sido registrado.`,
        });

        // Cerrar el modal después de un breve retraso para que el usuario vea el estado completado
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

  // Formatear la fecha para mostrarla en el ticket
  const formatDate = () => {
    const date = new Date();
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
  };

  // Formatear la hora para mostrarla en el ticket
  const formatTime = () => {
    const date = new Date();
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
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
        {/* Header con botón de cierre */}
        <div className='flex justify-between items-center p-4 text-foreground'>
          <div className='w-8'></div> {/* Espaciador para centrar el título */}
          <h2 className='text-xl font-bold'>Ticket</h2>
          <button onClick={onClose} className='p-1 rounded-full hover:bg-primary-foreground/10'>
            <X size={24} />
          </button>
        </div>

        {/* Contenido principal del ticket */}
        <div className='bg-white rounded-t-3xl overflow-hidden'>
          {/* Imagen del evento */}
          {/* <div className='h-32 bg-gray-200 overflow-hidden'>
            <img src='/community-event.png' alt='Event' className='w-full h-full object-cover' />
          </div> */}

          {/* Información del evento */}
          <div className='p-6 pb-3'>
            <h3 className='text-2xl font-bold text-gray-800'>{sale.eventTitle || 'Evento BitPass'}</h3>

            <div className='flex mt-4'>
              {/* Información del usuario */}
              <div className='flex flex-col gap-4 w-full'>
                {/* Nombre del usuario */}
                <div className='flex flex-col'>
                  <p className='text-xs text-gray-500'>Name</p>
                  <p className='text-sm font-semibold text-gray-800 truncate'>{sale.userName || 'Unnamed'}</p>
                </div>

                {/* Email o Pubkey/Lightning Address */}
                <div className='flex flex-col'>
                  <p className='text-xs text-gray-500'>{sale.userEmail ? 'Email' : 'ID'}</p>
                  <p className='text-sm font-semibold text-gray-800 truncate'>
                    {sale.userEmail ||
                      sale.lightningAddress ||
                      (sale.userPubkey
                        ? `${sale.userPubkey.substring(0, 8)}...${sale.userPubkey.substring(
                            sale.userPubkey.length - 8,
                          )}`
                        : 'Not available')}
                  </p>
                </div>
              </div>

              {/* Detalles del ticket en 3 columnas */}
              <div className='flex flex-col gap-4'>
                <div className='flex flex-col'>
                  <p className='text-xs text-gray-500'>Ref</p>
                  <p className='text-sm font-semibold text-gray-800'>{sale.reference.substring(0, 6)}</p>
                </div>
                <div className='flex flex-col'>
                  <p className='text-xs text-gray-500'>Ticket</p>
                  <p className='text-sm font-semibold text-gray-800'>{sale.ticketTitle.substring(0, 10)}</p>
                </div>
                <div className='flex flex-col'>
                  <p className='text-xs text-gray-500'>State</p>
                  <p className='text-sm font-semibold text-gray-800'>{isCheckedIn ? 'Used' : 'Valid'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Línea perforada */}
          <div className='relative flex items-center h-4 mx-4'>
            <div className='absolute left-0 right-0 border-t-2 border-dashed border-gray-300'></div>
            <div className='absolute -left-8 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-background rounded-full'></div>
            <div className='absolute -right-8 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-background rounded-full'></div>
          </div>

          {/* Sección de código de barras y check-in */}
          <div className='p-6 pt-3 text-center'>
            {/* Botón de check-in */}
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
