import { z } from "zod";

export const roleEnum = z.enum(["USER", "ADMIN", "SUPERADMIN", "SUPERVISOR"]);

export const Role = roleEnum.enum;
export type RoleType = z.infer<typeof roleEnum>;

export const UserType = z.object({
  id: z.number(),
  fname: z.string(),
  lname: z.string(),
  email: z.email(),
  phone: z.string(),
  role: roleEnum,
});

export type User = z.infer<typeof UserType>;
