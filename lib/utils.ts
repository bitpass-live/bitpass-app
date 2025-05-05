import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Event } from './store';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function isEventLive(event: Event): boolean {
  const now = new Date();
  const start = new Date(event.start);
  const end = new Date(event.end);

  return now >= start && now <= end;
}

export function formatCurrency(amount: number, currency: 'SAT' | 'ARS' | 'USD'): string {
  if (currency === 'SAT') {
    return `${amount.toLocaleString()} sats`;
  }

  return `$${amount.toLocaleString()}`;
}
