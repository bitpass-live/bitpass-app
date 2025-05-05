import { v4 as uuidv4 } from "uuid"

export type OrderStatus = "PENDING" | "PAID"

export interface Order {
  id: string
  eventId: string
  buyerId: string
  status: OrderStatus
  paymentMethodId: string | null
  discountCodeId: string | null
  totalAmount: number
  createdAt: Date
  paidAt: Date | null
  updatedAt: Date
}

export const orders: Order[] = [
  {
    id: "order-123",
    eventId: "event-123",
    buyerId: "user-456",
    status: "PAID",
    paymentMethodId: "pm-123",
    discountCodeId: "dc-123",
    totalAmount: 22500, // 30000 - 25% discount
    createdAt: new Date("2023-04-01"),
    paidAt: new Date("2023-04-01"),
    updatedAt: new Date("2023-04-01"),
  },
  {
    id: "order-456",
    eventId: "event-789",
    buyerId: "user-123",
    status: "PENDING",
    paymentMethodId: "pm-123",
    discountCodeId: null,
    totalAmount: 5000,
    createdAt: new Date("2023-04-05"),
    paidAt: null,
    updatedAt: new Date("2023-04-05"),
  },
]

// Simular latencia de red/base de datos
const simulateLatency = async () => {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), Math.random() * 300 + 100) // Entre 100ms y 400ms
  })
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  await simulateLatency()
  return orders.filter((order) => order.buyerId === userId)
}

export async function getOrderById(id: string): Promise<Order | null> {
  await simulateLatency()
  const order = orders.find((o) => o.id === id)
  return order || null
}

export async function getEventOrders(eventId: string): Promise<Order[]> {
  await simulateLatency()
  return orders.filter((order) => order.eventId === eventId)
}

export async function createOrder(data: {
  eventId: string
  buyerId: string
  paymentMethodId: string | null
  discountCodeId: string | null
  totalAmount: number
}): Promise<Order> {
  await simulateLatency()

  const newOrder: Order = {
    id: uuidv4(),
    eventId: data.eventId,
    buyerId: data.buyerId,
    status: "PENDING",
    paymentMethodId: data.paymentMethodId,
    discountCodeId: data.discountCodeId,
    totalAmount: data.totalAmount,
    createdAt: new Date(),
    paidAt: null,
    updatedAt: new Date(),
  }

  orders.push(newOrder)
  return newOrder
}

export async function markOrderAsPaid(id: string): Promise<Order | null> {
  await simulateLatency()

  const orderIndex = orders.findIndex((o) => o.id === id)
  if (orderIndex === -1) return null

  const updatedOrder = {
    ...orders[orderIndex],
    status: "PAID" as OrderStatus,
    paidAt: new Date(),
    updatedAt: new Date(),
  }

  orders[orderIndex] = updatedOrder
  return updatedOrder
}
