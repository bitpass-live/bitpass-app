"use client"

import { useEventroStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

interface PaymentSuccessProps {
  eventId: string
  saleId: string
  onViewTicket: () => void
}

export function PaymentSuccess({ eventId, saleId, onViewTicket }: PaymentSuccessProps) {
  const event = useEventroStore((state) => state.events.find((e) => e.id === eventId))
  const sale = useEventroStore((state) => state.sales.find((s) => s.id === saleId))

  if (!event || !sale) return null

  return (
    <div className="w-full max-w-md space-y-6">
      <h2 className="text-xl font-semibold text-white">¡Pago completado!</h2>

      <Card className="bg-[#151515] border-border-gray">
        <CardContent className="p-6 flex flex-col items-center">
          <div className="mb-6 text-center">
            <div className="inline-flex items-center justify-center p-2 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">¡Gracias por tu compra!</h3>
            <p className="text-muted-foreground">Tu pago ha sido procesado correctamente y tus tickets están listos.</p>
          </div>

          <div className="w-full space-y-4 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Evento:</span>
              <span className="text-white font-medium">{event.title}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Ticket:</span>
              <span className="text-white font-medium">{sale.ticketTitle}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Cantidad:</span>
              <span className="text-white font-medium">{sale.quantity}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Referencia:</span>
              <span className="text-white font-medium">{sale.reference}</span>
            </div>
          </div>

          <Button
            onClick={onViewTicket}
            className="w-full bg-fluorescent-yellow hover:bg-fluorescent-yellow-hover text-dark-gray"
          >
            Ver mi ticket
          </Button>
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground text-center">
        <p>Guarda tu ticket para presentarlo en el evento.</p>
        <p>También hemos enviado los detalles a tu correo electrónico.</p>
      </div>
    </div>
  )
}
