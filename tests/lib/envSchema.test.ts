import { describe, expect, it } from "vitest";
import { validateEnv } from "../../lib/envSchema";

const completeEnv = {
  MONGODB_URI: "mongodb://localhost:27017/course-analytics",
  CRON_KEY: "test-cron-key",
  GOOGLE_CLIENT_EMAIL: "scraper@course-analytics.iam.gserviceaccount.com",
  GOOGLE_PRIVATE_KEY: "-----BEGIN PRIVATE KEY-----\\nabc123\\n-----END PRIVATE KEY-----\\n",
};

describe("validateEnv", () => {
  it("does not throw when every variable is set", () => {
    const validate = () => validateEnv(completeEnv);

    expect(validate).not.toThrow();
  });

  it("throws naming every missing variable at once when several are missing", () => {
    const incompleteEnv = { ...completeEnv, CRON_KEY: undefined, GOOGLE_PRIVATE_KEY: undefined };
    const validate = () => validateEnv(incompleteEnv);

    expect(validate).toThrow("CRON_KEY, GOOGLE_PRIVATE_KEY");
  });

  it("throws without naming variables that are set", () => {
    const validate = () => validateEnv({ ...completeEnv, CRON_KEY: undefined });

    expect(validate).toThrow(/CRON_KEY/);
    expect(validate).not.toThrow(/MONGODB_URI|GOOGLE_CLIENT_EMAIL|GOOGLE_PRIVATE_KEY/);
  });

  it.each(["MONGODB_URI", "CRON_KEY", "GOOGLE_CLIENT_EMAIL", "GOOGLE_PRIVATE_KEY"])(
    "throws naming %s when the variable is empty",
    (variableName) => {
      const validate = () => validateEnv({ ...completeEnv, [variableName]: "" });

      expect(validate).toThrow(variableName);
    },
  );

  it("throws pointing to .env.example when a variable is missing", () => {
    const validate = () => validateEnv({});

    expect(validate).toThrow(".env.example");
  });
});
