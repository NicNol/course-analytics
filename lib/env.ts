import type { EnvName } from "./envSchema";

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
