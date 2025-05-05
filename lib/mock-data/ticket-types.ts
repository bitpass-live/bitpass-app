import { v4 as uuidv4 } from "uuid"

export interface TicketType {
  id: string
  eventId: string
  name: string
  price: number
  quantity: number
  createdAt: Date
  updatedAt: Date
}

export const ticketTypes: TicketType[] = [
  {
    id: "tt-123",
    eventId: "event-123",
    name: "General Admission",
    price: 15000,
    quantity: 100,
    createdAt: new Date("2023-01-16"),
    updatedAt: new Date("2023-01-16"),
  },
  {
    id: "tt-456",
    eventId: "event-123",
    name: "VIP",
    price: 30000,
    quantity: 50,
    createdAt: new Date("2023-01-16"),
    updatedAt: new Date("2023-01-16"),
  },
  {
    id: "tt-789",
    eventId: "event-789",
    name: "Standard",
    price: 5000,
    quantity: 30,
    createdAt: new Date("2023-03-26"),
    updatedAt: new Date("2023-03-26"),
  },
]

// Simular latencia de red/base de datos
const simulateLatency = async () => {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), Math.random() * 300 + 100) // Entre 100ms y 400ms
  })
}

export async function getEventTicketTypes(eventId: string): Promise<TicketType[]> {
  await simulateLatency()
  return ticketTypes.filter((tt) => tt.eventId === eventId)
}

export async function getTicketTypeById(id: string): Promise<TicketType | null> {
  await simulateLatency()
  const ticketType = ticketTypes.find((tt) => tt.id === id)
  return ticketType || null
}

export async function createTicketType(data: {
  eventId: string
  name: string
  price: number
  quantity: number
}): Promise<TicketType> {
  await simulateLatency()

  const newTicketType: TicketType = {
    id: uuidv4(),
    eventId: data.eventId,
    name: data.name,
    price: data.price,
    quantity: data.quantity,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  ticketTypes.push(newTicketType)
  return newTicketType
}

export async function updateTicketType(id: string, data: Partial<TicketType>): Promise<TicketType | null> {
  await simulateLatency()

  const index = ticketTypes.findIndex((tt) => tt.id === id)
  if (index === -1) return null

  const updatedTicketType = {
    ...ticketTypes[index],
    ...data,
    updatedAt: new Date(),
  }

  ticketTypes[index] = updatedTicketType
  return updatedTicketType
}

export async function deleteTicketType(id: string): Promise<TicketType | null> {
  await simulateLatency()

  const index = ticketTypes.findIndex((tt) => tt.id === id)
  if (index === -1) return null

  const deletedTicketType = ticketTypes[index]
  ticketTypes.splice(index, 1)
  return deletedTicketType
}
