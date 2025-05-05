import { v4 as uuidv4 } from "uuid"

export interface Ticket {
  id: string
  eventId: string
  ticketTypeId: string
  orderId: string
  ownerId: string
  isCheckedIn: boolean
  createdAt: Date
  updatedAt: Date
  orderItemOrderId: string | null
  orderItemTicketTypeId: string | null
}

// Generamos más tickets de ejemplo para demostrar la paginación
const generateMockTickets = (count: number): Ticket[] => {
  const mockTickets: Ticket[] = []

  // Mantenemos los tickets originales
  mockTickets.push({
    id: "ticket-123",
    eventId: "event-123",
    ticketTypeId: "tt-456",
    orderId: "order-123",
    ownerId: "user-456",
    isCheckedIn: false,
    createdAt: new Date("2023-04-01"),
    updatedAt: new Date("2023-04-01"),
    orderItemOrderId: "order-123",
    orderItemTicketTypeId: "tt-456",
  })

  mockTickets.push({
    id: "ticket-456",
    eventId: "event-789",
    ticketTypeId: "tt-789",
    orderId: "order-456",
    ownerId: "user-123",
    isCheckedIn: false,
    createdAt: new Date("2023-04-05"),
    updatedAt: new Date("2023-04-05"),
    orderItemOrderId: "order-456",
    orderItemTicketTypeId: "tt-789",
  })

  // Generamos tickets adicionales
  const ticketTypes = ["tt-456", "tt-789", "tt-101", "tt-202"]
  const eventIds = ["event-123", "event-789"]
  const ownerIds = ["user-123", "user-456", "user-789", "user-101"]

  for (let i = 0; i < count - 2; i++) {
    const isCheckedIn = Math.random() > 0.6 // 40% de probabilidad de estar checked in
    const ticketTypeId = ticketTypes[Math.floor(Math.random() * ticketTypes.length)]
    const eventId = eventIds[Math.floor(Math.random() * eventIds.length)]
    const ownerId = ownerIds[Math.floor(Math.random() * ownerIds.length)]
    const orderId = `order-${1000 + i}`

    mockTickets.push({
      id: `ticket-${1000 + i}`,
      eventId,
      ticketTypeId,
      orderId,
      ownerId,
      isCheckedIn,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Últimos 30 días
      updatedAt: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000), // Últimos 15 días
      orderItemOrderId: orderId,
      orderItemTicketTypeId: ticketTypeId,
    })
  }

  return mockTickets
}

// Generamos 23 tickets en total (incluidos los 2 originales)
export const tickets: Ticket[] = generateMockTickets(23)

// Simular latencia de red/base de datos
const simulateLatency = async () => {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), Math.random() * 300 + 100) // Entre 100ms y 400ms
  })
}

export async function getUserTickets(userId: string): Promise<Ticket[]> {
  await simulateLatency()
  return tickets.filter((ticket) => ticket.ownerId === userId)
}

export async function getTicketById(id: string): Promise<Ticket | null> {
  await simulateLatency()
  const ticket = tickets.find((t) => t.id === id)
  return ticket || null
}

export async function getEventTickets(eventId: string): Promise<Ticket[]> {
  await simulateLatency()
  return tickets.filter((ticket) => ticket.eventId === eventId)
}

export async function createTicket(data: {
  eventId: string
  ticketTypeId: string
  orderId: string
  ownerId: string
  orderItemOrderId?: string | null
  orderItemTicketTypeId?: string | null
}): Promise<Ticket> {
  await simulateLatency()

  const newTicket: Ticket = {
    id: uuidv4(),
    eventId: data.eventId,
    ticketTypeId: data.ticketTypeId,
    orderId: data.orderId,
    ownerId: data.ownerId,
    isCheckedIn: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    orderItemOrderId: data.orderItemOrderId || null,
    orderItemTicketTypeId: data.orderItemTicketTypeId || null,
  }

  tickets.push(newTicket)
  return newTicket
}

export async function checkInTicket(id: string): Promise<Ticket | null> {
  await simulateLatency()

  const ticketIndex = tickets.findIndex((t) => t.id === id)
  if (ticketIndex === -1) return null

  const updatedTicket = {
    ...tickets[ticketIndex],
    isCheckedIn: true,
    updatedAt: new Date(),
  }

  tickets[ticketIndex] = updatedTicket
  return updatedTicket
}
