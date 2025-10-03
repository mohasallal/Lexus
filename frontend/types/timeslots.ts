import * as z from "zod";

export const TimeSlostsSchema = z.object({
  id: z.number(),
  activityId: z.number(),
  startTime: z.string().nonempty("Start time is required"),
  endTime: z.string().nonempty("End time is required"),
  maxParticipants: z.number(),
});

export type TimeSlot = z.infer<typeof TimeSlostsSchema>;
