export interface Ticket {
  id: string;
  eventId: string;
  ticketTypeId: string;
  orderId: string;
  ownerId: string;
  isCheckedIn: boolean;
  orderItemOrderId?: string | null;
  orderItemTicketTypeId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type AdminTicketType = {
  id: string;
  name: string;
  price: number;
  currency: string;
  quantity: number;
  soldCount: number;
  eventId: string;
  createdAt: string;
  updatedAt: string;
  orders: {
    id: string;
    buyerId: string;
    quantity: number;
    price: number;
  }[];
  tickets: {
    id: string;
    ownerId: string;
    isCheckedIn: boolean;
  }[];
};

export interface AdminOrderWithTickets {
  id: string;
  totalAmount: number;
  createdAt: string;
  buyer: {
    id: string;
    email: string | null;
    nostrPubKey: string | null;
  };
  tickets: {
    id: string;
    isCheckedIn: boolean;
    ticketType: {
      id: string;
      name: string;
    };
  }[];
}