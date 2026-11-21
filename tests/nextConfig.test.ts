import { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD } from "next/constants";
import { beforeEach, describe, expect, it, vi } from "vitest";
import config from "../next.config";

describe("next config", () => {
  beforeEach(() => {
    vi.stubEnv("MONGODB_URI", "mongodb://localhost:27017/course-analytics");
    vi.stubEnv("CRON_KEY", "test-cron-key");
    vi.stubEnv("GOOGLE_CLIENT_EMAIL", "scraper@course-analytics.iam.gserviceaccount.com");
    vi.stubEnv("GOOGLE_PRIVATE_KEY", "-----BEGIN PRIVATE KEY-----\\nabc123\\n-----END PRIVATE KEY-----\\n");
  });

  it("returns the Next config when every variable is set during a production build", () => {
    const nextConfig = config(PHASE_PRODUCTION_BUILD);

    expect(nextConfig).toMatchObject({ reactStrictMode: true, compiler: { emotion: true } });
  });

  it.each(["MONGODB_URI", "CRON_KEY", "GOOGLE_CLIENT_EMAIL", "GOOGLE_PRIVATE_KEY"])(
    "throws naming %s when the variable is not set during a production build",
    (variableName) => {
      vi.stubEnv(variableName, undefined);
      const startBuild = () => config(PHASE_PRODUCTION_BUILD);

      expect(startBuild).toThrow(variableName);
    },
  );

  it("returns the Next config without the scraper variables during development", () => {
    vi.stubEnv("CRON_KEY", undefined);
    vi.stubEnv("GOOGLE_CLIENT_EMAIL", undefined);
    vi.stubEnv("GOOGLE_PRIVATE_KEY", undefined);

    const nextConfig = config(PHASE_DEVELOPMENT_SERVER);

    expect(nextConfig).toMatchObject({ reactStrictMode: true });
  });

  it("throws naming MONGODB_URI when the database variable is not set during development", () => {
    vi.stubEnv("MONGODB_URI", undefined);
    const startDevServer = () => config(PHASE_DEVELOPMENT_SERVER);

    expect(startDevServer).toThrow("MONGODB_URI");
  });
});
