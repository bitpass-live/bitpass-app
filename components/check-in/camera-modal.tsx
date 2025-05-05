"use client"

import { XIcon, RefreshCcw, Camera, FlipHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { QrCodeIcon as QrScanIcon } from "lucide-react"
import { useCamera } from "./hooks/use-camera"
import { useEffect, useState, useCallback } from "react"

interface CameraModalProps {
  onClose: () => void
  onScan: (code: string) => void
}

export function CameraModal({ onClose, onScan }: CameraModalProps) {
  const [cameraStarted, setCameraStarted] = useState(false)
  const [isSwitchingCamera, setIsSwitchingCamera] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  const {
    videoRef,
    canvasRef,
    startCamera,
    stopCamera,
    switchCamera,
    hasCamera,
    cameraPermission,
    permissionError,
    facingMode,
    hasMutipleCamera,
  } = useCamera((code) => {
    // Esta función se llama cuando se detecta un código QR
    handleClose()
    // Pequeño retraso para asegurar que el modal se cierre antes de procesar el código
    setTimeout(() => {
      onScan(code)
    }, 100)
  })

  // Función para manejar el cierre del modal
  const handleClose = useCallback(() => {
    if (isClosing) return

    setIsClosing(true)
    console.log("Cerrando modal y deteniendo cámara...")

    // Detener la cámara
    stopCamera()

    // Pequeño retraso para asegurar que la cámara se detenga antes de cerrar el modal
    setTimeout(() => {
      onClose()
    }, 100)
  }, [onClose, stopCamera, isClosing])

  useEffect(() => {
    const initCamera = async () => {
      console.log("Iniciando cámara...")
      const success = await startCamera()
      setCameraStarted(success)
      if (!success) {
        console.log("No se pudo iniciar la cámara")
      }
    }

    initCamera()

    // Asegurarse de que la cámara se detenga cuando el componente se desmonte
    return () => {
      console.log("Desmontando componente CameraModal")
      stopCamera()
    }
  }, [startCamera, stopCamera])

  // Manejar tecla Escape para cerrar el modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleClose])

  const handleRetry = async () => {
    setCameraStarted(false)
    const success = await startCamera()
    setCameraStarted(success)
  }

  const handleSwitchCamera = async () => {
    if (isSwitchingCamera) return

    setIsSwitchingCamera(true)
    setCameraStarted(false)

    try {
      const success = await switchCamera()
      setCameraStarted(success)
    } catch (error) {
      console.error("Error al cambiar de cámara:", error)
    } finally {
      setIsSwitchingCamera(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-background bg-opacity-90 z-50 flex items-center justify-center"
      onClick={(e) => {
        // Cerrar el modal si se hace clic en el fondo
        if (e.target === e.currentTarget) {
          handleClose()
        }
      }}
    >
      <div className="relative w-full h-full md:w-auto md:h-auto md:max-w-2xl md:max-h-[80vh]">
        <div className="absolute top-4 right-4 z-10 flex space-x-2">
          {/* Botón para cambiar de cámara (solo visible si hay múltiples cámaras y la cámara está activa) */}
          {cameraStarted && hasMutipleCamera && !isClosing && (
            <Button
              variant="secondary"
              size="icon"
              onClick={handleSwitchCamera}
              disabled={isSwitchingCamera || isClosing}
              title={`Cambiar a cámara ${facingMode === "environment" ? "frontal" : "trasera"}`}
            >
              <FlipHorizontal className={`h-5 w-5 ${isSwitchingCamera ? "animate-spin" : ""}`} />
              <span className="sr-only">Cambiar cámara</span>
            </Button>
          )}

          {/* Botón para cerrar */}
          <Button variant="secondary" size="icon" onClick={handleClose} disabled={isClosing}>
            <XIcon className="h-5 w-5" />
            <span className="sr-only">Cerrar</span>
          </Button>
        </div>

        <div className="w-full h-full md:rounded-lg overflow-hidden">
          <div className="relative w-full h-full">
            {/* Estado de la cámara */}
            {(!cameraStarted || isSwitchingCamera || isClosing) && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background p-6">
                <div className="text-foreground text-center p-4 max-w-md">
                  {isClosing ? (
                    <div className="mb-4">
                      <p className="text-xl mb-2">Cerrando cámara...</p>
                    </div>
                  ) : !hasCamera ? (
                    <>
                      <Camera className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-xl mb-2">Cámara no disponible</p>
                      <p className="text-muted-foreground mb-4">
                        Tu dispositivo no tiene una cámara disponible o el navegador no permite acceder a ella.
                      </p>
                      <Button onClick={handleClose} className="mt-2">
                        Cerrar
                      </Button>
                    </>
                  ) : cameraPermission === false ? (
                    <>
                      <div className="bg-surface p-6 rounded-xl mb-6 border border-border">
                        <h3 className="text-xl font-semibold mb-4">Permisos de cámara denegados</h3>
                        <p className="text-muted-foreground mb-4">
                          Para escanear códigos QR, necesitamos acceso a tu cámara. Por favor, sigue estos pasos:
                        </p>
                        <ol className="list-decimal pl-5 space-y-2 text-sm text-muted-foreground mb-4">
                          <li>Haz clic en el icono de candado o información en la barra de direcciones</li>
                          <li>Busca los permisos de cámara y cámbialos a "Permitir"</li>
                          <li>Recarga la página e intenta nuevamente</li>
                        </ol>
                        <div className="flex flex-col space-y-2">
                          <Button onClick={handleRetry} className="w-full">
                            <RefreshCcw className="mr-2 h-4 w-4" />
                            Intentar nuevamente
                          </Button>
                          <Button variant="outline" onClick={handleClose} className="w-full">
                            Cerrar
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="mb-4">
                        <Camera className="w-5 h-5 mx-auto text-primary" />
                      </div>
                      <p className="text-xl mb-2">
                        {isSwitchingCamera ? "Cambiando cámara..." : "Iniciando cámara..."}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {!isSwitchingCamera &&
                          "Por favor, acepta el acceso a la cámara."}
                      </p>
                      {permissionError && (
                        <div className="mt-4 p-3 bg-surface border border-border rounded-lg">
                          <p className="text-sm text-muted-foreground">{permissionError}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            <video ref={videoRef} className="w-full h-full object-cover" playsInline autoPlay muted />
            <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full hidden" />

            {/* Enhanced scanning overlay */}
            {cameraStarted && !isSwitchingCamera && !isClosing && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-64 border-2 border-primary rounded-lg opacity-70"></div>
                <div className="absolute">
                  <div className="animate-pulse rounded-lg">
                    <QrScanIcon className="h-24 w-24 text-primary drop-shadow-lg" />
                  </div>
                </div>
              </div>
            )}

            {cameraStarted && !isSwitchingCamera && !isClosing && (
              <div className="absolute bottom-8 left-0 right-0 text-center">
                <p className="text-foreground text-lg font-medium drop-shadow-lg">
                  Posiciona el código QR en el centro
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {facingMode === "environment" ? "Usando cámara trasera" : "Usando cámara frontal"}
                  {hasMutipleCamera && " - Puedes cambiar de cámara con el botón superior"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
