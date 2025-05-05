"use client"

import { useMemo } from "react"
import { useEventroStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { TicketIcon, DollarSign, UsersIcon, CheckIcon } from "lucide-react"

export function SalesOverview({ eventId }: { eventId: string }) {
  // Get data from store
  const event = useEventroStore((state) => state.events.find((e) => e.id === eventId))

  const allSales = useEventroStore((state) => state.sales)

  // Memoize filtered sales to prevent unnecessary re-renders
  const sales = useMemo(() => allSales.filter((s) => s.eventId === eventId && s.status === "paid"), [allSales, eventId])

  // Memoize calculations to prevent unnecessary re-renders
  const stats = useMemo(() => {
    if (!event) return { totalSold: 0, totalCapacity: 0, totalRevenue: 0, checkedIn: 0 }

    const totalSold = event.tickets.reduce((acc, ticket) => acc + (ticket.sold || 0), 0)
    const totalCapacity = event.tickets.reduce((acc, ticket) => acc + ticket.quantity, 0)
    const totalRevenue = sales.reduce((acc, sale) => acc + sale.amount, 0)
    const checkedIn = sales.filter((s) => s.checkIn).length

    return { totalSold, totalCapacity, totalRevenue, checkedIn }
  }, [event, sales])

  // Memoize recent sales to prevent unnecessary re-renders
  const recentSales = useMemo(() => sales.slice(0, 5), [sales])

  // Show loading state if event not found
  if (!event) {
    return <div className="p-8 text-center">Loading sales data...</div>
  }

  const { totalSold, totalCapacity, totalRevenue, checkedIn } = stats

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Sales Overview</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets Sold</CardTitle>
            <TicketIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSold}</div>
            <p className="text-xs text-muted-foreground">
              of {totalCapacity} available ({Math.round((totalSold / totalCapacity) * 100) || 0}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue, "ARS")}</div>
            <p className="text-xs text-muted-foreground">From {sales.length} transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Checked In</CardTitle>
            <CheckIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{checkedIn}</div>
            <p className="text-xs text-muted-foreground">
              of {totalSold} tickets ({Math.round((checkedIn / totalSold) * 100) || 0}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Types</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{event.tickets.length}</div>
            <p className="text-xs text-muted-foreground">Different ticket options</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
          <CardDescription>Recent ticket purchases for your event</CardDescription>
        </CardHeader>
        <CardContent>
          {recentSales.length === 0 ? (
            <p className="text-center py-6 text-muted-foreground">
              No sales yet. Publish your event to start selling tickets.
            </p>
          ) : (
            <div className="space-y-4">
              {recentSales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium">{sale.buyer.substring(0, 8)}...</p>
                    <p className="text-sm text-muted-foreground">
                      {sale.quantity} x {sale.ticketTitle}
                    </p>
                    <p className="text-xs text-muted-foreground">Ref: {sale.reference}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(sale.amount, sale.currency)}</p>
                    <p className="text-xs text-muted-foreground">{sale.checkIn ? "Checked in" : "Not checked in"}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
