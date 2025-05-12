export interface Event {
    id: string;
    title: string;
    description: string;
    location: string;
    startsAt: string; // ISO
    endsAt: string;   // ISO
    status: "DRAFT" | "PUBLISHED";
    creatorId: string;
    createdAt: string;
    updatedAt: string;
}

export type TicketType = {
  id: string
  eventId: string
  name: string
  price: number
  currency: 'USD' | 'ARS' | 'SAT'
  quantity: number
  createdAt: string
  updatedAt: string
}