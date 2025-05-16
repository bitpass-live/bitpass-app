// Types
export type Currencies = 'SAT' | 'ARS' | 'USD';
type ListStatus = 'pending' | 'paid' | 'cancelled';

export interface Ticket {
  id: string;
  title: string;
  amount: number;
  currency: Currencies;
  quantity: number;
  sold?: number;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  start: string;
  end: string;
  location: string;
  tickets: Ticket[];
  published: boolean;
}

export interface TicketSale {
  id: string;
  reference: string;
  buyer: string;
  eventId: string;
  ticketId: string;
  ticketTitle: string;
  quantity: number;
  amount: number;
  currency: Currencies | string;
  status: ListStatus | string;
  checkIn: boolean;
  checkInTime?: string;
}

export interface Role {
  pubkey: string;
  role: 'OWNER' | 'MODERATOR' | 'CHECKIN';
  eventId: string;
}

// Después de la interfaz Role, agregar la interfaz DiscountCode
export interface DiscountCode {
  id: string;
  code: string;
  description?: string;
  discountType: string | 'PERCENTAGE' | 'FIXED';
  value: number;
  maxUses?: number;
  used: number;
  validFrom?: string;
  validUntil?: string;
  ticketIds?: string[];
  eventId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  active: boolean;
}
