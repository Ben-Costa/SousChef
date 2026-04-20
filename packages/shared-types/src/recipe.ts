import { z } from "zod";
import { ingredientSchema } from "./ingredient";

export const recipeSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1),
  description: z.string().min(1),
  servings: z.number().int().positive(),
  prepMinutes: z.number().int().nonnegative(),
  cookMinutes: z.number().int().nonnegative(),
  ingredients: z.array(ingredientSchema),
  steps: z.array(z.string().min(1)),
  tags: z.array(z.string()).default([])
});

export type Recipe = z.infer<typeof recipeSchema>;