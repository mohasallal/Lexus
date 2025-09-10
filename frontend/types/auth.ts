import { z } from "zod";

export const UserType = z.object({
  id: z.number(),
  fname: z.string(),
  lname: z.string(),
  email: z.email(),
  phone: z.string(),
  role: z.enum(["USER", "ADMIN", "SUPERADMIN", "SUPERVISOR"]),
});
