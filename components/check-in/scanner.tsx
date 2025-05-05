"use client"

import { useState } from "react"
import { SearchBar } from "./search-bar"
import { CameraSection } from "./camera-section"
import { CameraModal } from "./camera-modal"
import { ResultCard } from "./result-card"
import { TicketsTable } from "./tickets-table"
import { useCheckIn } from "./hooks/use-check-in"
import { useToast } from "@/components/ui/use-toast"

export function CheckinScanner() {
  const [showCameraModal, setShowCameraModal] = useState(false)
  const { reference, setReference, lastResult, isProcessing, handleManualCheckin, handleSimulateScan, scanTicket } =
    useCheckIn()
  const { toast } = useToast()

  const startCamera = () => {
    // Verificamos si estamos en un navegador
    if (typeof window !== "undefined") {
      // Intentamos abrir el modal directamente
      // La verificación de compatibilidad se hará dentro del hook useCamera
      setShowCameraModal(true)
    }
  }

  const stopCamera = () => {
    setShowCameraModal(false)
  }

  const handleScan = (code: string) => {
    // Cerramos el modal primero para evitar problemas con la cámara
    stopCamera()

    // Luego procesamos el código escaneado
    setTimeout(() => {
      scanTicket(code)
    }, 300)
  }

  return (
    <div className="mx-auto">
      <SearchBar
        reference={reference}
        setReference={setReference}
        onSubmit={handleManualCheckin}
        isProcessing={isProcessing}
        onStartCamera={startCamera}
        isProcessing={isProcessing}
      />

      <div className="mb-8">
        <TicketsTable />
      </div>

      {showCameraModal && <CameraModal onClose={stopCamera} onScan={handleScan} />}

      {lastResult && <ResultCard result={lastResult} />}
    </div>
  )
}
