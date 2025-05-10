// src/types/window.nostr.d.ts
import type { Event as NostrEvent } from 'nostr-tools';

export interface NostrExtension {
  /** Devuelve la clave pública del usuario */
  getPublicKey(): Promise<string>;
  /** Firma un evento NIP-98 y devuelve el evento completo */
  signEvent(event: Omit<NostrEvent, 'id' | 'sig'>): Promise<NostrEvent>;
  /** (Opcional) Métodos de cifrado NIP-04 si la extensión los soporta */
  nip04?: {
    encrypt(pubkey: string, plaintext: string): Promise<string>;
    decrypt(pubkey: string, ciphertext: string): Promise<string>;
  };
}

declare global {
  interface Window {
    /** La extensión Nostr inyectada (Alby, etc.) */
    nostr?: NostrExtension;
  }
}

// Esto hace que TypeScript trate el archivo como módulo
export {};
