type EnvName = "MONGODB_URI" | "CRON_KEY" | "GOOGLE_CLIENT_EMAIL" | "GOOGLE_PRIVATE_KEY";

export function readEnv(name: EnvName) {
  const value = process.env[name];
  return value === undefined || value === "" ? undefined : value;
}

export function requireEnv(name: EnvName) {
  const value = readEnv(name);
  if (value === undefined) {
    throw new Error(`Missing required environment variable ${name}. See .env.example.`);
  }
  return value;
}
