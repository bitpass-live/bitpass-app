import { v4 as uuidv4 } from "uuid"

export type PaymentMethodType = "LIGHTNING" | "MERCADOPAGO"

export interface PaymentMethod {
  id: string
  userId: string
  type: PaymentMethodType
  details: Record<string, any>
  isDefault: boolean
  createdAt: Date
  updatedAt: Date
}

export const paymentMethods: PaymentMethod[] = [
  {
    id: "pm-123",
    userId: "user-123",
    type: "LIGHTNING",
    details: {
      lnAddress: "alice@getalby.com",
    },
    isDefault: true,
    createdAt: new Date("2023-01-02"),
    updatedAt: new Date("2023-01-02"),
  },
  {
    id: "pm-456",
    userId: "user-123",
    type: "MERCADOPAGO",
    details: {
      accessToken: "TEST-123456789",
    },
    isDefault: false,
    createdAt: new Date("2023-01-03"),
    updatedAt: new Date("2023-01-03"),
  },
]

// Simular latencia de red/base de datos
const simulateLatency = async () => {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), Math.random() * 300 + 100) // Entre 100ms y 400ms
  })
}

export async function getUserPaymentMethods(userId: string): Promise<PaymentMethod[]> {
  await simulateLatency()
  return paymentMethods.filter((pm) => pm.userId === userId)
}

export async function getPaymentMethodById(id: string): Promise<PaymentMethod | null> {
  await simulateLatency()
  const paymentMethod = paymentMethods.find((pm) => pm.id === id)
  return paymentMethod || null
}

export async function createPaymentMethod(data: {
  userId: string
  type: PaymentMethodType
  details: Record<string, any>
  isDefault?: boolean
}): Promise<PaymentMethod> {
  await simulateLatency()

  // Si este método de pago se establece como predeterminado, actualizar los otros
  if (data.isDefault) {
    const userPaymentMethods = paymentMethods.filter((pm) => pm.userId === data.userId)
    for (const pm of userPaymentMethods) {
      pm.isDefault = false
    }
  }

  const newPaymentMethod: PaymentMethod = {
    id: uuidv4(),
    userId: data.userId,
    type: data.type,
    details: data.details,
    isDefault: data.isDefault || false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  paymentMethods.push(newPaymentMethod)
  return newPaymentMethod
}

export async function updatePaymentMethod(id: string, data: Partial<PaymentMethod>): Promise<PaymentMethod | null> {
  await simulateLatency()

  const pmIndex = paymentMethods.findIndex((pm) => pm.id === id)
  if (pmIndex === -1) return null

  // Si este método de pago se establece como predeterminado, actualizar los otros
  if (data.isDefault) {
    const userPaymentMethods = paymentMethods.filter(
      (pm) => pm.userId === paymentMethods[pmIndex].userId && pm.id !== id,
    )
    for (const pm of userPaymentMethods) {
      pm.isDefault = false
    }
  }

  const updatedPaymentMethod = {
    ...paymentMethods[pmIndex],
    ...data,
    updatedAt: new Date(),
  }

  paymentMethods[pmIndex] = updatedPaymentMethod
  return updatedPaymentMethod
}

export async function deletePaymentMethod(id: string): Promise<boolean> {
  await simulateLatency()

  const pmIndex = paymentMethods.findIndex((pm) => pm.id === id)
  if (pmIndex === -1) return false

  paymentMethods.splice(pmIndex, 1)
  return true
}
