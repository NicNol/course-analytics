import { beforeEach, describe, expect, it, vi } from "vitest";
import config from "../next.config";
import { completeEnv, envNames } from "./support/env";

describe("next config", () => {
  beforeEach(() => {
    envNames.forEach((name) => vi.stubEnv(name, completeEnv[name]));
  });

  it("returns the Next config when every variable is set", () => {
    const nextConfig = config();

    expect(nextConfig).toStrictEqual({ reactStrictMode: true, compiler: { emotion: true } });
  });

  it.each(envNames)("throws naming %s when the variable is not set", (variableName) => {
    vi.stubEnv(variableName, undefined);

    expect(config).toThrow(variableName);
  });
});
