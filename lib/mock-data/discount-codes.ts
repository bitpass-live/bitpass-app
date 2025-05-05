import { v4 as uuidv4 } from "uuid"

export interface DiscountCode {
  id: string
  eventId: string
  code: string
  percentage: number
  expiresAt: Date | null
  maxUses: number | null
  createdAt: Date
  updatedAt: Date
}

export const discountCodes: DiscountCode[] = [
  {
    id: "dc-123",
    eventId: "event-123",
    code: "EARLY25",
    percentage: 25,
    expiresAt: new Date("2025-04-01T00:00:00Z"),
    maxUses: 50,
    createdAt: new Date("2023-01-20"),
    updatedAt: new Date("2023-01-20"),
  },
  {
    id: "dc-456",
    eventId: "event-123",
    code: "VIP50",
    percentage: 50,
    expiresAt: null,
    maxUses: 10,
    createdAt: new Date("2023-01-25"),
    updatedAt: new Date("2023-01-25"),
  },
  {
    id: "dc-789",
    eventId: "event-789",
    code: "NOSTR20",
    percentage: 20,
    expiresAt: new Date("2025-04-01T00:00:00Z"),
    maxUses: null,
    createdAt: new Date("2023-03-27"),
    updatedAt: new Date("2023-03-27"),
  },
]

// Simular latencia de red/base de datos
const simulateLatency = async () => {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), Math.random() * 300 + 100) // Entre 100ms y 400ms
  })
}

export async function getEventDiscountCodes(eventId: string): Promise<DiscountCode[]> {
  await simulateLatency()
  return discountCodes.filter((dc) => dc.eventId === eventId)
}

export async function getDiscountCodeById(id: string): Promise<DiscountCode | null> {
  await simulateLatency()
  const discountCode = discountCodes.find((dc) => dc.id === id)
  return discountCode || null
}

export async function findDiscountCode(eventId: string, code: string): Promise<DiscountCode | undefined> {
  await simulateLatency()
  return discountCodes.find((dc) => dc.eventId === eventId && dc.code.toUpperCase() === code.toUpperCase())
}

export async function createDiscountCode(data: {
  eventId: string
  code: string
  percentage: number
  expiresAt?: Date | null
  maxUses?: number | null
}): Promise<DiscountCode> {
  await simulateLatency()

  const newDiscountCode: DiscountCode = {
    id: uuidv4(),
    eventId: data.eventId,
    code: data.code.toUpperCase(),
    percentage: data.percentage,
    expiresAt: data.expiresAt || null,
    maxUses: data.maxUses || null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  discountCodes.push(newDiscountCode)
  return newDiscountCode
}

export async function updateDiscountCode(id: string, data: Partial<DiscountCode>): Promise<DiscountCode | null> {
  await simulateLatency()

  const index = discountCodes.findIndex((dc) => dc.id === id)
  if (index === -1) return null

  const updatedDiscountCode = {
    ...discountCodes[index],
    ...data,
    updatedAt: new Date(),
  }

  discountCodes[index] = updatedDiscountCode
  return updatedDiscountCode
}

export async function deleteDiscountCode(id: string): Promise<boolean> {
  await simulateLatency()

  const index = discountCodes.findIndex((dc) => dc.id === id)
  if (index === -1) return false

  discountCodes.splice(index, 1)
  return true
}
