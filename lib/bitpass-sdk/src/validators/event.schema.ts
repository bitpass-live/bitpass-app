import { z } from "zod";

const EventShape = {
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z
    .string()
    .max(1000, "Description must be 1000 characters or less")
    .optional(),
  location: z.string().min(2, "Location is required"),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  startTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Time must be in HH:mm format"),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  endTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Time must be in HH:mm format"),
};

export const CreateEventSchema = z
  .object(EventShape)
  .refine(
    data => {
      const start = new Date(`${data.startDate}T${data.startTime}:00`);
      const end = new Date(`${data.endDate}T${data.endTime}:00`);
      return end > start;
    },
    {
      message: "End date and time must be after start date and time",
      path: ["endDate"],
    }
  );

export const UpdateEventSchema = z
  .object(EventShape)
  .partial() 
  .refine(
    data => Object.keys(data).length > 0,
    { message: "At least one field must be provided" }
  );

export type CreateEventInput = z.infer<typeof CreateEventSchema>;
export type UpdateEventInput = z.infer<typeof UpdateEventSchema>;