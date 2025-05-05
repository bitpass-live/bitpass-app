"use client"

import { useState, useEffect } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { Zap } from "lucide-react"

interface LightningPaymentProps {
  amount: number
  onPaymentSuccess: () => void
}

export function LightningPayment({ amount, onPaymentSuccess }: LightningPaymentProps) {
  const [isChecking, setIsChecking] = useState(false)
  const [timeLeft, setTimeLeft] = useState(900) // 15 minutos en segundos
  const [invoice, setInvoice] = useState("")

  // Generar un invoice falso para la demo
  useEffect(() => {
    // En una implementación real, aquí se llamaría a una API para generar el invoice
    const demoInvoice = `lnbc${Math.floor(amount * 100)}n1p3hkzgzpp5yndenv56xyr9rt8c0lx39z73mf6q3w96yvrj458qt6y70qtfwf82sdqqcqzpgxqyz5vqsp5usw0m4p8gqnl9yt6u7x97er2y7qefr4mpa9m04thazryd5nr6hs9qyyssqy5vk79nvv9xzq8jlq5m8vft46xgrn9t6n9xgmkpwkv5h3v3j4ssxrwjl9l3yqynplwp3snxwhx48a3y8ypnv6k22apct5a6ygycqwgzj25`
    setInvoice(demoInvoice)

    // Iniciar el temporizador
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [amount])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleSimulatePayment = () => {
    setIsChecking(true)

    // Simular verificación de pago
    setTimeout(() => {
      onPaymentSuccess()
    }, 2000)
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <h2 className="text-xl font-semibold text-white">Pagar con Lightning Network</h2>

      <Card className="bg-[#151515] border-border-gray">
        <CardContent className="p-6 flex flex-col items-center">
          <div className="mb-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">Tiempo restante para pagar</p>
            <p className="text-xl font-mono font-bold text-white">{formatTime(timeLeft)}</p>
          </div>

          <div className="bg-white p-4 rounded-lg mb-4">
            <QRCodeSVG value={invoice} size={200} includeMargin={true} />
          </div>

          <div className="text-center mb-6">
            <p className="text-lg font-bold text-white mb-1">{formatCurrency(amount, "ARS")}</p>
            <p className="text-sm text-muted-foreground">≈ {Math.floor(amount * 100)} sats</p>
          </div>

          <div className="w-full space-y-3">
            <Button
              onClick={handleSimulatePayment}
              className="w-full bg-fluorescent-yellow hover:bg-fluorescent-yellow-hover text-dark-gray"
              disabled={isChecking}
            >
              {isChecking ? (
                "Verificando pago..."
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Simular pago
                </>
              )}
            </Button>

            <Button
              variant="outline"
              className="w-full border-border-gray text-white"
              onClick={() => navigator.clipboard.writeText(invoice)}
            >
              Copiar invoice
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground text-center">
        <p>Escanea el código QR con tu wallet de Lightning Network</p>
        <p>o copia el invoice para pagar desde tu aplicación.</p>
      </div>
    </div>
  )
}
