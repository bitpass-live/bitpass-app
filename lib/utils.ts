import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { Event } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNostrPubkey(pubkey: string, start: number = 6, end: number = 6): string {
  if (!pubkey || pubkey.length <= start + end) return pubkey;
  return `${pubkey.slice(0, start)}...${pubkey.slice(-end)}`;
}

export const requiredEnvVar = (key: string): string => {
  const envVar = process.env[key];
  if (undefined === envVar) {
    throw new Error(`Environment process ${key} must be defined`);
  }
  return envVar;
};

export function getErrorMessage(err: unknown, defaultMessage: string = 'Something went wrong'): string {
  if (typeof err === 'object' && err !== null) {
    const anyErr = err as any;
    if (Array.isArray(anyErr.issues) && anyErr.issues[0]?.message) {
      return anyErr.issues[0].message;
    }
    if (typeof anyErr.message === 'string') {
      return anyErr.message;
    }
  }

  return defaultMessage;
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
    return `${amount.toLocaleString()} ${currency}`;
  }

  return `$${amount.toLocaleString()} ${currency}`;
}
