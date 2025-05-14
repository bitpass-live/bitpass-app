import { DiscountCode } from "./discount";
import { PaymentMethod } from "./payment";

export interface Event {
    id: string;
    title: string;
    description: string;
    location: string;
    startsAt: string;
    endsAt: string;
    status: "DRAFT" | "PUBLISHED";
    creatorId: string;
    createdAt: string;
    updatedAt: string;
}

export type TeamMember = {
  eventId: string;
  userId: string;
  role: 'OWNER' | 'MODERATOR' | 'COLLABORATOR';
  createdAt: string;
  user?: {
    id: string;
    name?: string;
    email?: string;
  };
};

export interface TicketTypeWithSoldCount extends TicketType {
  soldCount: number;
}

export interface FullEvent extends Event {
  ticketTypes: TicketTypeWithSoldCount[];
  discountCodes: DiscountCode[];
  team: TeamMember[];
  paymentMethods: PaymentMethod[];
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