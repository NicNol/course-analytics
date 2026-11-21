import { describe, expect, it } from "vitest";
import { deployedEnvSchema, siteEnvSchema, validateEnv } from "../../lib/envSchema";

const completeEnv = {
  MONGODB_URI: "mongodb://localhost:27017/course-analytics",
  CRON_KEY: "test-cron-key",
  GOOGLE_CLIENT_EMAIL: "scraper@course-analytics.iam.gserviceaccount.com",
  GOOGLE_PRIVATE_KEY: "-----BEGIN PRIVATE KEY-----\\nabc123\\n-----END PRIVATE KEY-----\\n",
};

describe("validateEnv with the deployed schema", () => {
  it("does not throw when every variable is set", () => {
    const validate = () => validateEnv(completeEnv, deployedEnvSchema);

    expect(validate).not.toThrow();
  });

  it("throws naming every missing variable at once when several are missing", () => {
    const incompleteEnv = { ...completeEnv, CRON_KEY: undefined, GOOGLE_PRIVATE_KEY: undefined };
    const validate = () => validateEnv(incompleteEnv, deployedEnvSchema);

    expect(validate).toThrow("CRON_KEY, GOOGLE_PRIVATE_KEY");
  });

  it("throws without naming variables that are set", () => {
    const validate = () => validateEnv({ ...completeEnv, CRON_KEY: undefined }, deployedEnvSchema);

    expect(validate).toThrow(/CRON_KEY/);
    expect(validate).not.toThrow(/MONGODB_URI|GOOGLE_CLIENT_EMAIL|GOOGLE_PRIVATE_KEY/);
  });

  it.each(["MONGODB_URI", "CRON_KEY", "GOOGLE_CLIENT_EMAIL", "GOOGLE_PRIVATE_KEY"])(
    "throws naming %s when the variable is empty",
    (variableName) => {
      const validate = () => validateEnv({ ...completeEnv, [variableName]: "" }, deployedEnvSchema);

      expect(validate).toThrow(variableName);
    },
  );

  it("throws pointing to .env.example when a variable is missing", () => {
    const validate = () => validateEnv({}, deployedEnvSchema);

    expect(validate).toThrow(".env.example");
  });
});

describe("validateEnv with the site schema", () => {
  it("does not throw when only the database variable is set", () => {
    const validate = () => validateEnv({ MONGODB_URI: completeEnv.MONGODB_URI }, siteEnvSchema);

    expect(validate).not.toThrow();
  });

  it("throws naming MONGODB_URI when the database variable is missing", () => {
    const validate = () => validateEnv({ CRON_KEY: completeEnv.CRON_KEY }, siteEnvSchema);

    expect(validate).toThrow("MONGODB_URI");
  });
});
