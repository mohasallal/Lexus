import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Invalid email address").nonempty("Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .nonempty("Password is required"),
});

export const registerSchema = z.object({
  fname: z.string().min(1, "First name is required"),
  lname: z.string().min(1, "Last name is required"),
  email: z.email("Invalid email address").nonempty("Email is required"),
  phone: z.string().nonempty("Phone number is required"),
});

export const updateRoleSchema = z.object({
  id: z.number().min(1, "ID is required"),
  role: z.enum(["USER", "SUPERVISOR"]),
});
