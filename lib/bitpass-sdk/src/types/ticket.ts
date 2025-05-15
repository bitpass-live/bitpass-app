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