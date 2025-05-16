/**
 * Represents a user returned by the Bitpass API.
 */
export interface User {
  /** UUID of the user */
  id: string;
  /** Email if authenticated via OTP */
  email?: string;
  /** Nostr public key if authenticated via Nostr */
  nostrPubKey?: string;
}

/**
 * Shape of the response when verifying OTP or Nostr login.
 */
export interface AuthResponse {
  /** Always true on success */
  success: true;
  /** JWT issued by the API */
  token: string;
  /** Authenticated user data */
  user: User;
}