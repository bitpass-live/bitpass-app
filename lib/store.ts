import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export interface Ticket {
  id: string;
  title: string;
  amount: number;
  currency: 'ARS' | 'SAT';
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
  currency: 'ARS' | 'SAT';
  status: 'pending' | 'paid' | 'cancelled';
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
  discountType: 'PERCENTAGE' | 'FIXED';
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

// Actualizar la interfaz BitpassState para incluir discountCodes y sus acciones
interface BitpassState {
  events: Event[];
  sales: TicketSale[];
  roles: Role[];
  discountCodes: DiscountCode[];

  // Event actions
  addEvent: (event: Omit<Event, 'id' | 'published' | 'tickets'>) => string;
  updateEvent: (id: string, event: Partial<Event>) => void;
  publishEvent: (id: string) => void;
  unpublishEvent: (id: string) => void;

  // Ticket actions
  addTicket: (eventId: string, ticket: Omit<Ticket, 'id'>) => void;
  updateTicket: (eventId: string, ticketId: string, ticket: Partial<Ticket>) => void;
  deleteTicket: (eventId: string, ticketId: string) => void;

  // Sales actions
  createSale: (sale: Omit<TicketSale, 'id' | 'status' | 'checkIn'>) => string;
  completeSale: (saleId: string) => void;
  checkInTicket: (reference: string) => boolean;

  // Role actions
  addRole: (role: Role) => void;
  removeRole: (pubkey: string, eventId: string) => void;

  // Discount code actions
  addDiscountCode: (discountCode: Omit<DiscountCode, 'id' | 'used' | 'createdAt' | 'updatedAt'>) => string;
  updateDiscountCode: (id: string, discountCode: Partial<DiscountCode>) => void;
  deleteDiscountCode: (id: string) => void;
  validateDiscountCode: (
    code: string,
    eventId: string,
    ticketIds: string[],
  ) => {
    valid: boolean;
    discountCode?: DiscountCode;
    message?: string;
  };
  applyDiscountCode: (id: string) => void;
}

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

// Helper to generate reference codes
const generateReference = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Create store with persistence
export const useBitpassStore = create<BitpassState>()(
  persist(
    (set, get) => ({
      events: [
        {
          id: 'event123',
          title: 'Bitcoin Conference 2025',
          description:
            'El evento más importante de Bitcoin en LATAM. Únete a expertos, desarrolladores y entusiastas para explorar el futuro de las criptomonedas y la tecnología blockchain.',
          start: '2025-05-01T10:00:00Z',
          end: '2025-05-03T18:00:00Z',
          location: 'La Crypta, Buenos Aires',
          tickets: [{ id: 'ticket1', title: 'General', amount: 15000, currency: 'ARS', quantity: 100, sold: 15 }],
          published: true,
        },
      ],
      sales: [
        {
          id: 'sale123',
          reference: 'ABC123',
          buyer: 'npub1xyz...',
          eventId: 'event123',
          ticketId: 'ticket2',
          ticketTitle: 'VIP',
          quantity: 2,
          amount: 60000,
          currency: 'ARS',
          status: 'paid',
          checkIn: false,
        },
        {
          id: 'sale456',
          reference: 'ABC456',
          buyer: 'npub1xyz...',
          eventId: 'event456',
          ticketId: 'ticket2',
          ticketTitle: 'VIP',
          quantity: 2,
          amount: 60000,
          currency: 'ARS',
          status: 'paid',
          checkIn: false,
        },
        {
          id: 'sale789',
          reference: 'ABC789',
          buyer: 'npub1xyz...',
          eventId: 'event789',
          ticketId: 'ticket2',
          ticketTitle: 'VIP',
          quantity: 2,
          amount: 60000,
          currency: 'ARS',
          status: 'paid',
          checkIn: false,
        },
      ],
      roles: [
        { pubkey: 'npub1owner...', role: 'OWNER', eventId: 'event123' },
        { pubkey: 'npub1check...', role: 'CHECKIN', eventId: 'event123' },
      ],
      // En la creación del store, después de roles: [], agregar:
      discountCodes: [
        {
          id: 'discount1',
          code: 'EARLYBIRD',
          description: 'Descuento para early adopters',
          discountType: 'PERCENTAGE',
          value: 20,
          maxUses: 50,
          used: 5,
          validFrom: '2025-01-01T00:00:00Z',
          validUntil: '2025-12-31T23:59:59Z',
          eventId: 'event123',
          createdBy: 'npub1owner...',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          active: true,
        },
        {
          id: 'discount2',
          code: 'BITCOIN',
          description: 'Descuento para la comunidad Bitcoin',
          discountType: 'PERCENTAGE',
          value: 15,
          ticketIds: ['ticket1', 'ticket2'],
          eventId: 'event123',
          createdBy: 'npub1owner...',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          used: 0,
          active: true,
        },
      ],

      // Event actions
      addEvent: (eventData) => {
        const id = generateId();
        const newEvent = {
          ...eventData,
          id,
          tickets: [],
          published: false,
        };

        set((state) => ({
          events: [...state.events, newEvent],
        }));

        return id;
      },

      updateEvent: (id, eventData) => {
        set((state) => ({
          events: state.events.map((event) => (event.id === id ? { ...event, ...eventData } : event)),
        }));
      },

      publishEvent: (id) => {
        set((state) => ({
          events: state.events.map((event) => (event.id === id ? { ...event, published: true } : event)),
        }));
      },

      unpublishEvent: (id) => {
        set((state) => ({
          events: state.events.map((event) => (event.id === id ? { ...event, published: false } : event)),
        }));
      },

      // Ticket actions
      addTicket: (eventId, ticketData) => {
        const id = generateId();
        const newTicket = {
          ...ticketData,
          id,
          sold: 0,
        };

        set((state) => ({
          events: state.events.map((event) =>
            event.id === eventId ? { ...event, tickets: [...event.tickets, newTicket] } : event,
          ),
        }));
      },

      updateTicket: (eventId, ticketId, ticketData) => {
        set((state) => ({
          events: state.events.map((event) =>
            event.id === eventId
              ? {
                  ...event,
                  tickets: event.tickets.map((ticket) =>
                    ticket.id === ticketId ? { ...ticket, ...ticketData } : ticket,
                  ),
                }
              : event,
          ),
        }));
      },

      deleteTicket: (eventId, ticketId) => {
        set((state) => ({
          events: state.events.map((event) =>
            event.id === eventId
              ? {
                  ...event,
                  tickets: event.tickets.filter((ticket) => ticket.id !== ticketId),
                }
              : event,
          ),
        }));
      },

      // Sales actions
      createSale: (saleData) => {
        const id = generateId();
        const reference = generateReference();

        const newSale = {
          ...saleData,
          id,
          reference,
          status: 'pending' as const,
          checkIn: false,
        };

        set((state) => ({
          sales: [...state.sales, newSale],
        }));

        return id;
      },

      completeSale: (saleId) => {
        set((state) => {
          // Update sale status
          const updatedSales = state.sales.map((sale) =>
            sale.id === saleId ? { ...sale, status: 'paid' as const } : sale,
          );

          // Find the completed sale
          const completedSale = updatedSales.find((sale) => sale.id === saleId);

          if (completedSale) {
            // Update ticket sold count
            const updatedEvents = state.events.map((event) => {
              if (event.id === completedSale.eventId) {
                return {
                  ...event,
                  tickets: event.tickets.map((ticket) => {
                    if (ticket.id === completedSale.ticketId) {
                      return {
                        ...ticket,
                        sold: (ticket.sold || 0) + completedSale.quantity,
                      };
                    }
                    return ticket;
                  }),
                };
              }
              return event;
            });

            return {
              sales: updatedSales,
              events: updatedEvents,
            };
          }

          return { sales: updatedSales };
        });
      },

      checkInTicket: (reference) => {
        let success = false;

        set((state) => {
          const sale = state.sales.find((s) => s.reference === reference && s.status === 'paid' && !s.checkIn);

          if (sale) {
            success = true;
            return {
              sales: state.sales.map((s) =>
                s.id === sale.id ? { ...s, checkIn: true, checkInTime: new Date().toISOString() } : s,
              ),
            };
          }

          return state;
        });

        return success;
      },

      // Role actions
      addRole: (role) => {
        set((state) => ({
          roles: [...state.roles, role],
        }));
      },

      removeRole: (pubkey, eventId) => {
        set((state) => ({
          roles: state.roles.filter((r) => !(r.pubkey === pubkey && r.eventId === eventId)),
        }));
      },
      // Después de las acciones de roles, agregar las acciones de códigos de descuento:
      // Discount code actions
      addDiscountCode: (discountCodeData) => {
        const id = generateId();
        const now = new Date().toISOString();

        const newDiscountCode = {
          ...discountCodeData,
          id,
          used: 0,
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          discountCodes: [...state.discountCodes, newDiscountCode],
        }));

        return id;
      },

      updateDiscountCode: (id, discountCodeData) => {
        set((state) => ({
          discountCodes: state.discountCodes.map((code) =>
            code.id === id
              ? {
                  ...code,
                  ...discountCodeData,
                  updatedAt: new Date().toISOString(),
                }
              : code,
          ),
        }));
      },

      deleteDiscountCode: (id) => {
        set((state) => ({
          discountCodes: state.discountCodes.filter((code) => code.id !== id),
        }));
      },

      validateDiscountCode: (code, eventId, ticketIds) => {
        const state = get();
        const discountCode = state.discountCodes.find((dc) => dc.code === code && dc.eventId === eventId && dc.active);

        if (!discountCode) {
          return { valid: false, message: 'Código de descuento inválido o inactivo' };
        }

        // Verificar si se alcanzó el límite de usos
        if (discountCode.maxUses && discountCode.used >= discountCode.maxUses) {
          return { valid: false, message: 'El código de descuento ha alcanzado su límite de usos' };
        }

        return { valid: true, discountCode };
      },

      applyDiscountCode: (id) => {
        set((state) => ({
          discountCodes: state.discountCodes.map((code) =>
            code.id === id ? { ...code, used: code.used + 1, updatedAt: new Date().toISOString() } : code,
          ),
        }));
      },
    }),
    {
      name: 'bitpass-storage',
    },
  ),
);
