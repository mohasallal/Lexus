import * as z from "zod";

export const TimeSlotsSchema = z.object({
  id: z.number(),
  activityId: z.number(),
  startTime: z.string().nonempty("Start time is required"),
  endTime: z.string().nonempty("End time is required"),
  maxParticipants: z.number(),
  createdAt: z.string().optional(),
  registeredCount: z.number().optional(),
  availableSeats: z.number().optional(),
});

export type TimeSlot = z.infer<typeof TimeSlotsSchema>;
