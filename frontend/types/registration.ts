import * as z from "zod";

export const registerationSchema = z.object({
  id: z.number().optional(),
  userId: z.number(),
  timeSlotId: z.number(),
  createdAt: z.string().optional(),
});

export type Registration = z.infer<typeof registerationSchema>;
