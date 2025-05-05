'use client';

import { useState } from 'react';
import { SearchBar } from '@/components/check-in/search-bar';
import { CameraModal } from '@/components/check-in/camera-modal';
import { ResultCard } from '@/components/check-in/result-card';
import { TicketsTable } from '@/components/check-in/tickets-table';
import { useCheckIn } from '@/components/check-in/hooks/use-check-in';
import { useToast } from '@/components/ui/use-toast';

export default function CheckinPageRoute() {
  const [showCameraModal, setShowCameraModal] = useState(false);
  const { reference, setReference, lastResult, isProcessing, handleManualCheckin, scanTicket } = useCheckIn();

  const startCamera = () => {
    // Verificamos si estamos en un navegador
    if (typeof window !== 'undefined') {
      // Intentamos abrir el modal directamente
      // La verificación de compatibilidad se hará dentro del hook useCamera
      setShowCameraModal(true);
    }
  };

  const stopCamera = () => {
    setShowCameraModal(false);
  };

  const handleScan = (code: string) => {
    // Cerramos el modal primero para evitar problemas con la cámara
    stopCamera();

    // Luego procesamos el código escaneado
    setTimeout(() => {
      scanTicket(code);
    }, 300);
  };
  return (
    <div className='container pt-40'>
      <h1 className='text-2xl font-bold mb-6 text-center mx-auto'>Check-in de Tickets</h1>
      <div className='container'>
        <SearchBar
          reference={reference}
          setReference={setReference}
          onSubmit={handleManualCheckin}
          isProcessing={isProcessing}
          onStartCamera={startCamera}
        />

        <div className='mb-8'>
          <TicketsTable />
        </div>

        {showCameraModal && <CameraModal onClose={stopCamera} onScan={handleScan} />}

        {lastResult && <ResultCard result={lastResult} />}
      </div>
    </div>
  );
}
