import { z } from "zod";

const requiredString = z.string().min(1);

export const siteEnvSchema = z.object({
  MONGODB_URI: requiredString,
});

export const deployedEnvSchema = siteEnvSchema.extend({
  CRON_KEY: requiredString,
  GOOGLE_CLIENT_EMAIL: requiredString,
  GOOGLE_PRIVATE_KEY: requiredString,
});

export type EnvName = keyof z.infer<typeof deployedEnvSchema>;

export function validateEnv(source: Record<string, string | undefined>, schema: typeof siteEnvSchema) {
  const result = schema.safeParse(source);
  if (result.success) return;

  const missingNames = [...new Set(result.error.issues.map((issue) => String(issue.path[0])))];
  throw new Error(`Missing required environment variables: ${missingNames.join(", ")}. See .env.example.`);
}
