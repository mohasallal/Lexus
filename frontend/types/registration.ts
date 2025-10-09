import * as z from "zod";
import { User } from "./auth";
import { TimeSlot } from "./timeslots";
import { Activity } from "./activities";

export const registerationSchema = z.object({
  id: z.number().optional(),
  userId: z.number(),
  timeSlotId: z.number(),
  createdAt: z.string().optional(),
});

// Extended registration type that includes joined data from the backend
export interface Registration {
  id: number;
  userId: number;
  timeSlotId: number;
  createdAt: string;
  user?: User | null;
  timeSlot?: TimeSlot | null;
  activity?: Activity | null;
}

// Basic registration type for form validation
export type BasicRegistration = z.infer<typeof registerationSchema>;
