import { z } from "zod";

export const ActivitySchema = z.object({
  name: z.string().min(1, "Name is required").nonempty("Name cannot be empty"),
  description: z
    .string()
    .min(1, "Description is required")
    .nonempty("Description cannot be empty"),
});

