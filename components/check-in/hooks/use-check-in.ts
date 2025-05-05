'use client';

import { useState } from 'react';
import { useEventroStore } from '@/lib/store';
import { useToast } from '@/components/ui/use-toast';

export interface CheckInResult {
  success: boolean;
  message: string;
  reference?: string;
}

export function useCheckIn() {
  const [reference, setReference] = useState('');
  const [lastResult, setLastResult] = useState<CheckInResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const checkInTicket = useEventroStore((state) => state.checkInTicket);
  const sales = useEventroStore((state) => state.sales);
  const { toast } = useToast();

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
      // En una implementación real, aquí haríamos una llamada a la API
      // Por ahora, usamos la función del store para simular
      const success = checkInTicket(ref.toUpperCase());

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
