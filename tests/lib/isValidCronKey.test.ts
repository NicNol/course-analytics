import { describe, expect, it } from "vitest";
import { isValidCronKey } from "../../lib/isValidCronKey";

const cronKey = "test-cron-key";

describe("isValidCronKey", () => {
  it("returns true when the authorization header equals the cron key", () => {
    const isValid = isValidCronKey(cronKey, cronKey);

    expect(isValid).toBe(true);
  });

  it.each([
    ["differs from the cron key", "wrong-key"],
    ["is shorter than the cron key", "test"],
    ["is longer than the cron key", `${cronKey}-extra`],
    ["is empty", ""],
  ])("returns false when the authorization header %s", (_scenario, authorization) => {
    const isValid = isValidCronKey(authorization, cronKey);

    expect(isValid).toBe(false);
  });

  it("returns false when the authorization header is missing", () => {
    const isValid = isValidCronKey(undefined, cronKey);

    expect(isValid).toBe(false);
  });

  it.each([
    ["undefined", undefined],
    ["empty", ""],
  ])("returns false when the cron key is %s and the authorization header matches it", (_scenario, unsetKey) => {
    const isValid = isValidCronKey(unsetKey, unsetKey);

    expect(isValid).toBe(false);
  });
});
