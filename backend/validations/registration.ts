import { z } from "zod";

export const registerationSchema = z.object({
  fname: z.string().min(1, "First name is required"),
  lname: z.string().min(1, "Last name is required"),
  email: z.email("Invalid email address").nonempty("Email is required"),
  phone: z.string().nonempty("Phone number is required"),
  activityId: z.number(),
  timeSlotId: z.number(),
});
