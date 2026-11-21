import { beforeEach, describe, expect, it, vi } from "vitest";
import config from "../next.config";

describe("next config", () => {
  beforeEach(() => {
    vi.stubEnv("MONGODB_URI", "mongodb://localhost:27017/course-analytics");
    vi.stubEnv("CRON_KEY", "test-cron-key");
    vi.stubEnv("GOOGLE_CLIENT_EMAIL", "scraper@course-analytics.iam.gserviceaccount.com");
    vi.stubEnv("GOOGLE_PRIVATE_KEY", "-----BEGIN PRIVATE KEY-----\\nabc123\\n-----END PRIVATE KEY-----\\n");
  });

  it("returns the Next config when every variable is set", () => {
    const nextConfig = config();

    expect(nextConfig).toMatchObject({ reactStrictMode: true, compiler: { emotion: true } });
  });

  it.each(["MONGODB_URI", "CRON_KEY", "GOOGLE_CLIENT_EMAIL", "GOOGLE_PRIVATE_KEY"])(
    "throws naming %s when the variable is not set",
    (variableName) => {
      vi.stubEnv(variableName, undefined);
      const loadConfig = () => config();

      expect(loadConfig).toThrow(variableName);
    },
  );
});
