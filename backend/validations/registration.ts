import { z } from "zod";

export const registerationSchema = z.object({
  userId: z.number(),
  timeSlotId: z.number(),
});
