import { z } from "zod";

export const registerationSchema = z.object({
  timeSlotId: z.number(),
});
