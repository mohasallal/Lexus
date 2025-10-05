import * as z from "zod";

export const ActivityType = z.object({
  id: z.number(),
  name: z.string().min(1, "Name is required").nonempty("Name cannot be empty"),
  description: z
    .string()
    .min(1, "Description is required")
    .nonempty("Description cannot be empty"),
  createdAt: z.string().optional(),
});

export type Activity = z.infer<typeof ActivityType>;
