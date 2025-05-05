import { v4 as uuidv4 } from "uuid"

export type EventStatus = "DRAFT" | "PUBLISHED"

export interface Event {
  id: string
  title: string
  description: string | null
  location: string
  startsAt: Date
  endsAt: Date
  status: EventStatus
  creatorId: string
  createdAt: Date
  updatedAt: Date
}

export const events: Event[] = [
  {
    id: "event-123",
    title: "Bitcoin Conference 2025",
    description: "The biggest Bitcoin event in LATAM",
    location: "La Crypta, Buenos Aires",
    startsAt: new Date("2025-05-01T10:00:00Z"),
    endsAt: new Date("2025-05-03T18:00:00Z"),
    status: "PUBLISHED",
    creatorId: "user-123",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-01-15"),
  },
  {
    id: "event-456",
    title: "Lightning Hackathon",
    description: "Build the future of Bitcoin payments",
    location: "Online",
    startsAt: new Date("2025-06-15T09:00:00Z"),
    endsAt: new Date("2025-06-17T20:00:00Z"),
    status: "DRAFT",
    creatorId: "user-123",
    createdAt: new Date("2023-02-20"),
    updatedAt: new Date("2023-02-20"),
  },
  {
    id: "event-789",
    title: "Nostr Meetup",
    description: "Connect with the Nostr community",
    location: "Club Bitcoin, Buenos Aires",
    startsAt: new Date("2025-04-10T18:00:00Z"),
    endsAt: new Date("2025-04-10T22:00:00Z"),
    status: "PUBLISHED",
    creatorId: "user-789",
    createdAt: new Date("2023-03-25"),
    updatedAt: new Date("2023-03-25"),
  },
]

// Simular latencia de red/base de datos
const simulateLatency = async () => {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), Math.random() * 300 + 100) // Entre 100ms y 400ms
  })
}

export async function getUserEvents(userId: string): Promise<Event[]> {
  await simulateLatency()
  return events.filter((event) => event.creatorId === userId)
}

export async function getEventById(id: string): Promise<Event | null> {
  await simulateLatency()
  const event = events.find((e) => e.id === id)
  return event || null
}

export async function createEvent(data: {
  title: string
  description?: string
  location: string
  startsAt: Date
  endsAt: Date
  creatorId: string
}): Promise<Event> {
  await simulateLatency()

  const newEvent: Event = {
    id: uuidv4(),
    title: data.title,
    description: data.description || null,
    location: data.location,
    startsAt: data.startsAt,
    endsAt: data.endsAt,
    status: "DRAFT",
    creatorId: data.creatorId,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  events.push(newEvent)
  return newEvent
}

export async function updateEvent(id: string, data: Partial<Event>): Promise<Event | null> {
  await simulateLatency()

  const eventIndex = events.findIndex((e) => e.id === id)
  if (eventIndex === -1) return null

  const updatedEvent = {
    ...events[eventIndex],
    ...data,
    updatedAt: new Date(),
  }

  events[eventIndex] = updatedEvent
  return updatedEvent
}

export async function deleteEvent(id: string): Promise<Event | null> {
  await simulateLatency()

  const eventIndex = events.findIndex((e) => e.id === id)
  if (eventIndex === -1) return null

  const deletedEvent = events[eventIndex]
  events.splice(eventIndex, 1)
  return deletedEvent
}
