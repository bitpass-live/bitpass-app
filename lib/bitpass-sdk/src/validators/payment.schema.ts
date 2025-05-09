import { z } from "zod";

/**
 * Body schema for adding a Lightning payment method.
 */
export const CreateLightningSchema = z.object({
  lightningAddress: z
    .string()
    .min(3, "Lightning address is required")
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid Lightning address format (expected user@domain)",
    ),
});

export type CreateLightningInput = z.infer<typeof CreateLightningSchema>;
