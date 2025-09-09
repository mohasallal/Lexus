import { z } from "zod";

export const timeSlotSchema = z.object({
  activityId: z.number(),
  startTime: z.string().nonempty("Start time is required"),
  endTime: z.string().nonempty("End time is required"),
  maxParticipants: z.number(),
});
