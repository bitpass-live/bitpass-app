'use client';

import { useState } from 'react';

import { useToast } from '@/hooks/use-toast';;
import { MOCK_SALES } from '@/mock/data';

export interface CheckInResult {
  success: boolean;
  message: string;
  reference?: string;
}

export function useCheckIn() {
  const { toast } = useToast();

  const [reference, setReference] = useState('');
  const [lastResult, setLastResult] = useState<CheckInResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const sales = MOCK_SALES;

  // Función para verificar si un ticket existe y hacer check-in
  const handleManualCheckin = async (ref = reference) => {
    if (!ref.trim()) {
      toast({
        title: 'Referencia vacía',
        description: 'Por favor ingresa una referencia de ticket válida',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);

    try {
      // TO-DO
      // CHECKIN TICKET
      const success = true;

      if (success) {
        setLastResult({
          success: true,
          message: 'Ticket checked in successfully!',
          reference: ref.toUpperCase(),
        });

        toast({
          title: 'Check-in exitoso',
          description: `Ticket ${ref.toUpperCase()} ha sido registrado.`,
        });
      } else {
        setLastResult({
          success: false,
          message: 'Invalid or already used ticket.',
          reference: ref.toUpperCase(),
        });

        toast({
          title: 'Check-in fallido',
          description: 'Ticket inválido o ya utilizado.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error al procesar el check-in:', error);

      setLastResult({
        success: false,
        message: 'Error al procesar el check-in.',
        reference: ref.toUpperCase(),
      });

      toast({
        title: 'Error',
        description: 'Ocurrió un error al procesar el check-in.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
      setReference('');
    }
  };

  // Función para procesar un código escaneado
  const scanTicket = (code: string) => {
    if (!code || typeof code !== 'string') {
      toast({
        title: 'Código inválido',
        description: 'El código escaneado no es válido.',
        variant: 'destructive',
      });
      return;
    }

    setReference(code);
    handleManualCheckin(code);
  };

  return {
    reference,
    setReference,
    lastResult,
    isProcessing,
    handleManualCheckin,
    scanTicket,
  };
}
