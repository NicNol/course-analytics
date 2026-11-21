import { describe, expect, it, vi } from "vitest";
import { readEnv, requireEnv } from "../../lib/env";

describe("readEnv", () => {
  it("returns the value when the variable is set", () => {
    vi.stubEnv("MONGODB_URI", "mongodb://localhost:27017/course-analytics");

    const value = readEnv("MONGODB_URI");

    expect(value).toBe("mongodb://localhost:27017/course-analytics");
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
    vi.stubEnv("GOOGLE_CLIENT_EMAIL", "scraper@course-analytics.iam.gserviceaccount.com");

    const value = requireEnv("GOOGLE_CLIENT_EMAIL");

    expect(value).toBe("scraper@course-analytics.iam.gserviceaccount.com");
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
