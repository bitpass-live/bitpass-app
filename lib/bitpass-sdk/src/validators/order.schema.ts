import { z } from "zod";

export const CreateOrderSchema = z.object({
    eventId: z.string().min(1),
    ticketTypes: z
        .array(
            z.object({
                ticketTypeId: z.string().min(1),
                quantity: z.number().int().positive(),
            }),
        )
        .min(1),
    discountCode: z.string().optional(),
    paymentMethodId: z.string().optional(),
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;