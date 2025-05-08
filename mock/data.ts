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
export const MOCK_EVENTS = [
  {
    id: 'event123',
    title: 'Bitcoin Conference 2025',
    description:
      'The most important Bitcoin event in Latin America. Join experts, developers, and enthusiasts to explore the future of cryptocurrencies and blockchain technology.',
    start: '2025-05-01T10:00:00Z',
    end: '2025-05-03T18:00:00Z',
    location: 'La Crypta, Buenos Aires',
    tickets: [{ id: 'ticket1', title: 'General', amount: 150, currency: 'USD', quantity: 100, sold: 15 }],
    published: true,
  },
  {
    id: 'event456',
    title: 'Nostr Conference 2025',
    description:
      'The most important Nostr event in Latin America. Join experts, developers, and enthusiasts to explore the future of cryptocurrencies and blockchain technology.',
    start: '2026-05-01T10:00:00Z',
    end: '2026-05-03T18:00:00Z',
    location: 'Rome, Italy',
    tickets: [
      { id: 'ticket1', title: 'General', amount: 150, currency: 'USD', quantity: 500, sold: 150 },
      { id: 'ticket2', title: 'Premium', amount: 1500, currency: 'USD', quantity: 100, sold: 0 },
    ],
    published: true,
  },
];

export const MOCK_EVENT = {
  id: 'event123',
  title: 'Bitcoin Conference 2025',
  description:
    'The most important Bitcoin event in Latin America. Join experts, developers, and enthusiasts to explore the future of cryptocurrencies and blockchain technology.',
  start: '2025-05-01T10:00:00Z',
  end: '2025-05-03T18:00:00Z',
  location: 'La Crypta, Buenos Aires',
  tickets: [{ id: 'ticket1', title: 'General', amount: 150, currency: 'USD', quantity: 100, sold: 15 }],
  published: true,
};

export const MOCK_SALES = [
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
];

export const MOCK_DISCOUNTS_CODES = [
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
    createdAt: '',
    updatedAt: '',
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
    createdAt: '',
    updatedAt: '',
    used: 0,
    active: true,
  },
];

export const MOCK_ROLES = [
  { pubkey: 'npub1owner...', role: 'OWNER', eventId: 'event123' },
  { pubkey: 'npub1check...', role: 'CHECKIN', eventId: 'event123' },
];
