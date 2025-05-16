"use client"

import { TableCell, TableRow } from "@/components/ui/table"
import { CheckCircle, Clock } from "lucide-react"
import { TicketDisplay } from "."

interface TicketRowProps {
  sale: TicketDisplay 
  onSelectTicket: (sale: any) => void
}

export function TicketRow({ sale, onSelectTicket }: TicketRowProps) {
  return (
    <TableRow className="cursor-pointer hover:bg-muted/50" onClick={() => onSelectTicket(sale)}>
      <TableCell className="font-mono">{sale.id}</TableCell>
      <TableCell>
        {sale.isCheckedIn ? (
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-primary" />
            <span>Checked In</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-muted-foreground" />
            <span>Pending</span>
          </div>
        )}
      </TableCell>
    </TableRow>
  )
}
