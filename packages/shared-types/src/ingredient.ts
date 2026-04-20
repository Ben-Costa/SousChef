import { z } from "zod";

export const ingredientSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  quantity: z.number().nonnegative(),
  unit: z.string().min(1),
  notes: z.string().optional()
});

export type Ingredient = z.infer<typeof ingredientSchema>;