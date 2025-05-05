"use client"

import { useState, useRef, useCallback, useEffect } from "react"

interface UseCameraProps {
  onCodeDetected: (code: string) => void
}

export function useCamera(onCodeDetected: (code: string) => void) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const isActiveRef = useRef<boolean>(false)

  const [hasCamera, setHasCamera] = useState(false)
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null)
  const [permissionError, setPermissionError] = useState<string | null>(null)
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment")
  const [hasMutipleCamera, setHasMultipleCamera] = useState(false)

  // Verificar si hay múltiples cámaras disponibles
  useEffect(() => {
    const checkDevices = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
          console.log("enumerateDevices() no soportado.")
          return
        }

        const devices = await navigator.mediaDevices.enumerateDevices()
        const videoDevices = devices.filter((device) => device.kind === "videoinput")
        setHasMultipleCamera(videoDevices.length > 1)
        setHasCamera(videoDevices.length > 0)

        console.log(`Dispositivos de video disponibles: ${videoDevices.length}`)
      } catch (err) {
        console.error("Error al enumerar dispositivos:", err)
      }
    }

    checkDevices()
  }, [])

  // Función para detener la cámara
  const stopCamera = useCallback(() => {
    console.log("Deteniendo cámara...")
    isActiveRef.current = false

    // Detener el intervalo de escaneo
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current)
      scanIntervalRef.current = null
      console.log("Intervalo de escaneo detenido")
    }

    // Detener todos los tracks del stream
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks()
      tracks.forEach((track) => {
        track.stop()
        console.log(`Track ${track.kind} detenido`)
      })
      streamRef.current = null
    }

    // Limpiar el elemento de video
    if (videoRef.current) {
      videoRef.current.srcObject = null
      console.log("Referencia de video limpiada")
    }

    console.log("Cámara completamente detenida")
  }, [])

  // Asegurarse de que la cámara se detenga cuando el componente se desmonte
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [stopCamera])

  // Función para escanear códigos QR
  const scanQRCode = useCallback(() => {
    if (!isActiveRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current

    if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
      return
    }

    const context = canvas.getContext("2d")
    if (!context) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Aquí normalmente usaríamos una biblioteca como jsQR para detectar códigos QR
    // Por ahora, simulamos la detección para fines de demostración
    // En una implementación real, reemplazaríamos esto con jsQR u otra biblioteca

    // Simulación de detección (solo para demostración)
    // En una implementación real, esto sería reemplazado por código que realmente
    // analiza la imagen del canvas en busca de códigos QR
    const simulateDetection = () => {
      // Esta es solo una simulación - no detecta realmente códigos QR
      // En una implementación real, aquí usaríamos jsQR u otra biblioteca
      return null // Retornamos null para indicar que no se detectó ningún código
    }

    const code = simulateDetection()
    if (code) {
      onCodeDetected(code)
    }
  }, [onCodeDetected])

  // Función para iniciar la cámara
  const startCamera = useCallback(async () => {
    try {
      stopCamera() // Asegurarse de que cualquier stream anterior se detenga
      isActiveRef.current = true

      // Verificar si el navegador soporta getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error("getUserMedia no está soportado en este navegador")
        setPermissionError("Tu navegador no soporta el acceso a la cámara")
        return false
      }

      console.log(`Intentando acceder a la cámara con facingMode: ${facingMode}`)

      // Intentar acceder a la cámara con la orientación preferida
      const constraints = {
        video: { facingMode: facingMode },
        audio: false,
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      setCameraPermission(true)
      setPermissionError(null)

      // Iniciar el escaneo periódico
      scanIntervalRef.current = setInterval(() => {
        if (isActiveRef.current) {
          scanQRCode()
        }
      }, 500)

      console.log("Cámara iniciada exitosamente")
      return true
    } catch (error: any) {
      console.error("Error al acceder a la cámara:", error)
      isActiveRef.current = false

      // Manejar diferentes tipos de errores
      if (error.name === "NotAllowedError") {
        setCameraPermission(false)
        setPermissionError("Permiso denegado para acceder a la cámara")
      } else if (error.name === "NotFoundError") {
        setHasCamera(false)
        setPermissionError("No se encontró ninguna cámara en este dispositivo")
      } else if (error.name === "NotReadableError") {
        setPermissionError("La cámara está en uso por otra aplicación")
      } else {
        setPermissionError(`Error al acceder a la cámara: ${error.message}`)
      }

      return false
    }
  }, [facingMode, scanQRCode, stopCamera])

  // Función para cambiar entre cámaras
  const switchCamera = useCallback(async () => {
    // Cambiar el modo de la cámara
    const newFacingMode = facingMode === "environment" ? "user" : "environment"
    setFacingMode(newFacingMode)

    // Detener la cámara actual
    stopCamera()

    // Pequeña pausa para asegurar que la cámara anterior se haya detenido completamente
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Iniciar la nueva cámara
    return await startCamera()
  }, [facingMode, startCamera, stopCamera])

  return {
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
  }
}
