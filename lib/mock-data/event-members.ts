export type EventRole = "OWNER" | "COLLABORATOR"

export interface EventMember {
  eventId: string
  userId: string
  role: EventRole
  createdAt: Date
}

export const eventMembers: EventMember[] = [
  {
    eventId: "event-123",
    userId: "user-123",
    role: "OWNER",
    createdAt: new Date("2023-01-15"),
  },
  {
    eventId: "event-456",
    userId: "user-123",
    role: "OWNER",
    createdAt: new Date("2023-02-20"),
  },
  {
    eventId: "event-789",
    userId: "user-789",
    role: "OWNER",
    createdAt: new Date("2023-03-25"),
  },
  {
    eventId: "event-123",
    userId: "user-456",
    role: "COLLABORATOR",
    createdAt: new Date("2023-01-20"),
  },
]

// Simular latencia de red/base de datos
const simulateLatency = async () => {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), Math.random() * 300 + 100) // Entre 100ms y 400ms
  })
}

export async function getEventMembers(eventId: string): Promise<EventMember[]> {
  await simulateLatency()
  return eventMembers.filter((member) => member.eventId === eventId)
}

export async function getMemberRole(eventId: string, userId: string): Promise<EventRole | null> {
  await simulateLatency()
  const member = eventMembers.find((m) => m.eventId === eventId && m.userId === userId)
  return member ? member.role : null
}

export async function addEventMember(data: {
  eventId: string
  userId: string
  role: EventRole
}): Promise<EventMember> {
  await simulateLatency()

  // Verificar si ya existe
  const existingMember = eventMembers.find((m) => m.eventId === data.eventId && m.userId === data.userId)

  if (existingMember) {
    throw new Error("Member already exists for this event")
  }

  const newMember: EventMember = {
    eventId: data.eventId,
    userId: data.userId,
    role: data.role,
    createdAt: new Date(),
  }

  eventMembers.push(newMember)
  return newMember
}

export async function updateEventMemberRole(
  eventId: string,
  userId: string,
  role: EventRole,
): Promise<EventMember | null> {
  await simulateLatency()

  const memberIndex = eventMembers.findIndex((m) => m.eventId === eventId && m.userId === userId)

  if (memberIndex === -1) return null

  const updatedMember = {
    ...eventMembers[memberIndex],
    role,
  }

  eventMembers[memberIndex] = updatedMember
  return updatedMember
}

export async function removeEventMember(eventId: string, userId: string): Promise<boolean> {
  await simulateLatency()

  const index = eventMembers.findIndex((member) => member.eventId === eventId && member.userId === userId)

  if (index === -1) return false

  eventMembers.splice(index, 1)
  return true
}
