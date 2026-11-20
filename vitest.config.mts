import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    mockReset: true,
    restoreMocks: true,
    unstubEnvs: true,
    coverage: {
      provider: "v8",
      include: ["pages/**", "components/**", "scraper/src/**"],
      reporter: ["text-summary", "text"],
    },
  },
});
