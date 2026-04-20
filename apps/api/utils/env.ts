import { z } from "zod";

const apiEnvSchema = z.object({
  API_PORT: z.coerce.number().default(4000),
  OPENAI_API_KEY: z.string().optional(),
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional()
});

export const apiEnv = apiEnvSchema.parse(process.env);