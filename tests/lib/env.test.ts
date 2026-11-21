import { describe, expect, it, vi } from "vitest";
import { readEnv, requireEnv } from "../../lib/env";
import { completeEnv } from "../support/env";

describe("readEnv", () => {
  it("returns the value when the variable is set", () => {
    vi.stubEnv("MONGODB_URI", completeEnv.MONGODB_URI);

    const value = readEnv("MONGODB_URI");

    expect(value).toBe(completeEnv.MONGODB_URI);
  });

  it.each([
    ["is not set", undefined],
    ["is empty", ""],
  ])("returns undefined when the variable %s", (_scenario, unsetValue) => {
    vi.stubEnv("CRON_KEY", unsetValue);

    const value = readEnv("CRON_KEY");

    expect(value).toBeUndefined();
  });
});

describe("requireEnv", () => {
  it("returns the value when the variable is set", () => {
    vi.stubEnv("GOOGLE_CLIENT_EMAIL", completeEnv.GOOGLE_CLIENT_EMAIL);

    const value = requireEnv("GOOGLE_CLIENT_EMAIL");

    expect(value).toBe(completeEnv.GOOGLE_CLIENT_EMAIL);
  });

  it.each([
    ["is not set", undefined],
    ["is empty", ""],
  ])("throws naming the variable and .env.example when the variable %s", (_scenario, unsetValue) => {
    vi.stubEnv("MONGODB_URI", unsetValue);

    const readMongoUri = () => requireEnv("MONGODB_URI");

    expect(readMongoUri).toThrow("MONGODB_URI");
    expect(readMongoUri).toThrow(".env.example");
  });
});
