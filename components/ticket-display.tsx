"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useEventroStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { QrCode, Share2 } from "lucide-react"
import { NotPassLogo } from "@/components/notpass-logo"
import { ShareTicketModal } from "@/components/landing/share-ticket-modal"
import Link from "next/link"

export function TicketDisplay({ eventId, saleId }: { eventId: string; saleId: string }) {
  const [isVisible, setIsVisible] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const ticketRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const event = useEventroStore((state) => state.events.find((e) => e.id === eventId))
  const sale = useEventroStore((state) => state.sales.find((s) => s.id === saleId))

  useEffect(() => {
    // Trigger animation after component mounts
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  if (!event || !sale) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Ticket no encontrado</p>
      </div>
    )
  }

  const handleShare = () => {
    setIsShareModalOpen(true)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="p-4 border-b">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <NotPassLogo className="text-xl" />
          </Link>
          <Button variant="outline" asChild>
            <Link href="/dashboard">Mi cuenta</Link>
          </Button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div
          className={`relative transition-all duration-700 transform ${
            isVisible ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-90 -rotate-3"
          }`}
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">¡Gracias por tu compra!</h1>
            <p className="text-text-secondary">Este es tu ticket para {event.title}</p>
          </div>

          <div
            ref={ticketRef}
            className="relative bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] rounded-xl overflow-hidden border border-fluorescent-yellow shadow-lg max-w-md mx-auto"
          >
            {/* Holographic effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-fluorescent-yellow/10 to-transparent opacity-30 pointer-events-none"></div>

            {/* Card content */}
            <div className="p-6 relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center">
                  <NotPassLogo className="text-lg" />
                </div>
                <div className="bg-black/30 px-3 py-1 rounded-full text-xs text-fluorescent-yellow font-mono">
                  #{sale.reference}
                </div>
              </div>

              <div className="flex gap-4 mb-6">
                <div className="bg-black/40 rounded-lg p-3 flex-shrink-0">
                  <QrCode className="h-24 w-24 text-white" />
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    <h4 className="text-white font-bold text-lg">{event.title}</h4>
                    <p className="text-text-secondary text-sm">{sale.ticketTitle}</p>
                    <p className="text-text-secondary text-sm">Cantidad: {sale.quantity}</p>
                  </div>
                  <div className="bg-black/30 px-3 py-2 rounded text-xs text-white font-mono">
                    <p>{sale.buyer}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                <div className="text-xs text-text-secondary">
                  <p>Powered by Lightning Network & Nostr</p>
                </div>
                <div className="text-xs text-fluorescent-yellow">
                  <p>notpass.io</p>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-fluorescent-yellow/20 to-transparent rounded-bl-full opacity-30"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-fluorescent-yellow/20 to-transparent rounded-tr-full opacity-30"></div>
          </div>

          <div className="mt-8 text-center">
            <Button
              onClick={handleShare}
              className="bg-fluorescent-yellow hover:bg-fluorescent-yellow-hover text-dark-gray"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Compartir
            </Button>
          </div>

          <ShareTicketModal
            isOpen={isShareModalOpen}
            onClose={() => setIsShareModalOpen(false)}
            ticketRef={ticketRef}
            ticketId={sale.reference}
          />
        </div>
      </div>
    </div>
  )
}
