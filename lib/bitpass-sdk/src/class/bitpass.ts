import type { Event as NostrEvent } from "nostr-tools";
import type { Event as EventModel } from "../types/event";
import type {
  CreateEventInput,
  UpdateEventInput,
} from "../validators/event.schema";
import {
  CreateEventSchema,
  UpdateEventSchema,
} from "../validators/event.schema";
import type {
  CreateTicketInput,
  UpdateTicketInput,
} from "../validators/ticket.schema";
import {
  CreateTicketSchema,
  UpdateTicketSchema,
} from "../validators/ticket.schema";
import type { User, AuthResponse } from "../types/user";
import { CheckInResponse, TicketInfo } from "../types/checkin";
import type {
  CreateDiscountInput,
  UpdateDiscountInput,
} from "../validators/discount.schema";
import {
  CreateDiscountSchema,
  UpdateDiscountSchema,
} from "../validators/discount.schema";
import { z } from "zod";
import type { DiscountCode } from "../types/discount";

export class Bitpass {
  /**
   * @param config.baseUrl Base URL of the Bitpass API (no trailing slash)
   */
  constructor(config: { baseUrl: string }) {
    this.baseUrl = config.baseUrl.replace(/\/+$/, "");
  }

  private baseUrl: string;
  private token: string | null = null;

  /** Internal: builds headers, including Authorization if set */
  private get headers(): Record<string, string> {
    const hdrs: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (this.token) {
      hdrs["Authorization"] = `Bearer ${this.token}`;
    }
    return hdrs;
  }

