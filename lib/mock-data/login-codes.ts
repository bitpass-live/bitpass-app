import { v4 as uuidv4 } from "uuid"

export interface LoginCode {
  id: string
  email: string
  code: string
  expiresAt: Date
  createdAt: Date
}

export const loginCodes: LoginCode[] = []

// Simular latencia de red/base de datos
const simulateLatency = async () => {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), Math.random() * 300 + 100) // Entre 100ms y 400ms
  })
}

// Generar un código OTP de 6 dígitos
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function createLoginCode(email: string): Promise<LoginCode> {
  await simulateLatency()

  // Eliminar códigos anteriores para este email
  const index = loginCodes.findIndex((lc) => lc.email === email)
  if (index !== -1) {
    loginCodes.splice(index, 1)
  }

  // Crear nuevo código
  const newLoginCode: LoginCode = {
    id: uuidv4(),
    email,
    code: generateOTP(),
    expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutos
    createdAt: new Date(),
  }

  loginCodes.push(newLoginCode)
  return newLoginCode
}

export async function verifyLoginCode(email: string, code: string): Promise<boolean> {
  await simulateLatency()

  const loginCode = loginCodes.find((lc) => lc.email === email && lc.code === code && lc.expiresAt > new Date())

  if (loginCode) {
    // Eliminar el código después de verificarlo
    const index = loginCodes.indexOf(loginCode)
    loginCodes.splice(index, 1)
    return true
  }

  return false
}
