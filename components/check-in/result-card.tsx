"use client"

import { CheckIcon, XIcon } from "lucide-react"
import { useEffect } from "react"
import { useEventroStore } from "@/lib/store"
import { useToast } from "@/components/ui/use-toast"
import type { CheckInResult } from "./hooks/use-check-in"

interface ResultCardProps {
  result: CheckInResult
}

export function ResultCard({ result }: ResultCardProps) {
  const sales = useEventroStore((state) => state.sales)
  const { toast } = useToast()

  useEffect(() => {
    if (!result) return

    // Encontrar los detalles del ticket si existe
    const sale = result.reference ? sales.find((s) => s.reference === result.reference) : null

    // Mostrar toast con la información relevante
    toast({
      title: result.success ? "Check-in exitoso" : "Check-in fallido",
      description: (
        <div className="flex flex-col gap-1">
          <p>{result.message}</p>
          {result.reference && <p className="font-mono text-xs">{result.reference}</p>}

          {result.success && sale && (
            <div className="mt-2 text-xs">
              <p>
                <span className="font-medium">Tipo:</span> {sale.ticketTitle}
              </p>
              <p>
                <span className="font-medium">Cantidad:</span> {sale.quantity}
              </p>
              <p>
                <span className="font-medium">Comprador:</span> {sale.buyer.substring(0, 8)}...
              </p>
            </div>
          )}
        </div>
      ),
      variant: result.success ? "default" : "destructive",
      duration: result.success ? 5000 : 7000, // Duración más larga para errores
      icon: result.success ? <CheckIcon className="h-4 w-4" /> : <XIcon className="h-4 w-4" />,
    })
  }, [result, sales, toast])

  // No renderizamos nada, solo mostramos el toast
  return null
}
