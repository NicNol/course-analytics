import type { EnvVariableName } from "./envSchema";

export function readEnv(name: EnvVariableName) {
  const value = process.env[name];
  return value === undefined || value === "" ? undefined : value;
}

export function requireEnv(name: EnvVariableName) {
  const value = readEnv(name);
  if (value === undefined) {
    throw new Error(`Missing required environment variable ${name}. See .env.example.`);
  }
  return value;
}
