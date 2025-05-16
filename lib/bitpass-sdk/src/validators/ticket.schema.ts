import { z } from "zod";

export const CurrencyEnum = z.enum(["USD", "SAT", "ARS"]);
export type Currency = z.infer<typeof CurrencyEnum>;

export const CreateTicketSchema = z.object({
  name:     z.string().min(1, "Name must be at least 1 character"),
  price:    z.number().nonnegative("Price must be ≥ 0"),
  currency: CurrencyEnum,
  quantity: z.number().int().min(1, "Quantity must be ≥ 1"),
});

export type CreateTicketInput = z.infer<typeof CreateTicketSchema>;

/**
 * Schema to update one or more fields of a ticket type.
 * At least one key must be present.
 */
export const UpdateTicketSchema = CreateTicketSchema.partial().refine(
  data => Object.keys(data).length > 0,
  { message: "At least one field must be provided" }
);

export type UpdateTicketInput = z.infer<typeof UpdateTicketSchema>;
