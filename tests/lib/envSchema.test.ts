import { describe, expect, it } from "vitest";
import { validateEnv } from "../../lib/envSchema";
import { completeEnv, envNames } from "../support/env";

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

    expect(validate).toThrow("variables: CRON_KEY.");
  });

  it.each(envNames)("throws naming %s when the variable is empty", (variableName) => {
    const validate = () => validateEnv({ ...completeEnv, [variableName]: "" });

    expect(validate).toThrow(variableName);
  });

  it("throws pointing to .env.example when a variable is missing", () => {
    const validate = () => validateEnv({});

    expect(validate).toThrow(".env.example");
  });
});