  /**
   * Request an OTP to be sent to the given email.
   * @param email Email address to request OTP for.
   */
  async requestOtp(email: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/auth/request-otp`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error ?? "Failed to request OTP");
    }
  }

  /**
   * Verify the OTP code and authenticate the user.
   * @param email Email used to request the OTP.
   * @param code OTP code received.
   * @returns AuthResponse con token y user.
   */
  async verifyOtp(email: string, code: string): Promise<AuthResponse> {
    const res = await fetch(`${this.baseUrl}/auth/verify-otp`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({ email, code }),
    });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error ?? "Failed to verify OTP");
    }

    this.token = data.token;
    return data;
  }

  /**
   * Verify a Nostr NIP-98 event and authenticate the user.
   * @param event Nostr NIP-98 event to verify.
   * @returns Authenticated user.
   */
  async verifyNostr(event: NostrEvent): Promise<AuthResponse> {
    const res = await fetch(`${this.baseUrl}/auth/verify-nostr`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(event),
    });
    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error ?? "Failed to verify Nostr event");
    }
    const data: AuthResponse = await res.json();
    this.token = data.token;
    return data;
  }

  /**
   * Manually set the JWT token (e.g. from localStorage).
   * @param token JWT token string.
   */
  setToken(token: string): void {
    this.token = token;
  }

  /**
   * Create a new draft event.
   * @param input Data for the new event.
   * @returns The created Event record.
   */
  async createDraftEvent(input: CreateEventInput): Promise<EventModel> {
    CreateEventSchema.parse(input);
    if (!this.token) throw new Error("Unauthorized: please authenticate first");
    const res = await fetch(`${this.baseUrl}/events`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      const payload = await res.json();
      const errorMsg = payload.details
        ? payload.details.map((d: any) => `${d.path}: ${d.message}`).join("; ")
        : payload.error ?? "Failed to create draft event";
      throw new Error(errorMsg);
    }
    return res.json();
  }

  /**
   * List public events.
   * @returns Array of public events.
   */
  async listPublicEvents(): Promise<EventModel[]> {
    const res = await fetch(`${this.baseUrl}/events`, {
      method: "GET",
      headers: this.headers,
    });
    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error ?? "Failed to list events");
    }
    return res.json();
  }

  /**
   * Get a single (public) event by ID.
   * @param eventId UUID of the event.
   * @returns Event details.
   */
  async getEvent(eventId: string): Promise<EventModel> {
    const res = await fetch(`${this.baseUrl}/events/${eventId}`, {
      method: "GET",
      headers: this.headers,
    });
    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error ?? "Failed to fetch event");
    }
    return res.json();
  }

  /**
   * Fetch a draft event (owner or moderator).
   * @param eventId UUID of the draft event.
   * @returns Draft event details.
   */
  async getDraftEvent(eventId: string): Promise<EventModel> {
    if (!this.token) throw new Error("Unauthorized: please authenticate first");
    const res = await fetch(`${this.baseUrl}/events/${eventId}`, {
      method: "GET",
      headers: this.headers,
    });
    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error ?? "Failed to fetch draft event");
    }
    return res.json();
  }

  /**
   * Update a draft event.
   * @param eventId UUID of the draft event.
   * @param input Partial data to update.
   * @returns The updated Event record.
   */
  async updateEvent(
    eventId: string,
    input: UpdateEventInput
  ): Promise<EventModel> {
    UpdateEventSchema.parse(input);
    if (!this.token) throw new Error("Unauthorized: please authenticate first");
    const res = await fetch(`${this.baseUrl}/events/${eventId}`, {
      method: "PATCH",
      headers: this.headers,
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error ?? "Failed to update event");
    }
    return res.json();
  }

  /**
   * Delete a draft event.
   * @param eventId UUID of the draft event.
   */
  async deleteEvent(eventId: string): Promise<void> {
    if (!this.token) throw new Error("Unauthorized: please authenticate first");
    const res = await fetch(`${this.baseUrl}/events/${eventId}`, {
      method: "DELETE",
      headers: this.headers,
    });
    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error ?? "Failed to delete event");
    }
  }

  /**
   * Publish a draft event.
   * @param eventId UUID of the draft event.
   * @returns Object containing id and new status.
   */
  async publishEvent(
    eventId: string
  ): Promise<{ id: string; status: "PUBLISHED" }> {
    if (!this.token) throw new Error("Unauthorized: please authenticate first");
    const res = await fetch(`${this.baseUrl}/events/${eventId}/publish`, {
      method: "PATCH",
      headers: this.headers,
    });
    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error ?? "Failed to publish event");
    }
    return res.json();
  }

  /**
   * Fetch public ticket types for a published event.
   * @param eventId UUID of the event.
   * @returns Array of ticket types.
   */
  async getPublicTickets(eventId: string): Promise<any[]> {
    const res = await fetch(`${this.baseUrl}/events/${eventId}/tickets`, {
      method: "GET",
      headers: this.headers,
    });
    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error ?? "Failed to fetch public tickets");
    }
    return res.json();
  }

  /**
   * Fetch detailed ticket types for an event (admin view).
   * @param eventId UUID of the event.
   * @returns Array of ticket types with orders & tickets.
   */
  async getAdminTickets(eventId: string): Promise<any[]> {
    if (!this.token) throw new Error("Unauthorized: please authenticate first");
    const res = await fetch(
      `${this.baseUrl}/events/${eventId}/tickets/admin`,
      {
        method: "GET",
        headers: this.headers,
      }
    );
    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error ?? "Failed to fetch admin tickets");
    }
    return res.json();
  }

  /**
   * Create a new ticket type under a draft event.
   * @param eventId UUID of the draft event.
   * @param input Ticket type details.
   * @returns The created TicketType record.
   */
  async createTicketType(
    eventId: string,
    input: CreateTicketInput
  ): Promise<any> {
    CreateTicketSchema.parse(input);
    if (!this.token) throw new Error("Unauthorized: please authenticate first");
    const res = await fetch(
      `${this.baseUrl}/events/${eventId}/tickets`,
      {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(input),
      }
    );
    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error ?? "Failed to create ticket type");
    }
    return res.json();
  }

  /**
   * Update a ticket type under a draft event.
   * @param eventId UUID of the draft event.
   * @param ticketId UUID of the ticket type.
   * @param input Partial ticket type data to update.
   * @returns The updated TicketType record.
   */
  async updateTicketType(
    eventId: string,
    ticketId: string,
    input: UpdateTicketInput
  ): Promise<any> {
    UpdateTicketSchema.parse(input);
    if (!this.token) throw new Error("Unauthorized: please authenticate first");
    const res = await fetch(
      `${this.baseUrl}/events/${eventId}/tickets/${ticketId}`,
      {
        method: "PATCH",
        headers: this.headers,
        body: JSON.stringify(input),
      }
    );
    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error ?? "Failed to update ticket type");
    }
    return res.json();
  }

  /**
   * Delete a ticket type under a draft event.
   * @param eventId UUID of the draft event.
   * @param ticketId UUID of the ticket type.
   */
  async deleteTicketType(
    eventId: string,
    ticketId: string
  ): Promise<void> {
    if (!this.token) throw new Error("Unauthorized: please authenticate first");
    const res = await fetch(
      `${this.baseUrl}/events/${eventId}/tickets/${ticketId}`,
      {
        method: "DELETE",
        headers: this.headers,
      }
    );
    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error ?? "Failed to delete ticket type");
    }
  }

  /**
   * Fetch ticket information for check-in.
   * @param ticketId UUID of the ticket to fetch.
   * @returns TicketInfo object.
   */
  async fetchTicket(ticketId: string): Promise<TicketInfo> {
    if (!this.token) throw new Error("Unauthorized: please authenticate first");
    const res = await fetch(`${this.baseUrl}/checkin/${ticketId}`, {
      method: "GET",
      headers: this.headers,
    });
    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error ?? "Failed to fetch ticket information");
    }
    return res.json();
  }

  /**
   * Mark a ticket as checked-in.
   * @param ticketId UUID of the ticket.
   * @returns CheckInResponse with updated status.
   */
  async checkInTicket(ticketId: string): Promise<CheckInResponse> {
    if (!this.token) throw new Error("Unauthorized: please authenticate first");
    const res = await fetch(
      `${this.baseUrl}/checkin/${ticketId}/use`,
      {
        method: "PATCH",
        headers: this.headers,
      }
    );
    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error ?? "Failed to check in ticket");
    }
    return res.json();
  }

  /**
   * List all discount codes for an event.
   * @param eventId UUID of the event.
   * @returns Array of DiscountCode.
   */
  async listDiscountCodes(eventId: string): Promise<DiscountCode[]> {
    if (!this.token) throw new Error("Unauthorized: please authenticate first");
    const res = await fetch(
      `${this.baseUrl}/events/${eventId}/discount-codes`,
      { method: "GET", headers: this.headers }
    );
    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error ?? "Failed to list discount codes");
    }
    return res.json();
  }

  /**
   * Create a new discount code under a draft event.
   * @param eventId UUID of the event.
   * @param input Discount code details.
   * @returns The created DiscountCode record.
   */
  async createDiscountCode(
    eventId: string,
    input: CreateDiscountInput
  ): Promise<DiscountCode> {
    CreateDiscountSchema.parse(input);
    if (!this.token) throw new Error("Unauthorized: please authenticate first");
    const res = await fetch(
      `${this.baseUrl}/events/${eventId}/discount-codes`,
      {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(input),
      }
    );
    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error ?? "Failed to create discount code");
    }
    return res.json();
  }

  /**
   * Verify (validate) a discount code for an event.
   * @param eventId UUID of the event.
   * @param code Discount code to verify.
   * @returns True if valid.
   */
  async verifyDiscountCode(
    eventId: string,
    code: string
  ): Promise<boolean> {
    const body = z.object({ code: z.string().min(1) }).parse({ code });
    if (!this.token) throw new Error("Unauthorized: please authenticate first");
    const res = await fetch(
      `${this.baseUrl}/events/${eventId}/discount-codes/verify`,
      {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(body),
      }
    );
    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error ?? "Failed to verify discount code");
    }
    const { valid } = await res.json();
    return valid === true;
  }

  /**
   * Update one or more fields of an existing discount code.
   * @param eventId UUID of the event.
   * @param codeId UUID of the discount code.
   * @param input Partial discount code data to update.
   * @returns The updated DiscountCode record.
   */
  async updateDiscountCode(
    eventId: string,
    codeId: string,
    input: UpdateDiscountInput
  ): Promise<DiscountCode> {
    UpdateDiscountSchema.parse(input);
    if (!this.token) throw new Error("Unauthorized: please authenticate first");
    const res = await fetch(
      `${this.baseUrl}/events/${eventId}/discount-codes/${codeId}`,
      {
        method: "PATCH",
        headers: this.headers,
        body: JSON.stringify(input),
      }
    );
    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error ?? "Failed to update discount code");
    }
    return res.json();
  }

  /**
   * Delete a discount code.
   * @param eventId UUID of the event.
   * @param codeId UUID of the discount code.
   */
  async deleteDiscountCode(
    eventId: string,
    codeId: string
  ): Promise<void> {
    if (!this.token) throw new Error("Unauthorized: please authenticate first");
    const res = await fetch(
      `${this.baseUrl}/events/${eventId}/discount-codes/${codeId}`,
      { method: "DELETE", headers: this.headers }
    );
    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error ?? "Failed to delete discount code");
    }
  }

  /**
   * Invite a new team member.
   * @param eventId UUID of the event.
   * @param userId UUID of the user to add.
   * @param role Role to assign: OWNER, MODERATOR, or COLLABORATOR.
   * @returns The created team member record.
   */
  async addTeamMember(
    eventId: string,
    userId: string,
    role: "MODERATOR" | "COLLABORATOR"
  ): Promise<{ userId: string; role: string }> {
    if (!this.token) throw new Error("Unauthorized: please authenticate first");
    const res = await fetch(`${this.baseUrl}/events/${eventId}/team`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({ userId, role }),
    });
    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error ?? "Failed to add team member");
    }
    return res.json();
  }

  /**
   * List all team members for an event.
   * @param eventId UUID of the event.
   * @returns Array of team members.
   */
  async listTeamMembers(
    eventId: string
  ): Promise<Array<{ userId: string; role: string }>> {
    if (!this.token) throw new Error("Unauthorized: please authenticate first");
    const res = await fetch(`${this.baseUrl}/events/${eventId}/team`, {
      method: "GET",
      headers: this.headers,
    });
    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error ?? "Failed to list team members");
    }
    return res.json();
  }

  /**
   * Update a team member’s role.
   * @param eventId UUID of the event.
   * @param userId UUID of the team member.
   * @param role New role: OWNER, MODERATOR, or COLLABORATOR.
   * @returns The updated team member record.
   */
  async updateTeamMember(
    eventId: string,
    userId: string,
    role: "OWNER" | "MODERATOR" | "COLLABORATOR"
  ): Promise<{ userId: string; role: string }> {
    if (!this.token) throw new Error("Unauthorized: please authenticate first");
    const res = await fetch(
      `${this.baseUrl}/events/${eventId}/team/${userId}`,
      {
        method: "PATCH",
        headers: this.headers,
        body: JSON.stringify({ role }),
      }
    );
    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error ?? "Failed to update team member");
    }
    return res.json();
  }

  /**
   * Remove a team member.
   * @param eventId UUID of the event.
   * @param userId UUID of the team member.
   */
  async deleteTeamMember(eventId: string, userId: string): Promise<void> {
    if (!this.token) throw new Error("Unauthorized: please authenticate first");
    const res = await fetch(
      `${this.baseUrl}/events/${eventId}/team/${userId}`,
      {
        method: "DELETE",
        headers: this.headers,
      }
    );
    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error ?? "Failed to delete team member");
    }
  }

  /**
   * Get the authenticated user’s profile.
   * @returns User profile.
   */
  async getUserProfile(): Promise<User> {
    if (!this.token) throw new Error("Unauthorized: please authenticate first");
    const res = await fetch(`${this.baseUrl}/users/me`, {
      method: "GET",
      headers: this.headers,
    });
    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error ?? "Failed to fetch user profile");
    }
    return res.json();
  }

  /**
   * Fetches all events for the authenticated user.
   *
   * @async
   * @method getUserEvents
   * @memberof Bitpass
   * @returns {Promise<EventModel[]>} An array of Event objects.
   * @throws {Error} If the network request fails or returns a non-OK response.
   */
  async getUserEvents(): Promise<EventModel[]> {
    const res = await fetch(`${this.baseUrl}/users/me/events`, {
      headers: this.headers,
    });
    if (!res.ok) {
      throw new Error('Failed to fetch user events');
    }
    /** @type {EventModel[]} */
    const events = await res.json();
    return events;
  }

  /**
   * Configure a new Lightning payment method.
   * @param lightningAddress Lightning address (LUD16).
   * @returns Created payment method.
   */
  async addLightningPaymentMethod(
    lightningAddress: string
  ): Promise<any> {
    const body = z.object({ lightningAddress: z.string().min(1) }).parse({
      lightningAddress,
    });
    if (!this.token) throw new Error("Unauthorized: please authenticate first");
    const res = await fetch(
      `${this.baseUrl}/users/me/payment-methods/lightning`,
      {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(body),
      }
    );
    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error ?? "Failed to add payment method");
    }
    return res.json();
  }

  /**
   * List all configured payment methods.
   * @returns Array of payment methods.
   */
  async listPaymentMethods(): Promise<any[]> {
    if (!this.token) throw new Error("Unauthorized: please authenticate first");
    const res = await fetch(`${this.baseUrl}/users/me/payment-methods`, {
      method: "GET",
      headers: this.headers,
    });
    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error ?? "Failed to list payment methods");
    }
    return res.json();
  }

  /**
   * Update a Lightning payment method.
   * @param pmId UUID of the payment method.
   * @param lightningAddress New Lightning address.
   * @returns Updated payment method.
   */
  async updateLightningPaymentMethod(
    pmId: string,
    lightningAddress: string
  ): Promise<any> {
    const body = z.object({ lightningAddress: z.string().min(1) }).parse({
      lightningAddress,
    });
    if (!this.token) throw new Error("Unauthorized: please authenticate first");
    const res = await fetch(
      `${this.baseUrl}/users/me/payment-methods/${pmId}/lightning`,
      {
        method: "PATCH",
        headers: this.headers,
        body: JSON.stringify(body),
      }
    );
    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error ?? "Failed to update payment method");
    }
    return res.json();
  }

  /**
   * Delete a configured payment method.
   * @param pmId UUID of the payment method.
   */
  async deletePaymentMethod(pmId: string): Promise<void> {
    if (!this.token) throw new Error("Unauthorized: please authenticate first");
    const res = await fetch(
      `${this.baseUrl}/users/me/payment-methods/${pmId}`,
      {
        method: "DELETE",
        headers: this.headers,
      }
    );
    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error ?? "Failed to delete payment method");
    }
  }
}