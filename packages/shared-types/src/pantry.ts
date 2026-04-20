import { z } from "zod";
import { ingredientSchema } from "./ingredient";

export const pantryItemSchema = ingredientSchema.extend({
  expiresAt: z.string().datetime().optional(),
  inStock: z.boolean().default(true)
});

export type PantryItem = z.infer<typeof pantryItemSchema>;