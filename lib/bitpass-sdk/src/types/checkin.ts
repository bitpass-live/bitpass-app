export interface TicketInfo {
  id: string;
  eventId: string;
  ticketType: {
    id: string;
    name: string;
    price: number;
    currency: string;
  };
  ownerId: string;
  isCheckedIn: boolean;
}

export interface CheckInResponse {
  id: string;
  isCheckedIn: true;
}