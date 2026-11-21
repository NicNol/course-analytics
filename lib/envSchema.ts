import { z } from "zod";

const requiredString = z.string().min(1);

export const envSchema = z.object({
  MONGODB_URI: requiredString,
  CRON_KEY: requiredString,
  GOOGLE_CLIENT_EMAIL: requiredString,
  GOOGLE_PRIVATE_KEY: requiredString,
});

export type EnvName = keyof z.infer<typeof envSchema>;

export function validateEnv(source: Record<string, string | undefined>) {
  const result = envSchema.safeParse(source);
  if (result.success) return;

  const missingNames = [...new Set(result.error.issues.map((issue) => String(issue.path[0])))];
  throw new Error(`Missing required environment variables: ${missingNames.join(", ")}. See .env.example.`);
}
