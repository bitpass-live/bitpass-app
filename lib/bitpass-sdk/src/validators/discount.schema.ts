import { z } from "zod";

export const CreateDiscountSchema = z.object({
  code: z
    .string()
    .min(1, "Code is required")
    .max(10, "Code must be at most 10 characters"), // ← límite de 10
  percentage: z
    .number()
    .min(1, "Percentage must be at least 1")
    .max(100, "Percentage cannot exceed 100"),
  expiresAt: z.string().optional(), // ISO datetime
  maxUses: z.number().int().positive().optional(),
});

export type CreateDiscountInput = z.infer<typeof CreateDiscountSchema>;

// El Update hereda el .max(10, …) en 'code' porque es partial()
export const UpdateDiscountSchema = CreateDiscountSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided" },
);

export type UpdateDiscountInput = z.infer<typeof UpdateDiscountSchema>;
