export interface OrderItem {
  orderId: string
  ticketTypeId: string
  quantity: number
  price: number
  createdAt: Date
}

export const orderItems: OrderItem[] = [
  {
    orderId: "order-123",
    ticketTypeId: "tt-456",
    quantity: 1,
    price: 30000,
    createdAt: new Date("2023-04-01"),
  },
  {
    orderId: "order-456",
    ticketTypeId: "tt-789",
    quantity: 1,
    price: 5000,
    createdAt: new Date("2023-04-05"),
  },
]

// Simular latencia de red/base de datos
const simulateLatency = async () => {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), Math.random() * 300 + 100) // Entre 100ms y 400ms
  })
}

export async function getOrderItems(orderId: string): Promise<OrderItem[]> {
  await simulateLatency()
  return orderItems.filter((item) => item.orderId === orderId)
}

export async function createOrderItem(data: {
  orderId: string
  ticketTypeId: string
  quantity: number
  price: number
}): Promise<OrderItem> {
  await simulateLatency()

  const newOrderItem: OrderItem = {
    orderId: data.orderId,
    ticketTypeId: data.ticketTypeId,
    quantity: data.quantity,
    price: data.price,
    createdAt: new Date(),
  }

  orderItems.push(newOrderItem)
  return newOrderItem
}
