import { v4 as uuidv4 } from "uuid"

export interface User {
  id: string
  email: string
  nostrPubKey: string | null
  name: string | null
  createdAt: Date
  updatedAt: Date
}

export const users: User[] = [
  {
    id: "user-123",
    email: "alice@example.com",
    nostrPubKey: "npub1abc123...",
    name: "Alice",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "user-456",
    email: "bob@example.com",
    nostrPubKey: null,
    name: "Bob",
    createdAt: new Date("2023-01-05"),
    updatedAt: new Date("2023-01-05"),
  },
  {
    id: "user-789",
    email: "carol@example.com",
    nostrPubKey: "npub1xyz789...",
    name: "Carol",
    createdAt: new Date("2023-01-10"),
    updatedAt: new Date("2023-01-10"),
  },
]

// Simular latencia de red/base de datos
const simulateLatency = async () => {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), Math.random() * 300 + 100) // Entre 100ms y 400ms
  })
}

export async function getUserById(id: string): Promise<User | null> {
  await simulateLatency()
  const user = users.find((u) => u.id === id)
  return user || null
}

export async function getUserByEmail(email: string): Promise<User | null> {
  await simulateLatency()
  const user = users.find((u) => u.email === email)
  return user || null
}

export async function getUserByNostrPubKey(nostrPubKey: string): Promise<User | null> {
  await simulateLatency()
  const user = users.find((u) => u.nostrPubKey === nostrPubKey)
  return user || null
}

export async function createUser(data: {
  email: string
  nostrPubKey?: string | null
  name?: string | null
}): Promise<User> {
  await simulateLatency()

  const newUser: User = {
    id: uuidv4(),
    email: data.email,
    nostrPubKey: data.nostrPubKey || null,
    name: data.name || null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  users.push(newUser)
  return newUser
}

export async function updateUser(id: string, data: Partial<User>): Promise<User | null> {
  await simulateLatency()

  const userIndex = users.findIndex((u) => u.id === id)
  if (userIndex === -1) return null

  const updatedUser = {
    ...users[userIndex],
    ...data,
    updatedAt: new Date(),
  }

  users[userIndex] = updatedUser
  return updatedUser
}
