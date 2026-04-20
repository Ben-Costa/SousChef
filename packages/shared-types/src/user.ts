import { z } from "zod";

export const userSchema = z.object({
  id: z.string().uuid().optional(),
  email: z.string().email(),
  displayName: z.string().min(1),
  dietaryPreferences: z.array(z.string()).default([])
});

export type UserProfile = z.infer<typeof userSchema>;